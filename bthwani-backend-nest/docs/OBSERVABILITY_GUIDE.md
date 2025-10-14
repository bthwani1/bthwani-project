# Observability Guide - دليل المراقبة والتتبع

## نظرة عامة

نظام مراقبة شامل للتطبيق يتضمن Correlation IDs، Structured Logging، وMetrics مع دعم Prometheus و Grafana.

## المكونات

### 1. Correlation IDs

#### الوصف
معرفات فريدة لتتبع الطلبات عبر جميع الخدمات والمكونات.

#### التنفيذ
```typescript
// src/common/middleware/correlation-id.middleware.ts
```

#### الميزات
- ✅ توليد تلقائي لـ UUID لكل طلب
- ✅ دعم correlation ID من headers
- ✅ إضافة الـ ID في response headers
- ✅ تتبع وقت بدء الطلب

#### الاستخدام

**في Client:**
```bash
# إرسال correlation ID من العميل
curl -H "X-Correlation-ID: my-custom-id-123" http://localhost:3000/api/orders
```

**في Response:**
```http
HTTP/1.1 200 OK
X-Correlation-ID: my-custom-id-123
X-Request-ID: my-custom-id-123
X-Powered-By: Bthwani
```

**في الكود:**
```typescript
@Injectable()
export class OrderService {
  async createOrder(@Req() req: any, dto: CreateOrderDto) {
    const correlationId = req.correlationId;
    
    this.logger.log('Creating order', {
      correlationId,
      userId: dto.userId,
      amount: dto.amount,
    });
  }
}
```

---

### 2. Structured Logging

#### الوصف
نظام logging متقدم مع دعم JSON formatting و context enrichment.

#### التنفيذ
```typescript
// src/common/services/logger.service.ts
```

#### الميزات
- ✅ JSON format في production
- ✅ Human-readable format في development
- ✅ Context-aware logging
- ✅ مستويات متعددة (log, error, warn, debug, verbose)
- ✅ دعم correlation IDs
- ✅ Automatic timestamping
- ✅ PID tracking

#### الاستخدام

**Basic Logging:**
```typescript
import { AppLoggerService } from './common/services/logger.service';

@Injectable()
export class OrderService {
  constructor(private readonly logger: AppLoggerService) {
    this.logger.setContext('OrderService');
  }

  async createOrder(dto: CreateOrderDto) {
    // Simple log
    this.logger.log('Order created successfully');

    // Log with context
    this.logger.log('Order created', {
      orderId: order.id,
      userId: dto.userId,
      amount: dto.amount,
      correlationId: req.correlationId,
    });

    // Error log
    this.logger.error('Failed to create order', error.stack, {
      orderId: dto.orderId,
      error: error.message,
    });

    // Warning
    this.logger.warn('Low stock detected', {
      productId: product.id,
      stock: product.stock,
    });

    // Debug (only in development or LOG_LEVEL=debug)
    this.logger.debug('Processing payment', {
      paymentMethod: dto.paymentMethod,
      amount: dto.amount,
    });
  }
}
```

**Event Logging:**
```typescript
this.logger.logEvent('order_created', {
  correlationId: req.correlationId,
  orderId: order.id,
  userId: user.id,
  amount: order.total,
  paymentMethod: order.paymentMethod,
});
```

**HTTP Request Logging:**
```typescript
// Automatic via LoggingInterceptor
// Manual:
this.logger.logRequest(req, statusCode, duration);
```

**Database Query Logging:**
```typescript
this.logger.logQuery(
  'db.users.findOne({ _id: "..." })',
  120, // duration in ms
  {
    correlationId: req.correlationId,
    collection: 'users',
  }
);
```

**External API Logging:**
```typescript
this.logger.logExternalCall(
  'payment-gateway',
  'POST /api/v1/charge',
  450, // duration in ms
  200, // status code
  {
    correlationId: req.correlationId,
    amount: 100,
  }
);
```

#### Log Formats

