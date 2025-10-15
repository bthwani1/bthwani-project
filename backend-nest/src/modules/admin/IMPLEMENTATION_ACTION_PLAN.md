# خطة العمل التفصيلية لإكمال Admin Module

## 📅 جدول زمني: 4-6 أسابيع

---

## 🔴 الأسبوع الأول - الأساسيات الحرجة

### اليوم 1-2: Withdrawal System

#### الخطوات:
1. **إنشاء Entity**
   ```bash
   # إنشاء ملف Entity
   backend-nest/src/modules/finance/entities/withdrawal-request.entity.ts
   ```
   - نسخ الكود من REQUIRED_ENTITIES_SPECIFICATIONS.md
   - إضافة imports والـ decorators
   - إضافة indexes

2. **إنشاء DTOs**
   ```bash
   # في backend-nest/src/modules/admin/dto/withdrawals.dto.ts
   ```
   - `GetWithdrawalsQueryDto`
   - `ApproveWithdrawalDto`
   - `RejectWithdrawalDto`
   - Response DTOs

3. **تحديث Module**
   ```typescript
   // في admin.module.ts
   @Module({
     imports: [
       MongooseModule.forFeature([
         { name: WithdrawalRequest.name, schema: WithdrawalRequestSchema },
         // ... existing
       ]),
     ],
   })
   ```

4. **تكملة Service Methods**
   - `getWithdrawals()`
   - `getPendingWithdrawals()`
   - `approveWithdrawal()`
   - `rejectWithdrawal()`

5. **Testing**
   - Unit tests للـ service methods
   - Integration tests للـ endpoints

#### ✅ Deliverables:
- [ ] WithdrawalRequest Entity
- [ ] 4 DTOs
- [ ] 4 Service methods مكتملة
- [ ] 4 Endpoints تعمل
- [ ] Tests

---

### اليوم 3-4: Support Ticket System

#### الخطوات:

1. **إنشاء Module جديد**
   ```bash
   nest g module modules/support
   nest g controller modules/support
   nest g service modules/support
   ```

2. **إنشاء Entity**
   ```bash
   backend-nest/src/modules/support/entities/support-ticket.entity.ts
   ```

3. **إنشاء DTOs**
   - `CreateTicketDto`
   - `UpdateTicketDto`
   - `AssignTicketDto`
   - `ResolveTicketDto`
   - Query & Response DTOs

4. **تطبيق Service Methods**
   ```typescript
   - createTicket()
   - getTickets()
   - getTicketById()
   - assignTicket()
   - addMessage()
   - resolveTicket()
   - closeTicket()
   - getSLAMetrics()
   ```

5. **ربطه مع Admin Module**
   ```typescript
   // في admin.service.ts
   constructor(
     @InjectModel(SupportTicket.name) private ticketModel: Model<SupportTicket>,
     // ...
   )
   ```

6. **Real-time Updates** (اختياري)
   - استخدام WebSocket Gateway للإشعارات

#### ✅ Deliverables:
- [ ] Support Module كامل
- [ ] SupportTicket Entity
- [ ] 8+ Service methods
- [ ] Admin endpoints integration
- [ ] Tests

---

### اليوم 5: Audit Log System

#### الخطوات:

1. **إنشاء Entity**
   ```bash
   backend-nest/src/modules/admin/entities/audit-log.entity.ts
   ```

2. **إنشاء Interceptor**
   ```typescript
   // backend-nest/src/common/interceptors/audit.interceptor.ts
   @Injectable()
   export class AuditInterceptor implements NestInterceptor {
     async intercept(context: ExecutionContext, next: CallHandler) {
       // Log request
       const request = context.switchToHttp().getRequest();
       
       // Execute
       const result = await next.handle().toPromise();
       
       // Log success
       await this.logAudit({ /* ... */ });
       
       return result;
     }
   }
   ```

3. **إنشاء Decorator مخصص**
   ```typescript
   // backend-nest/src/common/decorators/audit.decorator.ts
   export const Audit = (action: string, resource: string) =>
     SetMetadata('audit', { action, resource });
   ```

