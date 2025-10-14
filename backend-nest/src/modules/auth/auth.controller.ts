import { Controller, Post, Body, UseGuards, Get, Patch, Delete, Param, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { ConsentService } from './services/consent.service';
import { RegisterDto } from './dto/register.dto';
import { FirebaseAuthDto } from './dto/firebase-auth.dto';
import { ConsentDto, BulkConsentDto, ConsentType } from './dto/consent.dto';
import { UnifiedAuthGuard } from '../../common/guards/unified-auth.guard';
import {
  Auth,
  CurrentUser,
  Public,
} from '../../common/decorators/auth.decorator';
import { AuthType } from '../../common/guards/unified-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly consentService: ConsentService,
  ) {}

  @Public()
  @Throttle({ auth: { ttl: 60000, limit: 5 } })  // ✅ 5 محاولات تسجيل دخول في الدقيقة
  @Post('firebase/login')
  @ApiOperation({ summary: 'تسجيل الدخول عبر Firebase' })
  async loginWithFirebase(@Body() firebaseAuthDto: FirebaseAuthDto) {
    return this.authService.loginWithFirebase(firebaseAuthDto.idToken);
  }

  @ApiBearerAuth()
  @UseGuards(UnifiedAuthGuard)
  @Auth(AuthType.FIREBASE)
  @SkipThrottle()  // ✅ لا rate limiting على القراءة
  @Get('me')
  @ApiOperation({ summary: 'جلب بيانات المستخدم الحالي' })
  async getProfile(@CurrentUser('id') userId: string) {
    return this.authService.getProfile(userId);
  }

  @ApiBearerAuth()
  @UseGuards(UnifiedAuthGuard)
  @Auth(AuthType.FIREBASE)
  @Patch('profile')
  @ApiOperation({ summary: 'تحديث الملف الشخصي' })
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() updateDto: Partial<RegisterDto>,
  ) {
    return this.authService.updateProfile(userId, updateDto);
  }

  // ==================== Consent Management ====================

  @ApiBearerAuth()
  @UseGuards(UnifiedAuthGuard)
  @Auth(AuthType.FIREBASE)
  @Throttle({ strict: { ttl: 60000, limit: 10 } })  // ✅ 10 موافقات في الدقيقة
  @Post('consent')
  @ApiOperation({ summary: 'تسجيل موافقة المستخدم' })
  async grantConsent(
    @CurrentUser('id') userId: string,
    @Body() consentDto: ConsentDto,
    @Req() req: Request,
  ) {
    const ipAddress = req.ip || req.headers['x-forwarded-for'] as string;
    const userAgent = req.headers['user-agent'];

    const consent = await this.consentService.recordConsent(
      userId,
      consentDto,
      ipAddress,
      userAgent,
    );

    return {
      success: true,
      message: 'تم تسجيل الموافقة بنجاح',
      data: consent,
    };
  }

  @ApiBearerAuth()
  @UseGuards(UnifiedAuthGuard)
  @Auth(AuthType.FIREBASE)
  @Post('consent/bulk')
  @ApiOperation({ summary: 'تسجيل موافقات متعددة دفعة واحدة' })
  async grantBulkConsents(
    @CurrentUser('id') userId: string,
    @Body() bulkConsentDto: BulkConsentDto,
    @Req() req: Request,
  ) {
    const ipAddress = req.ip || req.headers['x-forwarded-for'] as string;
    const userAgent = req.headers['user-agent'];

    const consents = await this.consentService.recordBulkConsents(
      userId,
      bulkConsentDto.consents,
      ipAddress,
      userAgent,
    );

    return {
      success: true,
      message: `تم تسجيل ${consents.length} موافقة بنجاح`,
      data: consents,
    };
  }

  @ApiBearerAuth()
  @UseGuards(UnifiedAuthGuard)
  @Auth(AuthType.FIREBASE)
  @Delete('consent/:type')
  @ApiOperation({ summary: 'سحب الموافقة' })
  @ApiParam({ name: 'type', enum: ConsentType, description: 'نوع الموافقة' })
  async withdrawConsent(
    @CurrentUser('id') userId: string,
    @Param('type') type: ConsentType,
    @Body('reason') reason?: string,
  ) {
    const consent = await this.consentService.withdrawConsent(userId, type, reason);

    return {
      success: true,
      message: 'تم سحب الموافقة بنجاح',
      data: consent,
    };
  }

  @ApiBearerAuth()
  @UseGuards(UnifiedAuthGuard)
  @Auth(AuthType.FIREBASE)
  @Get('consent/history')
  @ApiOperation({ summary: 'سجل موافقات المستخدم' })
  @ApiQuery({ name: 'type', enum: ConsentType, required: false })
  async getConsentHistory(
    @CurrentUser('id') userId: string,
    @Query('type') type?: ConsentType,
  ) {
    const history = await this.consentService.getConsentHistory(userId, type);

    return {
      success: true,
      data: history,
      count: history.length,
    };
  }

  @ApiBearerAuth()
  @UseGuards(UnifiedAuthGuard)
  @Auth(AuthType.FIREBASE)
  @Get('consent/summary')
  @ApiOperation({ summary: 'ملخص موافقات المستخدم' })
  async getConsentSummary(@CurrentUser('id') userId: string) {
    const summary = await this.consentService.getConsentSummary(userId);

    return {
      success: true,
      data: summary,
    };
  }

  @ApiBearerAuth()
  @UseGuards(UnifiedAuthGuard)
  @Auth(AuthType.FIREBASE)
  @Get('consent/check/:type')
  @ApiOperation({ summary: 'التحقق من موافقة محددة' })
  @ApiParam({ name: 'type', enum: ConsentType, description: 'نوع الموافقة' })
  async checkConsent(
    @CurrentUser('id') userId: string,
    @Param('type') type: ConsentType,
  ) {
    const hasConsent = await this.consentService.checkConsent(userId, type);

    return {
      success: true,
      data: {
        consentType: type,
        hasActiveConsent: hasConsent,
      },
    };
  }
}
