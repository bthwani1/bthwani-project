import { Controller, Get, Post, Body, Param, Query, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';

@ApiTags('الدفع والسداد - طبقة موحدة فوق Wallet/Finance')
@Controller('api/v2/payments')
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {} 

  @Post('holds')
  @ApiOperation({ summary: 'Create hold (عربون)' })
  createHold(@Body() dto: any) {
    return this.service.createHold(dto);
  }

  @Post('holds/:holdId/release')
  @ApiOperation({ summary: 'Release held funds' })
  release(@Param('holdId') holdId: string) {
    return this.service.release(holdId);
  }

  @Post('holds/:holdId/refund')
  @ApiOperation({ summary: 'Refund held funds' })
  refund(@Param('holdId') holdId: string, @Body() dto: any) {
    return this.service.refund(holdId, dto?.reason || 'unspecified');
  }
}