4. **تطبيق على Endpoints**
   ```typescript
   @Patch('withdrawals/:id/approve')
   @Audit('withdrawal.approve', 'Withdrawal')
   async approveWithdrawal() { }
   ```

5. **Service Methods**
   ```typescript
   - getAuditLogs()
   - getAuditLogDetails()
   - getAuditsByUser()
   - getAuditsByAction()
   - getFlaggedAudits()
   ```

#### ✅ Deliverables:
- [ ] AuditLog Entity
- [ ] AuditInterceptor
- [ ] @Audit decorator
- [ ] تطبيق على جميع الـ sensitive endpoints
- [ ] Admin endpoints للعرض

---

### اليوم 6-7: Data Deletion (GDPR) + Backup System

#### Data Deletion:

1. **إنشاء Entity**
   ```bash
   backend-nest/src/modules/legal/entities/data-deletion-request.entity.ts
   ```

2. **إنشاء Service**
   ```typescript
   // في legal module أو admin
   - createDeletionRequest()
   - verifyDeletionRequest()
   - approveDeletion()
   - rejectDeletion()
   - executeDeletion() // حذف فعلي
   - anonymizeData() // بدلاً من الحذف
   ```

3. **Scheduled Job**
   ```typescript
   // لحذف البيانات المجدولة
   @Cron('0 2 * * *') // كل يوم الساعة 2 صباحاً
   async processScheduledDeletions() { }
   ```

#### Backup System:

1. **إنشاء Entity**
   ```bash
   backend-nest/src/modules/admin/entities/backup-record.entity.ts
   ```

2. **إنشاء Backup Service**
   ```typescript
   // backend-nest/src/modules/admin/services/backup.service.ts
   
   export class BackupService {
     async createBackup(collections?: string[]) {
       // 1. إنشاء backup record
       // 2. تصدير البيانات
       // 3. Compress
       // 4. Encrypt (اختياري)
       // 5. Upload to S3
       // 6. Update record
     }
     
     async restoreBackup(backupId: string) {
       // خطير - يحتاج تأكيد مزدوج
     }
     
     async downloadBackup(backupId: string) {
       // توليد signed URL
     }
   }
   ```

3. **Scheduled Backups**
   ```typescript
   @Cron('0 3 * * 0') // كل أحد الساعة 3 صباحاً
   async createWeeklyBackup() { }
   ```

#### ✅ Deliverables:
- [ ] DataDeletionRequest Entity
- [ ] Deletion service + endpoints
- [ ] Scheduled job للحذف
- [ ] BackupRecord Entity
- [ ] Backup service + endpoints
- [ ] Scheduled backup job

---

## 🟠 الأسبوع الثاني - إدارة السائقين

### اليوم 8-9: Attendance System

#### الخطوات:

1. **استخدام ER Module**
   ```typescript
   // في admin.module.ts
   @Module({
     imports: [
       MongooseModule.forFeature([
         { name: Attendance.name, schema: AttendanceSchema },
       ]),
     ],
   })
   ```

2. **تكملة Service Methods**
   ```typescript
   async getDriverAttendance(driverId: string, query) {
     return this.attendanceModel.find({
       employeeId: driverId,
       employeeModel: 'Driver',
       // ...
     });
   }
   
   async getAttendanceSummary(date?: string) {
     // Aggregation
   }
   
   async adjustAttendance(data) {
     // Manual adjustment
   }
   ```

3. **Admin Dashboard**
   - عرض ملخص الحضور اليومي
   - تقارير الحضور الشهرية

#### ✅ Deliverables:
- [ ] 3 Service methods مكتملة
- [ ] Integration مع ER Attendance
- [ ] Admin endpoints

---

### اليوم 10-11: Shifts Management

#### الخطوات:

1. **إنشاء Entity**
   ```bash
   backend-nest/src/modules/driver/entities/driver-shift.entity.ts
   ```

2. **إنشاء DTOs**
   - `CreateShiftDto`
   - `UpdateShiftDto`
   - `AssignShiftDto`

