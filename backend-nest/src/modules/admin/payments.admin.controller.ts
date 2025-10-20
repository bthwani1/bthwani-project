import { Controller, Get, Patch, Delete, Param, Query, UseGuards, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UnifiedAuthGuard } from '../../common/guards/unified-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Auth, Roles, CurrentUser } from '../../common/decorators/auth.decorator';
import { AuthType } from '../../common/guards/unified-auth.guard';
import { CursorPaginationDto } from '../../common/dto/pagination.dto';
import { PaymentsService } from '../payments/payments.service';

@ApiTags('Admin:Payments')
@ApiBearerAuth()
@Controller({ path: 'admin/payments', version: ['2'] })
@UseGuards(UnifiedAuthGuard, RolesGuard)
@Auth(AuthType.JWT)
@Roles('admin','superadmin')
export class AdminPaymentsController {
  constructor(private readonly service: PaymentsService) { }

  @Get()
  @ApiOperation({ summary: 'إدارة العناصر' })
  list(@Query() q: CursorPaginationDto) {
    return this.service.list({}, q.cursor, q.limit);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'تغيير الحالة' })
  setStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.service.update(id, { status: body.status } as any);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'حذف إداري' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
