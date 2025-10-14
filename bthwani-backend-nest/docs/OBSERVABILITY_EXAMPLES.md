# Observability Examples - أمثلة عملية

## أمثلة استخدام كاملة

### 1. تتبع Order Creation Flow

```typescript
// src/modules/order/order.service.ts
import { Injectable } from '@nestjs/common';
import { AppLoggerService } from '../../common/services/logger.service';
import { MetricsService } from '../../common/services/metrics.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly logger: AppLoggerService,
    private readonly metricsService: MetricsService,
  ) {
    this.logger.setContext('OrderService');
  }

  async createOrder(dto: CreateOrderDto, req: any) {
    const correlationId = req.correlationId;
    const startTime = Date.now();

    // Log incoming request
    this.logger.log('Creating new order', {
      correlationId,
      userId: dto.userId,
      items: dto.items.length,
      totalAmount: dto.totalAmount,
    });

    try {
      // Validate order
      await this.validateOrder(dto, correlationId);

      // Create order
      const order = await this.orderRepository.save(dto);

      // Process payment
      await this.processPayment(order, correlationId);

      // Assign driver
      await this.assignDriver(order, correlationId);

      // Record metrics
      const duration = Date.now() - startTime;
      
      this.metricsService.incrementCounter('orders_created_total', 1, {
        status: 'success',
        paymentMethod: dto.paymentMethod,
      });

      this.metricsService.recordSummary('order_value', dto.totalAmount, {
        currency: 'SAR',
      });

      this.metricsService.observeHistogram(
        'order_creation_duration_seconds',
        duration / 1000
      );

      // Log success
      this.logger.logEvent('order_created', {
        correlationId,
        orderId: order.id,
        userId: dto.userId,
        duration,
        status: 'success',
      });

      return order;
    } catch (error) {
      // Record error metrics
      this.metricsService.incrementCounter('orders_created_total', 1, {
        status: 'failed',
        error: error.name,
      });

      // Log error
      this.logger.error(
        'Failed to create order',
        error.stack,
        {
          correlationId,
          userId: dto.userId,
          error: error.message,
          errorType: error.name,
        }
      );

      throw error;
    }
  }

  private async validateOrder(dto: CreateOrderDto, correlationId: string) {
    this.logger.debug('Validating order', { correlationId });

    // Validation logic
    if (dto.items.length === 0) {
      this.logger.warn('Order validation failed: empty items', { correlationId });
      throw new BadRequestException('Order must have at least one item');
    }

    this.logger.debug('Order validation successful', { correlationId });
  }

  private async processPayment(order: Order, correlationId: string) {
    const startTime = Date.now();

    this.logger.log('Processing payment', {
      correlationId,
      orderId: order.id,
      amount: order.totalAmount,
      paymentMethod: order.paymentMethod,
    });

    try {
      const result = await this.paymentGateway.charge({
        amount: order.totalAmount,
        orderId: order.id,
      });

      const duration = Date.now() - startTime;

      // Log external API call
      this.logger.logExternalCall(
        'payment-gateway',
        'POST /api/v1/charge',
        duration,
        200,
        {
          correlationId,
          orderId: order.id,
          transactionId: result.transactionId,
        }
      );

      // Record metrics
      this.metricsService.incrementCounter('payments_processed_total', 1, {
        status: 'success',
        method: order.paymentMethod,
      });

      this.metricsService.observeHistogram(
        'payment_processing_duration_seconds',
        duration / 1000
      );

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      this.logger.logExternalCall(
        'payment-gateway',
        'POST /api/v1/charge',
        duration,
        error.statusCode || 500,
        {
          correlationId,
          orderId: order.id,
          error: error.message,
        }
      );

      this.metricsService.incrementCounter('payments_processed_total', 1, {
        status: 'failed',
        error: error.name,
      });

      throw error;
    }
  }

  private async assignDriver(order: Order, correlationId: string) {
    this.logger.log('Assigning driver', {
      correlationId,
      orderId: order.id,
    });

    // Driver assignment logic
    const driver = await this.findAvailableDriver(order.location);

    if (!driver) {
      this.logger.warn('No available driver found', {
        correlationId,
        orderId: order.id,
        location: order.location,
      });

      this.metricsService.incrementCounter('driver_assignment_failed', 1, {
        reason: 'no_available_driver',
      });

      throw new Error('No available driver');
    }

    order.driverId = driver.id;
    await this.orderRepository.save(order);

    this.logger.logEvent('driver_assigned', {
      correlationId,
      orderId: order.id,
      driverId: driver.id,
      driverName: driver.name,
    });

    this.metricsService.incrementCounter('driver_assignments_total', 1, {
      status: 'success',
    });

    this.metricsService.setGauge('available_drivers', await this.countAvailableDrivers());

    return driver;
  }
}
```

