import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  SetMetadata,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { HRService } from './services/hr.service';
import { AccountingService } from './services/accounting.service';
import { Auth, CurrentUser } from '../../common/decorators/auth.decorator';
import { AuthType } from '../../common/guards/unified-auth.guard';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { CreateChartAccountDto } from './dto/create-chart-account.dto';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { User } from '../auth/entities';

const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@ApiTags('ER System')
@Controller('er')
@ApiBearerAuth()
export class ERController {
  constructor(
    private readonly hrService: HRService,
    private readonly accountingService: AccountingService,
  ) {}

  // ==================== Employee Endpoints ====================

  @Post('employees')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'إضافة موظف جديد' })
  async createEmployee(@Body() dto: CreateEmployeeDto) {
    return this.hrService.createEmployee(dto);
  }

  @Get('employees')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'الحصول على كل الموظفين' })
  async getAllEmployees(@Query('status') status?: string) {
    return this.hrService.findAllEmployees(status);
  }

  @Get('employees/:id')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'الحصول على موظف محدد' })
  async getEmployee(@Param('id') id: string) {
    return this.hrService.findEmployeeById(id);
  }

  @Patch('employees/:id')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'تحديث موظف' })
  async updateEmployee(
    @Param('id') id: string,
    @Body() dto: UpdateEmployeeDto,
  ) {
    return this.hrService.updateEmployee(id, dto);
  }

  // ==================== Attendance Endpoints ====================

  @Post('attendance/check-in')
  @Auth(AuthType.JWT)
  @ApiOperation({ summary: 'تسجيل حضور' })
  async checkIn(
    @CurrentUser('employeeId' as unknown as keyof User) employeeId: string,
    @Body() dto: { location?: { lat: number; lng: number } },
  ) {
    return this.hrService.recordCheckIn(employeeId, dto.location);
  }

  @Post('attendance/check-out')
  @Auth(AuthType.JWT)
  @ApiOperation({ summary: 'تسجيل انصراف' })
  async checkOut(
    @CurrentUser('employeeId' as unknown as keyof User) employeeId: string,
    @Body() dto: { location?: { lat: number; lng: number } },
  ) {
    return this.hrService.recordCheckOut(employeeId, dto.location);
  }

  @Get('attendance/:employeeId')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'سجل حضور موظف' })
  async getEmployeeAttendance(
    @Param('employeeId') employeeId: string,
    @Query('month') month?: number,
    @Query('year') year?: number,
  ) {
    return this.hrService.getEmployeeAttendance(employeeId, month, year);
  }

  // ==================== Leave Request Endpoints ====================

  @Post('leave-requests')
  @Auth(AuthType.JWT)
  @ApiOperation({ summary: 'تقديم طلب إجازة' })
  async createLeaveRequest(
    @CurrentUser('employeeId' as unknown as keyof User) employeeId: string,
    @Body() dto: CreateLeaveRequestDto,
  ) {
    return this.hrService.createLeaveRequest(employeeId, dto);
  }

  @Patch('leave-requests/:id/approve')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'الموافقة على طلب إجازة' })
  async approveLeaveRequest(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.hrService.approveLeaveRequest(id, userId);
  }

  @Patch('leave-requests/:id/reject')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'رفض طلب إجازة' })
  async rejectLeaveRequest(
    @Param('id') id: string,
    @Body() dto: { reason: string },
  ) {
    return this.hrService.rejectLeaveRequest(id, dto.reason);
  }

  // ==================== Payroll Endpoints ====================

  @Post('payroll/generate')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'إنشاء كشف راتب' })
  async generatePayroll(
    @Body() dto: { employeeId: string; month: number; year: number },
  ) {
    return this.hrService.generatePayroll(dto.employeeId, dto.month, dto.year);
  }

  @Patch('payroll/:id/approve')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'الموافقة على كشف راتب' })
  async approvePayroll(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.hrService.approvePayroll(id, userId);
  }

  @Patch('payroll/:id/mark-paid')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'تحديد كدفع' })
  async markAsPaid(
    @Param('id') id: string,
    @Body() dto: { transactionRef: string },
  ) {
    return this.hrService.markPayrollAsPaid(id, dto.transactionRef);
  }

  // ==================== Accounting Endpoints ====================

  @Post('accounts')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'إنشاء حساب' })
  async createAccount(@Body() dto: CreateChartAccountDto) {
    return this.accountingService.createAccount(dto);
  }

  @Get('accounts')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'دليل الحسابات' })
  async getAccounts(@Query('type') type?: string) {
    return this.accountingService.findAllAccounts(type);
  }

  @Get('accounts/:id')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'الحصول على حساب' })
  async getAccount(@Param('id') id: string) {
    return this.accountingService.findAccountById(id);
  }

  @Post('journal-entries')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'إنشاء قيد يومية' })
  async createJournalEntry(
    @Body() dto: CreateJournalEntryDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.accountingService.createJournalEntry(dto, userId);
  }

  @Get('journal-entries')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'الحصول على قيود اليومية' })
  async getJournalEntries(
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.accountingService.findJournalEntries(
      type,
      status,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Patch('journal-entries/:id/post')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'ترحيل قيد' })
  async postJournalEntry(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.accountingService.postJournalEntry(id, userId);
  }

  @Get('reports/trial-balance')
  @Auth(AuthType.JWT)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'ميزان المراجعة' })
  async getTrialBalance(@Query('date') date?: string) {
    return this.accountingService.getTrialBalance(
      date ? new Date(date) : new Date(),
    );
  }
}