3. **Service Methods**
   ```typescript
   - createShift()
   - updateShift()
   - deleteShift()
   - assignShiftToDriver()
   - unassignShift()
   - getDriverShifts()
   - getShiftDrivers()
   - checkShiftConflicts()
   ```

4. **Validation**
   - التحقق من عدم تعارض الورديات
   - التحقق من أوقات العمل القانونية

#### ✅ Deliverables:
- [ ] DriverShift Entity
- [ ] 8 Service methods
- [ ] Validation logic
- [ ] Admin endpoints

---

### اليوم 12-13: Leave Management

#### الخطوات:

1. **استخدام ER Module**
   ```typescript
   import { LeaveRequest } from '../er/entities/leave-request.entity';
   ```

2. **Extend للسائقين**
   ```typescript
   async getDriverLeaveBalance(driverId: string) {
     const driver = await this.driverModel.findById(driverId);
     return {
       annual: driver.leaveBalance?.annual || 21,
       sick: driver.leaveBalance?.sick || 10,
       used: /* حساب من LeaveRequest */
     };
   }
   ```

3. **Approval Workflow**
   ```typescript
   async approveLeaveRequest(requestId: string, adminId: string) {
     const request = await this.leaveRequestModel.findById(requestId);
     
     // 1. Update status
     // 2. Deduct from balance
     // 3. Send notification
     // 4. Log audit
   }
   ```

#### ✅ Deliverables:
- [ ] Integration مع ER LeaveRequest
- [ ] 5 Service methods مكتملة
- [ ] Approval workflow
- [ ] Balance calculation

---

### اليوم 14: Driver Assets (اختياري)

#### الخطوات:

1. **إنشاء Entity** (إذا كان مطلوباً)
2. **CRUD Operations**
3. **Assignment Tracking**
4. **Maintenance History**

#### ✅ Deliverables:
- [ ] DriverAsset Entity (اختياري)
- [ ] Basic CRUD
- [ ] Assignment logic

---

## 🟠 الأسبوع الثالث - الإعدادات والأمان

### اليوم 15-16: Settings & Feature Flags

#### Settings:

1. **إنشاء Entity**
   ```bash
   backend-nest/src/modules/admin/entities/app-settings.entity.ts
   ```

2. **Settings Service**
   ```typescript
   export class SettingsService {
     async getSetting(key: string) { }
     async getSettings(category?: string) { }
     async updateSetting(key: string, value: any) { }
     async deleteSetting(key: string) { }
     
     // Helper methods
     async getPublicSettings() { }
     async getSettingsByCategory(category: string) { }
   }
   ```

3. **Seeding Initial Settings**
   ```typescript
   const defaultSettings = [
     { key: 'delivery_fee', value: 15, type: 'number', category: 'delivery' },
     { key: 'commission_rate', value: 0.15, type: 'number', category: 'commission' },
     // ...
   ];
   ```

#### Feature Flags:

1. **إنشاء Entity**
   ```bash
   backend-nest/src/modules/admin/entities/feature-flag.entity.ts
   ```

2. **Feature Flag Service**
   ```typescript
   export class FeatureFlagService {
     async isEnabled(key: string, userId?: string): Promise<boolean> {
       const flag = await this.find({ key });
       
       // Check environment
       // Check user/role
       // Check rollout percentage
       
       return flag.enabled;
     }
   }
   ```

3. **Decorator**
   ```typescript
   export const RequireFeature = (feature: string) =>
     SetMetadata('feature', feature);
   
   // Usage
   @Get('new-feature')
   @RequireFeature('new_checkout_flow')
   async newFeature() { }
   ```

#### ✅ Deliverables:
- [ ] AppSettings Entity + Service
- [ ] FeatureFlag Entity + Service
- [ ] @RequireFeature decorator
- [ ] Admin endpoints
- [ ] Initial seeding

---

### اليوم 17-18: Security Features

#### Login Attempts:

1. **إنشاء Entity**
   ```bash
   backend-nest/src/modules/auth/entities/login-attempt.entity.ts
   ```