---

### 2. تتبع Background Job Processing

```typescript
// src/queues/processors/order.processor.ts
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { AppLoggerService } from '../../common/services/logger.service';
import { MetricsService } from '../../common/services/metrics.service';

@Processor('order')
export class OrderProcessor {
  constructor(
    private readonly logger: AppLoggerService,
    private readonly metricsService: MetricsService,
  ) {
    this.logger.setContext('OrderProcessor');
  }

  @Process('process-order')
  async handleProcessOrder(job: Job) {
    const startTime = Date.now();
    const correlationId = job.data.correlationId;

    this.logger.log('Processing order job', {
      correlationId,
      jobId: job.id,
      orderId: job.data.orderId,
      attempt: job.attemptsMade + 1,
    });

    // Track active jobs
    this.metricsService.incrementGauge('order_jobs_active', 1);

    try {
      // Process order
      await this.processOrder(job.data, correlationId);

      const duration = Date.now() - startTime;

      // Log success
      this.logger.logEvent('order_job_completed', {
        correlationId,
        jobId: job.id,
        orderId: job.data.orderId,
        duration,
        status: 'success',
      });

      // Record metrics
      this.metricsService.incrementCounter('order_jobs_completed', 1, {
        status: 'success',
      });

      this.metricsService.observeHistogram(
        'order_job_duration_seconds',
        duration / 1000
      );

      return { success: true };
    } catch (error) {
      const duration = Date.now() - startTime;

      // Log error
      this.logger.error(
        'Order job failed',
        error.stack,
        {
          correlationId,
          jobId: job.id,
          orderId: job.data.orderId,
          duration,
          attempt: job.attemptsMade + 1,
          error: error.message,
        }
      );

      // Record metrics
      this.metricsService.incrementCounter('order_jobs_completed', 1, {
        status: 'failed',
        error: error.name,
      });

      throw error;
    } finally {
      // Decrement active jobs
      this.metricsService.decrementGauge('order_jobs_active', 1);
    }
  }
}
```

---

### 3. تتبع Database Operations

```typescript
// src/modules/order/order.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppLoggerService } from '../../common/services/logger.service';
import { MetricsService } from '../../common/services/metrics.service';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private readonly logger: AppLoggerService,
    private readonly metricsService: MetricsService,
  ) {
    this.logger.setContext('OrderRepository');
  }

  async findById(orderId: string, correlationId?: string): Promise<Order> {
    const startTime = Date.now();

    this.logger.debug('Finding order by ID', {
      correlationId,
      orderId,
    });

    try {
      const order = await this.orderModel.findById(orderId).exec();

      const duration = Date.now() - startTime;

      this.logger.logQuery(
        `db.orders.findById("${orderId}")`,
        duration,
        {
          correlationId,
          found: !!order,
        }
      );

      this.metricsService.observeHistogram(
        'db_query_duration_seconds',
        duration / 1000
      );

      this.metricsService.incrementCounter('db_queries_total', 1, {
        operation: 'findById',
        collection: 'orders',
        status: order ? 'found' : 'not_found',
      });

      return order;
    } catch (error) {
      const duration = Date.now() - startTime;

      this.logger.error(
        'Database query failed',
        error.stack,
        {
          correlationId,
          operation: 'findById',
          orderId,
          duration,
        }
      );

      this.metricsService.incrementCounter('db_errors_total', 1, {
        operation: 'findById',
        collection: 'orders',
        error: error.name,
      });

      throw error;
    }
  }

  async create(orderData: CreateOrderDto, correlationId?: string): Promise<Order> {
    const startTime = Date.now();

    this.logger.debug('Creating new order', {
      correlationId,
      userId: orderData.userId,
    });

    try {
      const order = new this.orderModel(orderData);
      const savedOrder = await order.save();

      const duration = Date.now() - startTime;

      this.logger.logQuery(
        'db.orders.insertOne()',
        duration,
        {
          correlationId,
          orderId: savedOrder.id,
        }
      );

      this.metricsService.observeHistogram(
        'db_write_duration_seconds',
        duration / 1000
      );

      this.metricsService.incrementCounter('db_writes_total', 1, {
        operation: 'insert',
        collection: 'orders',
        status: 'success',
      });

      return savedOrder;
    } catch (error) {
      this.logger.error(
        'Failed to create order',
        error.stack,
        {
          correlationId,
          error: error.message,
        }
      );

      this.metricsService.incrementCounter('db_errors_total', 1, {
        operation: 'insert',
        collection: 'orders',
      });

      throw error;
    }
  }
}
```

