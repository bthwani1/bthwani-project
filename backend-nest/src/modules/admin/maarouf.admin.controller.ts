import { Controller, Get, Patch, Delete, Param, Query, UseGuards, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UnifiedAuthGuard } from '../../common/guards/unified-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Auth, Roles, CurrentUser } from '../../common/decorators/auth.decorator';
import { AuthType } from '../../common/guards/unified-auth.guard';
import { CursorPaginationDto } from '../../common/dto/pagination.dto';
import { MaaroufService } from '../maarouf/maarouf.service';

@ApiTags('Admin:Maarouf')
@ApiBearerAuth()
@Controller({ path: 'admin/maarouf', version: ['2'] })
@UseGuards(UnifiedAuthGuard, RolesGuard)
@Auth(AuthType.JWT)
@Roles('admin','superadmin')
export class AdminMaaroufController {
  constructor(private readonly service: MaaroufService) { }

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
