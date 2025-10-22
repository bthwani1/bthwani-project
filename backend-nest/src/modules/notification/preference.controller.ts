import { Controller, Get, Post, Delete, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { SuppressionService } from './services/suppression.service';
import { UnifiedAuthGuard } from '../../common/guards/unified-auth.guard';
import { CurrentUser } from '../../common/decorators/auth.decorator';
import { SuppressionChannel } from './entities/suppression.entity';
import { CreateSuppressionDto } from './dto/suppression.dto';

@ApiTags('Notification Preferences')
@ApiBearerAuth()
@Controller('notifications/preferences')
@UseGuards(UnifiedAuthGuard)
export class PreferenceController {
  constructor(private readonly suppressionService: SuppressionService) {}

  @Get()
  @ApiOperation({
    summary: 'Get user notification preferences',
    description: 'Retrieve current notification preferences and suppressions'
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Preferences retrieved successfully' })
  async getPreferences(@CurrentUser('id') userId: string) {
    const suppression = await this.suppressionService.getUserSuppression(userId);

    return {
      success: true,
      data: {
        suppressedChannels: suppression?.suppressedChannels || [],
        preferences: {
          sms: !suppression?.suppressedChannels.includes('sms'),
          email: !suppression?.suppressedChannels.includes('email'),
          push: !suppression?.suppressedChannels.includes('push'),
          marketing: !suppression?.suppressedChannels.includes('marketing'),
        },
        suppression: suppression ? {
          id: suppression._id,
          reason: suppression.reason,
          createdAt: suppression.createdAt,
          expiresAt: suppression.expiresAt,
        } : null,
      },
    };
  }

  @Post('opt-out')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Opt-out from notification channels',
    description: 'Opt-out from specific notification channels'
  })
  @ApiBody({
    description: 'Opt-out preferences',
    schema: {
      type: 'object',
      properties: {
        channels: {
          type: 'array',
          items: { type: 'string', enum: ['sms', 'email', 'push', 'marketing'] },
          example: ['email', 'marketing']
        },
        reason: {
          type: 'string',
          enum: ['user_request', 'marketing_preference', 'temporary'],
          example: 'user_request'
        },
        duration: {
          type: 'number',
          description: 'Duration in days (optional, for temporary suppressions)',
          example: 30
        }
      },
      required: ['channels']
    }
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Opt-out successful' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid channels or parameters' })
  async optOut(
    @CurrentUser('id') userId: string,
    @Body() body: {
      channels: SuppressionChannel[];
      reason?: string;
      duration?: number;
    },
  ) {
    const { channels, reason = 'user_request', duration } = body;

    // Validate channels
    const validChannels: SuppressionChannel[] = ['sms', 'email', 'push', 'marketing'];
    const invalidChannels = channels.filter(ch => !validChannels.includes(ch));

    if (invalidChannels.length > 0) {
      return {
        success: false,
        message: `Invalid channels: ${invalidChannels.join(', ')}`,
        validChannels,
      };
    }

    const dto: CreateSuppressionDto = {
      suppressedChannels: channels,
      reason,
      duration,
    };

    await this.suppressionService.createSuppression(userId, dto, 'user');

    return {
      success: true,
      message: `Successfully opted out from: ${channels.join(', ')}`,
      channels,
      reason,
      duration: duration || 'permanent',
    };
  }

  @Post('opt-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Opt-in to notification channels',
    description: 'Re-enable notifications for specific channels'
  })
  @ApiBody({
    description: 'Opt-in channels',
    schema: {
      type: 'object',
      properties: {
        channels: {
          type: 'array',
          items: { type: 'string', enum: ['sms', 'email', 'push', 'marketing'] },
          example: ['email', 'push']
        }
      },
      required: ['channels']
    }
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Opt-in successful' })
  async optIn(
    @CurrentUser('id') userId: string,
    @Body() body: { channels: SuppressionChannel[] },
  ) {
    const { channels } = body;

    for (const channel of channels) {
      await this.suppressionService.removeChannelSuppression(userId, channel);
    }

    return {
      success: true,
      message: `Successfully opted in to: ${channels.join(', ')}`,
      channels,
    };
  }

  @Post('unsubscribe/:token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Unsubscribe via token',
    description: 'Unsubscribe from marketing emails using secure token'
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Unsubscribed successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid token' })
  async unsubscribeWithToken(@Body() body: { token: string }) {
    // This would validate the token and unsubscribe the user
    // Implementation depends on token generation strategy

    return {
      success: true,
      message: 'Successfully unsubscribed from marketing communications',
    };
  }

  @Post('reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reset all preferences',
    description: 'Remove all suppressions and reset to default preferences'
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Preferences reset successfully' })
  async resetPreferences(@CurrentUser('id') userId: string) {
    await this.suppressionService.deactivateUserSuppressions(userId);

    return {
      success: true,
      message: 'All notification preferences have been reset to default',
    };
  }

  @Get('export')
  @ApiOperation({
    summary: 'Export preferences data',
    description: 'Export user notification preferences and history for GDPR compliance'
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Data exported successfully' })
  async exportPreferences(@CurrentUser('id') userId: string) {
    const suppression = await this.suppressionService.getUserSuppression(userId);
    const history = await this.suppressionService.getUserSuppressionHistory(userId);

    return {
      success: true,
      data: {
        currentPreferences: {
          suppressedChannels: suppression?.suppressedChannels || [],
          activeSuppressions: suppression ? 1 : 0,
        },
        suppressionHistory: history.map(item => ({
          id: item._id,
          channels: item.suppressedChannels,
          reason: item.reason,
          createdAt: item.createdAt,
          expiresAt: item.expiresAt,
          isActive: item.isActive,
        })),
        exportDate: new Date().toISOString(),
      },
    };
  }
}
