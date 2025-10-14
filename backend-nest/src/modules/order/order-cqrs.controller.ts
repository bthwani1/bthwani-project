import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UnifiedAuthGuard } from '../../common/guards/unified-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Auth, Roles, CurrentUser } from '../../common/decorators/auth.decorator';
import { AuthType } from '../../common/guards/unified-auth.guard';

// Commands
import { CreateOrderCommand } from './commands/impl/create-order.command';
import { UpdateOrderStatusCommand } from './commands/impl/update-order-status.command';
import { AssignDriverCommand } from './commands/impl/assign-driver.command';
import { CancelOrderCommand } from './commands/impl/cancel-order.command';

// Queries
import { GetOrderQuery } from './queries/impl/get-order.query';
import { GetUserOrdersQuery } from './queries/impl/get-user-orders.query';

// DTOs
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { CursorPaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Orders (CQRS)')
@ApiBearerAuth()
@Controller('orders-cqrs')
@UseGuards(UnifiedAuthGuard, RolesGuard)
export class OrderCqrsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  // ==================== Commands (Write Operations) ====================

  @Auth(AuthType.FIREBASE)
  @Post()
  @ApiOperation({
    summary: 'إنشاء طلب جديد (CQRS)',
    description: 'ينشئ طلب جديد باستخدام CQRS Pattern',
  })
  async create(
    @CurrentUser('id') userId: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    const command = new CreateOrderCommand(
      userId,
      createOrderDto.items as any,
      createOrderDto.address,
      createOrderDto.paymentMethod,
      createOrderDto.price,
      createOrderDto.deliveryFee,
      createOrderDto.companyShare,
      createOrderDto.platformShare,
      createOrderDto.walletUsed,
      (createOrderDto as any).coupon?.code,
    );

    const order = await this.commandBus.execute(command);

    return {
      success: true,
      message: 'تم إنشاء الطلب بنجاح',
      data: order,
    };
  }

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @Patch(':id/status')
  @ApiOperation({ summary: 'تحديث حالة طلب (CQRS)' })
  async updateStatus(
    @Param('id') orderId: string,
    @Body() updateStatusDto: UpdateOrderStatusDto,
    @CurrentUser('id') adminId: string,
  ) {
    const command = new UpdateOrderStatusCommand(
      orderId,
      updateStatusDto.status as any,
      updateStatusDto.changedBy || 'admin',
      updateStatusDto.reason,
    );

    const order = await this.commandBus.execute(command);

    return {
      success: true,
      message: 'تم تحديث حالة الطلب',
      data: order,
    };
  }

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @Post(':id/assign-driver')
  @ApiOperation({ summary: 'تعيين سائق للطلب (CQRS)' })
  async assignDriver(
    @Param('id') orderId: string,
    @Body() body: { driverId: string },
    @CurrentUser('id') adminId: string,
  ) {
    const command = new AssignDriverCommand(orderId, body.driverId, 'admin');

    const order = await this.commandBus.execute(command);

    return {
      success: true,
      message: 'تم تعيين السائق بنجاح',
      data: order,
    };
  }

  @Auth(AuthType.FIREBASE)
  @Post(':id/cancel')
  @ApiOperation({ summary: 'إلغاء طلب (CQRS)' })
  async cancel(
    @Param('id') orderId: string,
    @Body() body: { reason: string },
    @CurrentUser('id') userId: string,
  ) {
    const command = new CancelOrderCommand(
      orderId,
      body.reason,
      'customer',
      userId,
    );

    const order = await this.commandBus.execute(command);

    return {
      success: true,
      message: 'تم إلغاء الطلب',
      data: order,
    };
  }

  // ==================== Queries (Read Operations) ====================

  @Auth(AuthType.FIREBASE)
  @Get(':id')
  @ApiOperation({ summary: 'جلب طلب محدد (CQRS)' })
  async findOne(@Param('id') orderId: string) {
    const query = new GetOrderQuery(orderId);
    const order = await this.queryBus.execute(query);

    return {
      success: true,
      data: order,
    };
  }

  @Auth(AuthType.FIREBASE)
  @Get()
  @ApiOperation({ summary: 'جلب طلبات المستخدم (CQRS)' })
  async findUserOrders(
    @CurrentUser('id') userId: string,
    @Query() pagination: CursorPaginationDto,
  ) {
    const query = new GetUserOrdersQuery(userId, pagination);
    const result = await this.queryBus.execute(query);

    return {
      success: true,
      ...result,
    };
  }
}