**Development Format:**
```
[2025-10-14T10:00:00.000Z] [INFO] [OrderService][a1b2c3d4] Order created
  Context: {
    "orderId": "123",
    "userId": "456",
    "amount": 100
  }
```

**Production Format (JSON):**
```json
{
  "timestamp": "2025-10-14T10:00:00.000Z",
  "level": "INFO",
  "context": "OrderService",
  "message": "Order created",
  "correlationId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "orderId": "123",
  "userId": "456",
  "amount": 100,
  "environment": "production",
  "pid": 12345
}
```

---

### 3. Metrics System

#### الوصف
نظام metrics شامل مع دعم Prometheus format و JSON.

#### التنفيذ
```typescript
// src/common/services/metrics.service.ts
// src/common/interceptors/metrics.interceptor.ts
```

#### أنواع Metrics

##### Counters (العدادات)
قيم تتزايد فقط (مثل عدد الطلبات)

```typescript
// Increment counter
this.metricsService.incrementCounter('orders_created_total', 1, {
  status: 'success',
  paymentMethod: 'credit_card',
});
```

##### Gauges (المقاييس)
قيم يمكن أن تزيد أو تنقص (مثل عدد المستخدمين النشطين)

```typescript
// Set gauge value
this.metricsService.setGauge('active_users', 150);

// Increment gauge
this.metricsService.incrementGauge('concurrent_requests', 1);

// Decrement gauge
this.metricsService.decrementGauge('concurrent_requests', 1);
```

##### Histograms (التوزيعات)
توزيع القيم في buckets (مثل أوقات الاستجابة)

```typescript
this.metricsService.observeHistogram(
  'request_duration_seconds',
  0.245, // value in seconds
  [0.1, 0.5, 1, 2, 5] // buckets
);
```

##### Summaries (الملخصات)
إحصائيات شاملة (min, max, avg, count)

```typescript
this.metricsService.recordSummary('order_value', 150.50, {
  currency: 'SAR',
  category: 'electronics',
});
```

#### Metrics Endpoints

**Prometheus Format:**
```http
GET /metrics
Content-Type: text/plain; version=0.0.4
```

**JSON Format:**
```http
GET /metrics/json
```

#### Metrics المتاحة تلقائياً

**HTTP Metrics:**
- `http_requests_total` - إجمالي الطلبات
- `http_requests_active` - الطلبات النشطة الحالية
- `http_responses_total` - إجمالي الردود (بحسب status code)
- `http_requests_successful` - الطلبات الناجحة
- `http_requests_failed` - الطلبات الفاشلة
- `http_errors_total` - إجمالي الأخطاء
- `http_request_duration_seconds` - مدة الطلب (histogram)
- `http_request_duration_ms` - مدة الطلب بالميلي ثانية (summary)

**System Metrics:**
- `nodejs_memory_heap_used_bytes` - الذاكرة المستخدمة
- `nodejs_memory_heap_total_bytes` - إجمالي الذاكرة
- `nodejs_memory_rss_bytes` - RSS memory
- `nodejs_memory_external_bytes` - External memory
- `nodejs_cpu_user_seconds_total` - CPU user time
- `nodejs_cpu_system_seconds_total` - CPU system time
- `nodejs_process_uptime_seconds` - وقت تشغيل التطبيق

#### مثال على Custom Metrics