2. **Track في Auth Service**
   ```typescript
   async login(dto: LoginDto) {
     try {
       // ... existing login logic
       
       await this.logLoginAttempt({
         identifier: dto.email,
         status: 'success',
         // ...
       });
     } catch (error) {
       await this.logLoginAttempt({
         identifier: dto.email,
         status: 'failure',
         failureReason: error.message,
         // ...
       });
     }
   }
   ```

3. **Rate Limiting**
   ```typescript
   async checkLoginAttempts(identifier: string, ip: string) {
     const attempts = await this.loginAttemptModel.countDocuments({
       $or: [{ identifier }, { ipAddress: ip }],
       status: 'failure',
       createdAt: { $gte: fifteenMinutesAgo }
     });
     
     if (attempts >= 5) {
       throw new TooManyRequestsException('Account locked');
     }
   }
   ```

#### Password Reset:

1. **تحسين Existing Method**
   ```typescript
   async resetUserPassword(data: ResetUserPasswordDto) {
     // 1. Generate secure temp password
     // 2. Hash password
     // 3. Update user
     // 4. Send SMS/Email
     // 5. Log audit
     // 6. Force password change on next login
   }
   ```

#### Account Unlock:

- ✅ مكتمل بالفعل

#### ✅ Deliverables:
- [ ] LoginAttempt Entity
- [ ] Login tracking
- [ ] Rate limiting
- [ ] Enhanced password reset
- [ ] Admin endpoints للمراقبة

---

### اليوم 19: Quality & Reviews (اختياري)

1. **إنشاء Entity** (إذا كان مطلوباً)
2. **Review submission**
3. **Admin review of reviews**

---

## 🟡 الأسبوع الرابع - Marketers & Integration

### اليوم 20-22: Marketer Management

#### الخطوات:

1. **استخدام Existing Entities**
   ```typescript
   import { Marketer } from '../marketer/entities/marketer.entity';
   import { CommissionPlan } from '../marketer/entities/commission-plan.entity';
   import { Onboarding } from '../marketer/entities/onboarding.entity';
   ```

2. **تكملة Admin Service Methods**
   ```typescript
   async getAllMarketers(query) {
     return this.marketerModel
       .find({ /* filters */ })
       .skip(skip)
       .limit(limit)
       .sort({ createdAt: -1 });
   }
   
   async getMarketerDetails(marketerId: string) {
     const marketer = await this.marketerModel.findById(marketerId);
     const stores = await this.storeModel.find({ 
       'metadata.referredBy': marketerId 
     });
     const commissions = await this.commissionModel.find({ 
       marketerId 
     });
     
     return { marketer, stores, commissions };
   }
   
   async getMarketerPerformance(marketerId, query) {
     // Aggregation من stores و commissions
   }
   
   // ... all other methods
   ```

3. **Commission Calculation**
   ```typescript
   async calculateMarketerCommission(marketerId: string, month: number) {
     // 1. Get commission plan
     // 2. Get stores onboarded
     // 3. Get orders from these stores
     // 4. Calculate commission
     // 5. Create commission record
   }
   ```

4. **Activation/Deactivation Workflow**
   ```typescript
   async activateMarketer(data) {
     // 1. Update status
     // 2. Create user account (if needed)
     // 3. Send welcome email
     // 4. Log audit
   }
   ```

#### ✅ Deliverables:
- [ ] 12 Service methods مكتملة
- [ ] Commission calculation
- [ ] Activation workflow
- [ ] Admin endpoints
- [ ] Reports & statistics

---

### اليوم 23-24: Onboarding Management

#### الخطوات:

1. **Onboarding Workflow**
   ```typescript
   async approveOnboarding(data) {
     const application = await this.onboardingModel.findById(data.applicationId);
     
     // 1. Create Store/Vendor
     const store = await this.storeModel.create({
       name: application.businessName,
       owner: /* create vendor */,
       // ... from application data
     });
     
     // 2. Create Vendor User
     // 3. Update onboarding status
     // 4. Send credentials
     // 5. Update marketer commission
     // 6. Log audit
   }
   ```