---

### 4. تتبع WebSocket Events

```typescript
// src/gateways/driver.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AppLoggerService } from '../common/services/logger.service';
import { MetricsService } from '../common/services/metrics.service';

@WebSocketGateway()
export class DriverGateway {
  constructor(
    private readonly logger: AppLoggerService,
    private readonly metricsService: MetricsService,
  ) {
    this.logger.setContext('DriverGateway');
  }

  handleConnection(client: Socket) {
    const correlationId = client.handshake.headers['x-correlation-id'];

    this.logger.log('Driver connected', {
      correlationId,
      socketId: client.id,
      driverId: client.data.driverId,
    });

    this.metricsService.incrementGauge('websocket_connections_active', 1, {
      type: 'driver',
    });

    this.metricsService.incrementCounter('websocket_connections_total', 1, {
      type: 'driver',
      event: 'connect',
    });
  }

  handleDisconnect(client: Socket) {
    const correlationId = client.handshake.headers['x-correlation-id'];

    this.logger.log('Driver disconnected', {
      correlationId,
      socketId: client.id,
      driverId: client.data.driverId,
    });

    this.metricsService.decrementGauge('websocket_connections_active', 1, {
      type: 'driver',
    });

    this.metricsService.incrementCounter('websocket_connections_total', 1, {
      type: 'driver',
      event: 'disconnect',
    });
  }

  @SubscribeMessage('location-update')
  handleLocationUpdate(
    @MessageBody() data: LocationUpdateDto,
    @ConnectedSocket() client: Socket,
  ) {
    const correlationId = client.handshake.headers['x-correlation-id'];
    const startTime = Date.now();

    this.logger.debug('Received location update', {
      correlationId,
      driverId: data.driverId,
      lat: data.latitude,
      lng: data.longitude,
    });

    try {
      // Process location update
      this.processLocationUpdate(data);

      const duration = Date.now() - startTime;

      this.metricsService.incrementCounter('websocket_messages_total', 1, {
        type: 'location-update',
        status: 'success',
      });

      this.metricsService.observeHistogram(
        'websocket_message_duration_seconds',
        duration / 1000
      );

      return { success: true };
    } catch (error) {
      this.logger.error(
        'Failed to process location update',
        error.stack,
        {
          correlationId,
          driverId: data.driverId,
        }
      );

      this.metricsService.incrementCounter('websocket_messages_total', 1, {
        type: 'location-update',
        status: 'failed',
      });

      throw error;
    }
  }
}
```

---

### 5. Monitoring Dashboard Queries

#### Grafana Queries

**Panel: Orders Created per Minute**
```promql
sum(rate(orders_created_total{status="success"}[1m])) * 60
```

**Panel: Average Order Value**
```promql
order_value_sum / order_value_count
```

**Panel: Payment Success Rate**
```promql
sum(rate(payments_processed_total{status="success"}[5m])) 
  / sum(rate(payments_processed_total[5m]))
  * 100
```

**Panel: API Response Time (P95)**
```promql
histogram_quantile(0.95, 
  sum(rate(http_request_duration_seconds_bucket[5m])) by (le, route)
)
```

**Panel: Active WebSocket Connections**
```promql
websocket_connections_active
```

**Panel: Database Query Latency**
```promql
rate(db_query_duration_seconds_sum[5m]) 
  / rate(db_query_duration_seconds_count[5m])
```

---

### 6. Log Queries في Kibana/Elasticsearch

**تتبع order lifecycle كامل:**
```
correlationId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

**البحث عن orders فاشلة:**
```
context: "OrderService" AND level: "ERROR" AND message: *"Failed to create order"*
```

**البحث عن slow requests:**
```
duration: >2000 AND context: "HTTP"
```

**البحث عن payment failures:**
```
context: "OrderService" AND message: *"payment"* AND level: "ERROR"
```

**تحليل user activity:**
```
userId: "user-123" AND timestamp: [NOW-1h TO NOW]
```

---

## أفضل الممارسات

1. **استخدم correlation IDs دائماً** في كل log entry
2. **أضف context غني** بمعلومات مفيدة
3. **سجّل events مهمة** (order_created, payment_processed, etc.)
4. **راقب metrics في real-time** باستخدام Grafana
5. **أنشئ alerts** للمشاكل الحرجة
6. **استخدم log levels مناسبة** (debug في development فقط)
7. **لا تسجل معلومات حساسة** (passwords, tokens, credit cards)