```typescript
@Injectable()
export class OrderService {
  constructor(
    private readonly metricsService: MetricsService,
    private readonly logger: AppLoggerService,
  ) {}

  async createOrder(dto: CreateOrderDto) {
    const startTime = Date.now();

    try {
      // Business logic
      const order = await this.orderRepository.save(dto);

      // Record success metrics
      this.metricsService.incrementCounter('orders_created_total', 1, {
        status: 'success',
        paymentMethod: dto.paymentMethod,
      });

      this.metricsService.recordSummary('order_value', dto.amount, {
        currency: 'SAR',
      });

      const duration = (Date.now() - startTime) / 1000;
      this.metricsService.observeHistogram('order_creation_duration', duration);

      return order;
    } catch (error) {
      // Record failure metrics
      this.metricsService.incrementCounter('orders_created_total', 1, {
        status: 'failed',
        error: error.name,
      });

      throw error;
    }
  }

  async processPayment(orderId: string) {
    // Track active payment processing
    this.metricsService.incrementGauge('payments_processing', 1);

    try {
      // Process payment
      await this.paymentGateway.charge(...);

      this.metricsService.incrementCounter('payments_successful', 1);
    } finally {
      this.metricsService.decrementGauge('payments_processing', 1);
    }
  }
}
```

---

### 4. Logging Interceptor

#### الوصف
Interceptor تلقائي لتسجيل جميع HTTP requests و responses.

#### الميزات
- ✅ تسجيل تلقائي لجميع الطلبات
- ✅ قياس مدة الطلب
- ✅ تسجيل الأخطاء مع stack traces
- ✅ دعم correlation IDs

#### مثال على Logs

**Successful Request:**
```json
{
  "timestamp": "2025-10-14T10:00:00.000Z",
  "level": "INFO",
  "context": "HTTP",
  "message": "GET /api/orders 200 - 45ms",
  "correlationId": "a1b2c3d4",
  "method": "GET",
  "url": "/api/orders",
  "statusCode": 200,
  "duration": 45,
  "ip": "192.168.1.1",
  "userId": "user-123"
}
```

**Failed Request:**
```json
{
  "timestamp": "2025-10-14T10:00:00.000Z",
  "level": "ERROR",
  "context": "HTTP",
  "message": "POST /api/orders 400 - 12ms",
  "correlationId": "a1b2c3d4",
  "method": "POST",
  "url": "/api/orders",
  "statusCode": 400,
  "duration": 12,
  "errorMessage": "Validation failed",
  "errorName": "BadRequestException",
  "trace": "..."
}
```

---

### 5. Metrics Interceptor

#### الوصف
Interceptor تلقائي لتسجيل metrics لجميع HTTP requests.

#### الميزات
- ✅ تتبع عدد الطلبات
- ✅ قياس أوقات الاستجابة
- ✅ تتبع الطلبات النشطة
- ✅ تصنيف حسب status code
- ✅ تتبع معدل النجاح/الفشل

---

## التكامل مع أنظمة المراقبة

### Prometheus

#### تكوين Prometheus

**prometheus.yml:**
```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'bthwani-backend'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/metrics'
    scrape_interval: 10s
```

#### تشغيل Prometheus
```bash
# باستخدام Docker
docker run -d \
  --name prometheus \
  -p 9090:9090 \
  -v $(pwd)/prometheus.yml:/etc/prometheus/prometheus.yml \
  prom/prometheus
```

#### الوصول
```
http://localhost:9090
```

#### Query Examples

**معدل الطلبات في الدقيقة:**
```promql
rate(http_requests_total[1m])
```

**متوسط وقت الاستجابة:**
```promql
rate(http_request_duration_seconds_sum[5m]) 
  / rate(http_request_duration_seconds_count[5m])
```

**معدل الأخطاء:**
```promql
sum(rate(http_requests_failed[5m])) 
  / sum(rate(http_requests_total[5m]))
```

**الذاكرة المستخدمة (MB):**
```promql
nodejs_memory_heap_used_bytes / 1024 / 1024
```

---

### Grafana

#### تكوين Grafana

**تشغيل Grafana:**
```bash
docker run -d \
  --name grafana \
  -p 3001:3000 \
  grafana/grafana
```

**الوصول:**
```
http://localhost:3001
Username: admin
Password: admin
```

#### إضافة Data Source

1. Settings → Data Sources → Add data source
2. اختر Prometheus
3. URL: `http://prometheus:9090`
4. Save & Test

#### Dashboard Examples

