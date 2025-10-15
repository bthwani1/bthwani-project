import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UnifiedAuthGuard } from '../../common/guards/unified-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import {
  Auth,
  Roles,
  CurrentUser,
} from '../../common/decorators/auth.decorator';
import { AuthType } from '../../common/guards/unified-auth.guard';

@ApiTags('Shifts')
@ApiBearerAuth()
@Controller('shifts')
@UseGuards(UnifiedAuthGuard, RolesGuard)
@Auth(AuthType.JWT)
export class ShiftController {
  // ==================== Shift Management ====================

  @Roles('admin', 'superadmin')
  @Get()
  @ApiOperation({ summary: 'جلب كل الورديات' })
  async getAllShifts() {
    return {
      success: true,
      data: [],
      message: 'جلب الورديات بنجاح',
    };
  }

  @Roles('admin', 'superadmin')
  @Post()
  @ApiOperation({ summary: 'إنشاء وردية جديدة' })
  async createShift(
    @Body()
    body: {
      name: string;
      startTime: string;
      endTime: string;
      days: number[];
    },
    @CurrentUser('id') adminId: string,
  ) {
    return {
      success: true,
      data: { ...body, adminId },
      message: 'تم إنشاء الوردية بنجاح',
    };
  }

  @Roles('admin', 'superadmin')
  @Patch(':id')
  @ApiOperation({ summary: 'تحديث وردية' })
  async updateShift(@Param('id') shiftId: string, @Body() body: any) {
    return {
      success: true,
      data: { shiftId, ...body },
      message: 'تم تحديث الوردية بنجاح',
    };
  }

  @Roles('admin', 'superadmin')
  @Post(':shiftId/assign/:driverId')
  @ApiOperation({ summary: 'تعيين وردية لسائق' })
  async assignShiftToDriver(
    @Param('shiftId') shiftId: string,
    @Param('driverId') driverId: string,
    @Body() body: { startDate: string; endDate?: string },
  ) {
    return {
      success: true,
      data: { shiftId, driverId, ...body },
      message: 'تم تعيين الوردية للسائق بنجاح',
    };
  }

  @Roles('admin', 'superadmin', 'driver')
  @Get('driver/:driverId')
  @ApiOperation({ summary: 'ورديات السائق' })
  async getDriverShifts(@Param('driverId') driverId: string) {
    return {
      success: true,
      data: [],
      driverId,
      message: 'جلب ورديات السائق بنجاح',
    };
  }

  @Roles('driver')
  @Get('my-shifts')
  @ApiOperation({ summary: 'وردياتي' })
  async getMyShifts(@CurrentUser('id') driverId: string) {
    return {
      success: true,
      data: [],
      driverId,
      message: 'جلب وردياتي بنجاح',
    };
  }
}