2. **Statistics Dashboard**
   ```typescript
   async getOnboardingStatistics() {
     return {
       pending: await this.onboardingModel.countDocuments({ status: 'pending' }),
       approved: /* ... */,
       rejected: /* ... */,
       conversionRate: /* ... */,
     };
   }
   ```

#### ✅ Deliverables:
- [ ] Approval workflow
- [ ] Auto-creation of stores/vendors
- [ ] Statistics
- [ ] Admin endpoints

---

### اليوم 25: Commission Plans

1. **CRUD Operations**
2. **Apply to Marketers**
3. **Historical tracking**

---

## 🧹 الأسبوع الخامس - التحسينات والصيانة

### اليوم 26-27: Code Cleanup

#### الخطوات:

1. **حذف Duplicate Endpoints**
   ```typescript
   // حذف من controller:
   - GET /admin/reports/weekly
   - GET /admin/reports/monthly
   - GET /admin/reports/export
   - GET /admin/reports/drivers/performance
   - GET /admin/reports/stores/performance
   - GET /admin/reports/financial/detailed
   - GET /admin/drivers/stats/top-performers
   - POST /admin/drivers/:id/payout/calculate
   - GET /admin/stores/stats/top-performers
   - GET /admin/vendors/:id/settlements-history
   - GET /admin/vendors/:id/financials
   - GET /admin/users/:id/wallet-history
   - PATCH /admin/users/:id/wallet/adjust
   - GET /admin/notifications/history
   - GET /admin/notifications/stats
   ```

2. **نقل Emergency Endpoints**
   ```bash
   # إنشاء admin scripts
   backend-nest/scripts/admin/
     - pause-system.ts
     - resume-system.ts
     - export-data.ts
     - import-data.ts
   ```

3. **تحسين DTOs**
   - إضافة validation decorators
   - إضافة Swagger decorators
   - استخدام class-transformer

4. **Refactoring**
   - استخراج repeated logic
   - إنشاء helper functions
   - تحسين error handling

#### ✅ Deliverables:
- [ ] حذف 15 duplicate endpoint
- [ ] نقل 4 endpoints لـ scripts
- [ ] تحسين جميع DTOs
- [ ] Code refactoring

---

### اليوم 28-29: Performance Optimization

#### الخطوات:

1. **Database Indexes**
   ```typescript
   // مراجعة وإضافة indexes لجميع الـ queries الشائعة
   
   // مثال:
   OrderSchema.index({ status: 1, createdAt: -1 });
   OrderSchema.index({ 'driver': 1, 'deliveredAt': -1 });
   OrderSchema.index({ 'store': 1, 'status': 1 });
   ```

2. **Caching Strategy**
   ```typescript
   // استخدام Redis
   @Injectable()
   export class AdminService {
     async getDashboardStats() {
       const cached = await this.cacheManager.get('dashboard:stats');
       if (cached) return cached;
       
       const stats = await /* calculate */;
       await this.cacheManager.set('dashboard:stats', stats, 300); // 5 min
       
       return stats;
     }
   }
   ```

3. **Pagination Enforcement**
   ```typescript
   // التأكد من أن جميع list endpoints لديها pagination
   async getUsers(query) {
     const limit = Math.min(query.limit || 20, 100); // max 100
     // ...
   }
   ```

4. **Query Optimization**
   - استخدام lean() للـ read-only queries
   - استخدام select() لتحديد الحقول
   - استخدام aggregation بدلاً من multiple queries

#### ✅ Deliverables:
- [ ] Database indexes مراجعة وإضافة
- [ ] Redis caching للإحصائيات
- [ ] Pagination enforcement
- [ ] Query optimization

---

### اليوم 30: Testing & Documentation

#### Testing:

1. **Unit Tests**
   ```bash
   # Coverage target: 80%+
   npm run test -- admin.service.spec.ts
   ```

2. **Integration Tests**
   ```bash
   # Critical paths
   - Withdrawal approval
   - Support ticket creation
   - Data deletion
   - Backup/restore
   ```