**Panel 1: Request Rate**
```promql
sum(rate(http_requests_total[5m])) by (method, route)
```

**Panel 2: Response Time (P95)**
```promql
histogram_quantile(0.95, 
  sum(rate(http_request_duration_seconds_bucket[5m])) by (le)
)
```

**Panel 3: Error Rate**
```promql
sum(rate(http_requests_failed[5m])) by (route, status)
```

**Panel 4: Active Requests**
```promql
http_requests_active
```

**Panel 5: Memory Usage**
```promql
nodejs_memory_heap_used_bytes / 1024 / 1024
```

**Panel 6: CPU Usage**
```promql
rate(nodejs_cpu_user_seconds_total[1m]) * 100
```

---

### ELK Stack (Elasticsearch, Logstash, Kibana)

#### تكوين Logstash

**logstash.conf:**
```conf
input {
  file {
    path => "/var/log/bthwani/*.log"
    codec => "json"
    type => "bthwani"
  }
}

filter {
  if [type] == "bthwani" {
    json {
      source => "message"
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "bthwani-logs-%{+YYYY.MM.dd}"
  }
}
```

#### Query Examples في Kibana

**البحث عن correlation ID معين:**
```
correlationId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

**البحث عن أخطاء:**
```
level: "ERROR"
```

**البحث عن طلبات بطيئة:**
```
duration: >1000 AND level: "INFO"
```

---

## أفضل الممارسات

### 1. Correlation IDs
- ✅ استخدم correlation ID في كل log entry
- ✅ مرر correlation ID إلى الخدمات الخارجية
- ✅ احفظ correlation ID في قاعدة البيانات للطلبات المهمة

### 2. Logging
- ✅ استخدم المستوى المناسب (debug, info, warn, error)
- ✅ أضف context غني بالمعلومات
- ✅ لا تسجل معلومات حساسة (passwords, tokens)
- ✅ استخدم structured logging دائماً

### 3. Metrics
- ✅ سمّ metrics بشكل واضح ووصفي
- ✅ استخدم labels للتصنيف
- ✅ لا تفرط في عدد labels (cardinality)
- ✅ راقب metrics بانتظام

### 4. Performance
- ✅ Logging asynchronous عند الإمكان
- ✅ تجنب logging في hot paths
- ✅ استخدم sampling للطلبات ذات traffic عالي

---

## الاختبار

### Testing Correlation IDs
```bash
# إرسال طلب مع correlation ID
curl -H "X-Correlation-ID: test-123" http://localhost:3000/api/health

# التحقق من response headers
# يجب أن يحتوي على X-Correlation-ID: test-123
```

### Testing Logging
```bash
# تشغيل في development mode
npm run start:dev

# مراقبة logs
tail -f logs/app.log

# إرسال طلبات
curl http://localhost:3000/api/orders
```

### Testing Metrics
```bash
# Prometheus format
curl http://localhost:3000/metrics

# JSON format
curl http://localhost:3000/metrics/json | jq .
```

---

## استكشاف الأخطاء

### Logs لا تظهر
- تحقق من `NODE_ENV` و `LOG_LEVEL`
- تأكد من تسجيل AppLoggerService في providers
- تحقق من console output

### Metrics لا تُسجل
- تأكد من تفعيل MetricsInterceptor
- تحقق من `/metrics` endpoint
- راجع console للأخطاء

### Correlation ID مفقود
- تأكد من تطبيق CorrelationIdMiddleware
- تحقق من ترتيب middleware في app.module
- راجع request headers

---

## الخلاصة

نظام Observability الكامل يوفر:
- 🔍 **Tracing**: تتبع الطلبات عبر correlation IDs
- 📝 **Logging**: structured logging شامل
- 📊 **Metrics**: قياس الأداء والصحة
- 🔔 **Alerting**: دعم Prometheus alerts
- 📈 **Visualization**: دعم Grafana dashboards

**جميع الميزات نشطة ومُكوّنة تلقائياً!**

