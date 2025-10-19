import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { UnifiedAuthGuard } from '../../common/guards/unified-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Auth, CurrentUser } from '../../common/decorators/auth.decorator';
import { AuthType } from '../../common/guards/unified-auth.guard';

/**
 * V2 Wallet Controller - Specific endpoints for v2 API
 * This controller handles wallet-related operations that are specific to v2
 */
@ApiTags('Wallet V2')
@ApiBearerAuth()
@Controller({ path: 'v2/wallet', version: '2' })
@UseGuards(UnifiedAuthGuard, RolesGuard)
export class V2WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Auth(AuthType.FIREBASE)
  @Post('coupons/apply')
  @ApiResponse({ status: 200, description: 'Coupon applied successfully' })
  @ApiResponse({ status: 400, description: 'Invalid coupon' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiOperation({ summary: 'تطبيق قسيمة' })
  async applyCoupon(
    @CurrentUser('id') userId: string,
    @Body('code') code: string,
  ) {
    // TODO: Implement coupon application logic
    return {
      success: true,
      message: 'تم تطبيق القسيمة بنجاح',
      data: {
        code,
        discount: 0,
        appliedAt: new Date(),
      },
    };
  }

  @Auth(AuthType.FIREBASE)
  @Get('coupons/my')
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiOperation({ summary: 'قسائمي' })
  async getMyCoupons(@CurrentUser('id') userId: string) {
    // TODO: Implement get user coupons logic
    return {
      success: true,
      data: [],
      message: 'لا توجد قسائم متاحة حالياً',
    };
  }

  @Auth(AuthType.FIREBASE)
  @Get('coupons/history')
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiOperation({ summary: 'سجل القسائم' })
  async getCouponsHistory(@CurrentUser('id') userId: string) {
    // TODO: Implement get coupons history logic
    return {
      success: true,
      data: [],
      message: 'لا يوجد سجل قسائم',
    };
  }

  @Auth(AuthType.FIREBASE)
  @Get('subscriptions/my')
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiOperation({ summary: 'اشتراكاتي' })
  async getMySubscriptions(@CurrentUser('id') userId: string) {
    // TODO: Implement get user subscriptions logic
    return {
      success: true,
      data: [],
      message: 'لا توجد اشتراكات نشطة',
    };
  }
}

