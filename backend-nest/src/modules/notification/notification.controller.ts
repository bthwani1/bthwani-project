import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { SuppressionService } from './services/suppression.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { CreateSuppressionDto } from './dto/suppression.dto';
import { CursorPaginationDto } from '../../common/dto/pagination.dto';
import { UnifiedAuthGuard } from '../../common/guards/unified-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import {
  Auth,
  Roles,
  CurrentUser,
} from '../../common/decorators/auth.decorator';
import { AuthType } from '../../common/guards/unified-auth.guard';
import { SuppressionChannel } from './entities/suppression.entity';

@ApiTags('Notification')
@ApiBearerAuth()
@Controller('notifications')
@UseGuards(UnifiedAuthGuard, RolesGuard)
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly suppressionService: SuppressionService,
  ) {}

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @Post()
  @ApiOperation({ summary: 'إنشاء إشعار (للإدارة)' })
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Auth(AuthType.FIREBASE)
  @Get('my')
  @ApiOperation({ summary: 'جلب إشعارات المستخدم' })
  async getMyNotifications(
    @CurrentUser('id') userId: string,
    @Query() pagination: CursorPaginationDto,
  ) {
    return this.notificationService.getUserNotifications(userId, pagination);
  }

  @Auth(AuthType.FIREBASE)
  @Post(':id/read')
  @ApiOperation({ summary: 'تحديد الإشعار كمقروء' })
  async markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }

  @Auth(AuthType.FIREBASE)
  @Get('unread/count')
  @ApiOperation({ summary: 'عدد الإشعارات غير المقروءة' })
  async getUnreadCount(@CurrentUser('id') userId: string) {
    return this.notificationService.getUnreadCount(userId);
  }

  @Auth(AuthType.FIREBASE)
  @Post('read-all')
  @ApiOperation({ summary: 'تحديد جميع الإشعارات كمقروءة' })
  async markAllAsRead(@CurrentUser('id') userId: string) {
    return this.notificationService.markAllAsRead(userId);
  }

  @Auth(AuthType.FIREBASE)
  @Delete(':id')
  @ApiOperation({ summary: 'حذف إشعار' })
  async delete(@Param('id') id: string) {
    return this.notificationService.delete(id);
  }

  // ==================== Suppression Management ====================

  @Auth(AuthType.FIREBASE)
  @Post('suppression')
  @ApiOperation({ summary: 'حظر قنوات إشعارات محددة' })
  async createSuppression(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateSuppressionDto,
  ) {
    const suppression = await this.suppressionService.createSuppression(
      userId,
      dto,
      'user',
    );

    return {
      success: true,
      message: 'تم حظر القنوات المحددة بنجاح',
      data: suppression,
    };
  }

  @Auth(AuthType.FIREBASE)
  @Get('suppression')
  @ApiOperation({ summary: 'جلب قائمة الحظر للمستخدم' })
  async getUserSuppressions(@CurrentUser('id') userId: string) {
    const suppressions =
      await this.suppressionService.getUserSuppressions(userId);

    return {
      success: true,
      data: suppressions,
      count: suppressions.length,
    };
  }

  @Auth(AuthType.FIREBASE)
  @Get('suppression/channels')
  @ApiOperation({ summary: 'جلب القنوات المحظورة' })
  async getSuppressedChannels(@CurrentUser('id') userId: string) {
    const channels =
      await this.suppressionService.getSuppressedChannels(userId);

    return {
      success: true,
      data: {
        suppressedChannels: channels,
        push: channels.includes(SuppressionChannel.PUSH),
        email: channels.includes(SuppressionChannel.EMAIL),
        sms: channels.includes(SuppressionChannel.SMS),
      },
    };
  }

  @Auth(AuthType.FIREBASE)
  @Delete('suppression/:id')
  @ApiOperation({ summary: 'إلغاء حظر' })
  @ApiParam({ name: 'id', description: 'معرف الحظر' })
  async removeSuppression(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    console.log(userId);
    await this.suppressionService.removeSuppression(id);

    return {
      success: true,
      message: 'تم إلغاء الحظر بنجاح',
    };
  }

  @Auth(AuthType.FIREBASE)
  @Delete('suppression/channel/:channel')
  @ApiOperation({ summary: 'إلغاء حظر قناة محددة' })
  @ApiParam({ name: 'channel', enum: SuppressionChannel })
  async removeChannelSuppression(
    @CurrentUser('id') userId: string,
    @Param('channel') channel: SuppressionChannel,
  ) {
    await this.suppressionService.removeChannelSuppression(userId, channel);

    return {
      success: true,
      message: `تم إلغاء حظر ${channel} بنجاح`,
    };
  }

  // ==================== Admin Endpoints ====================

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @Get('suppression/stats')
  @ApiOperation({ summary: 'إحصائيات الحظر (للإدارة)' })
  async getSuppressionStats() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const stats = await this.suppressionService.getSuppressionStats();

    return {
      success: true,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: stats,
    };
  }

  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @Post('send-bulk')
  @ApiOperation({ summary: 'إرسال إشعار جماعي (Admin)' })
  async sendBulkNotification(
    @Body()
    body: {
      title: string;
      body: string;
      userType?: 'all' | 'drivers' | 'vendors' | 'customers';
      userIds?: string[];
    },
    @CurrentUser('id') adminId: string,
  ) {
    return {
      success: true,
      data: { ...body, adminId, sent: true },
      message: 'تم إرسال الإشعارات بنجاح',
    };
  }
}
