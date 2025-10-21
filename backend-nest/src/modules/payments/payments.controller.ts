import { Controller, Get, Post, Body, Param, Query, Patch, Delete, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiConsumes,
  ApiProduces
} from '@nestjs/swagger';
import { PaymentsService } from './payments.service';

@ApiTags('الدفع والسداد - طبقة موحدة فوق Wallet/Finance')
@ApiBearerAuth()
@ApiConsumes('application/json')
@ApiProduces('application/json')
@Controller('api/v2/payments')
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Post('holds')
  @ApiOperation({ summary: 'إنشاء عربون (حجز أموال)', description: 'حجز مبلغ من أموال المستخدم كعربون' })
  @ApiBody({
    description: 'بيانات العربون',
    schema: {
      type: 'object',
      required: ['userId', 'amount', 'reference'],
      properties: {
        userId: { type: 'string', example: '507f1f77bcf86cd799439011' },
        amount: { type: 'number', example: 100.50 },
        reference: { type: 'string', example: 'order-123' }
      }
    }
  })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'تم إنشاء العربون بنجاح' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'بيانات غير صحيحة' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'غير مخول' })
  createHold(@Body() dto: { userId: string; amount: number; reference: string }) {
    return this.service.createHold(dto);
  }

  @Post('holds/:holdId/release')
  @ApiOperation({ summary: 'إطلاق الأموال المحجوزة', description: 'إطلاق الأموال المحجوزة في العربون' })
  @ApiParam({ name: 'holdId', description: 'معرف العربون', example: '507f1f77bcf86cd799439012' })
  @ApiResponse({ status: HttpStatus.OK, description: 'تم إطلاق الأموال بنجاح' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'العربون غير موجود' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'غير مخول' })
  release(@Param('holdId') holdId: string) {
    return this.service.release(holdId);
  }

  @Post('holds/:holdId/refund')
  @ApiOperation({ summary: 'استرداد الأموال المحجوزة', description: 'استرداد الأموال المحجوزة إلى حساب المستخدم' })
  @ApiParam({ name: 'holdId', description: 'معرف العربون', example: '507f1f77bcf86cd799439012' })
  @ApiBody({
    description: 'بيانات الاسترداد',
    schema: {
      type: 'object',
      properties: {
        reason: { type: 'string', example: 'إلغاء الطلب' }
      }
    }
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'تم الاسترداد بنجاح' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'العربون غير موجود' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'غير مخول' })
  refund(@Param('holdId') holdId: string, @Body() dto?: { reason?: string }) {
    return this.service.refund(holdId, dto?.reason || 'unspecified');
  }

  @Get('holds/:holdId')
  @ApiOperation({ summary: 'تفاصيل عربون', description: 'استرجاع تفاصيل عربون محدد' })
  @ApiParam({ name: 'holdId', description: 'معرف العربون', example: '507f1f77bcf86cd799439012' })
  @ApiResponse({ status: HttpStatus.OK, description: 'تم الاسترجاع بنجاح' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'العربون غير موجود' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'غير مخول' })
  getHold(@Param('holdId') holdId: string) {
    return this.service.getHold(holdId);
  }

  @Get('holds/my')
  @ApiOperation({ summary: 'أعرابيني', description: 'استرجاع قائمة الأعرابين الخاصة بالمستخدم الحالي' })
  @ApiResponse({ status: HttpStatus.OK, description: 'تم الاسترجاع بنجاح' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'غير مخول' })
  getMyHolds() {
    // يجب استخراج userId من JWT
    const userId = 'test-user'; // placeholder
    return this.service.getHoldsByUser(userId);
  }
}