3. **E2E Tests**
   ```bash
   # User flows
   - Admin login → approve store
   - Admin login → approve withdrawal
   - Admin login → resolve ticket
   ```

#### Documentation:

1. **Swagger Documentation**
   ```typescript
   @ApiOperation({ 
     summary: 'Approve withdrawal request',
     description: 'Approves a pending withdrawal and processes payment'
   })
   @ApiParam({ name: 'id', description: 'Withdrawal request ID' })
   @ApiBody({ type: ApproveWithdrawalDto })
   @ApiResponse({ status: 200, description: 'Withdrawal approved' })
   @ApiResponse({ status: 404, description: 'Withdrawal not found' })
   ```

2. **README Updates**
   - Admin module overview
   - Available endpoints
   - Authentication required
   - Examples

3. **Postman Collection**
   - Export updated collection
   - Add examples
   - Environment variables

#### ✅ Deliverables:
- [ ] 80%+ test coverage
- [ ] Integration tests
- [ ] E2E tests
- [ ] Complete Swagger docs
- [ ] README updated
- [ ] Postman collection

---

## 📊 Progress Tracking

### Weekly Checkpoints

**الأسبوع 1** (اكتمل: 0/7 أيام):
- [ ] اليوم 1-2: Withdrawal System
- [ ] اليوم 3-4: Support Tickets
- [ ] اليوم 5: Audit Logs
- [ ] اليوم 6-7: Data Deletion & Backup

**الأسبوع 2** (اكتمل: 0/7 أيام):
- [ ] اليوم 8-9: Attendance
- [ ] اليوم 10-11: Shifts
- [ ] اليوم 12-13: Leave Management
- [ ] اليوم 14: Driver Assets

**الأسبوع 3** (اكتمل: 0/7 أيام):
- [ ] اليوم 15-16: Settings & Flags
- [ ] اليوم 17-18: Security
- [ ] اليوم 19: Quality Reviews

**الأسبوع 4** (اكتمل: 0/7 أيام):
- [ ] اليوم 20-22: Marketers
- [ ] اليوم 23-24: Onboarding
- [ ] اليوم 25: Commission Plans

**الأسبوع 5** (اكتمل: 0/6 أيام):
- [ ] اليوم 26-27: Code Cleanup
- [ ] اليوم 28-29: Performance
- [ ] اليوم 30: Testing & Docs

---

## 🎯 Success Criteria

### Definition of Done:

✅ **Entity Created**
- Entity file exists
- All required fields
- Indexes defined
- Validations added

✅ **Service Methods Implemented**
- Logic completed
- Error handling
- Audit logging (if sensitive)
- Unit tests

✅ **Endpoints Working**
- Controller methods exist
- DTOs created
- Swagger documented
- Integration tested

✅ **Quality Assurance**
- Code reviewed
- Tests passing
- No linter errors
- Documentation updated

---

## 🚨 Risk Mitigation

### Potential Issues & Solutions:

1. **Database Performance**
   - **Risk**: Slow queries
   - **Solution**: Add indexes, use caching

2. **Data Loss**
   - **Risk**: Backup/deletion bugs
   - **Solution**: Test in staging, backup before operations

3. **Security Vulnerabilities**
   - **Risk**: Unauthorized access
   - **Solution**: RBAC, audit logging, rate limiting

4. **Breaking Changes**
   - **Risk**: Breaking existing functionality
   - **Solution**: Comprehensive testing, gradual rollout

---

## 📞 Support & Resources

### References:
- [NestJS Documentation](https://docs.nestjs.com)
- [Mongoose Documentation](https://mongoosejs.com/docs)
- [GDPR Compliance Guide](https://gdpr.eu)

### Team:
- **Backend Lead**: Code review & architecture
- **QA**: Testing & validation
- **DevOps**: Deployment & monitoring
- **Product**: Requirements & priorities

---

**آخر تحديث**: 2025-10-15
**الحالة**: جاهز للتنفيذ
**المدة المقدرة**: 4-6 أسابيع
**الأولوية**: 🔴 عالية جداً

