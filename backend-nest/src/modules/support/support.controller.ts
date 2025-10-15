import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { SupportService } from './support.service';
import { UnifiedAuthGuard } from '../../common/guards/unified-auth.guard';
import {
  CreateTicketDto,
  GetTicketsQueryDto,
  AddMessageDto,
  RateTicketDto,
} from './dto/support.dto';

interface AuthenticatedRequest extends Request {
  user: {
    _id?: string;
    id?: string;
    constructor?: {
      modelName?: string;
    };
  };
}

@ApiTags('Support')
@ApiBearerAuth()
@Controller('support')
@UseGuards(UnifiedAuthGuard)
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('tickets')
  @ApiOperation({ summary: 'إنشاء تذكرة دعم جديدة' })
  async createTicket(
    @Body() dto: CreateTicketDto,
    @Req() req: AuthenticatedRequest,
  ) {
    dto.userId = req.user._id || req.user.id || '';
    dto.userModel = req.user.constructor?.modelName || 'User';
    return this.supportService.createTicket(dto);
  }

  @Get('tickets')
  @ApiOperation({ summary: 'جلب التذاكر' })
  async getTickets(@Query() query: GetTicketsQueryDto) {
    return this.supportService.getTickets(query);
  }

  @Get('tickets/:id')
  @ApiOperation({ summary: 'تفاصيل تذكرة' })
  async getTicketById(@Param('id') id: string) {
    return this.supportService.getTicketById(id);
  }

  @Patch('tickets/:id/messages')
  @ApiOperation({ summary: 'إضافة رسالة للتذكرة' })
  async addMessage(
    @Param('id') id: string,
    @Body() dto: AddMessageDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user._id || req.user.id || '';
    const userModel = req.user.constructor?.modelName || 'User';
    return this.supportService.addMessage(id, dto, userId, userModel);
  }

  @Patch('tickets/:id/rate')
  @ApiOperation({ summary: 'تقييم التذكرة' })
  async rateTicket(@Param('id') id: string, @Body() dto: RateTicketDto) {
    return this.supportService.rateTicket(id, dto);
  }

  @Get('stats')
  @ApiOperation({ summary: 'إحصائيات التذاكر' })
  async getStats() {
    return this.supportService.getTicketStats();
  }
}
