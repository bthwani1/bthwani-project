# Admin Module - دليل الاستخدام الكامل

## 📋 نظرة عامة

Admin Module هو نظام إدارة شامل لتطبيق Bthwani، تم إعادة هيكلته بالكامل باستخدام **Facade Pattern** مع خدمات متخصصة.

**الحالة**: ✅ جاهز للإنتاج  
**الإصدار**: 2.0  
**التاريخ**: 2025-10-15

---

## 🏗️ الهيكل المعماري

```
admin/
├── services/              12 خدمة متخصصة
├── entities/              5 كيانات جديدة
├── dto/                   41 DTO
├── interfaces/            11 interface للـ types
├── admin.controller.ts    Controller رئيسي
├── admin.service.ts       Facade service
└── admin.module.ts        Module configuration
```

---

## 🎯 الخدمات المتاحة

### 1. WithdrawalService - إدارة السحب المالي
```typescript
await withdrawalService.getWithdrawals({ status: 'pending' });
await withdrawalService.approveWithdrawal({ withdrawalId, adminId });
```

### 2. SupportAdminService - إدارة الدعم الفني
```typescript
await supportService.getSupportTickets({ priority: 'high' });
await supportService.assignTicket(ticketId, adminId, assigneeId);
await supportService.getSLAMetrics();
```

### 3. AuditService - سجلات التدقيق
```typescript
await auditService.getAuditLogs(action, userId, startDate, endDate);
await auditService.getFlaggedAuditLogs();
```

### 4. DataDeletionService - حذف البيانات (GDPR)
```typescript
await dataDeletionService.approveDataDeletion(requestId, adminId);
// يتم الحذف بعد 30 يوم (grace period)
```

### 5. SettingsService - إعدادات التطبيق
```typescript
const deliveryFee = await settingsService.getSetting('delivery_fee');
await settingsService.updateSetting('delivery_fee', 20, adminId);
```

### 6. FeatureFlagService - أعلام الميزات
```typescript
const isEnabled = await featureFlagService.isEnabled('new_feature', userId);
await featureFlagService.updateFeatureFlag('new_feature', true, adminId);
```

### 7. SecurityService - الأمان
```typescript
await securityService.logLoginAttempt({ identifier, ipAddress, status });
const rateLimit = await securityService.checkRateLimit(identifier, ip);
```

### 8. DriverShiftService - ورديات السائقين
```typescript
await shiftService.createShift({ name, startTime, endTime, days }, adminId);
await shiftService.assignShiftToDriver(shiftId, driverId, startDate);
```

### 9. AttendanceService - الحضور
```typescript
await attendanceService.getDriverAttendance(driverId, { month, year });
await attendanceService.adjustAttendance({ driverId, data, adminId });
```

### 10. LeaveService - الإجازات
```typescript
await leaveService.getLeaveRequests('pending');
await leaveService.approveLeaveRequest(requestId, adminId);
await leaveService.getDriverLeaveBalance(driverId);
```

### 11. MarketerService - المسوقين
```typescript
await marketerService.getAllMarketers({ status: 'active' });
await marketerService.getMarketerPerformance(marketerId);
await marketerService.approveOnboarding({ applicationId, adminId });
```

### 12. BackupService - النسخ الاحتياطي
```typescript
await backupService.createBackup(['users', 'orders'], 'Daily backup', adminId);
await backupService.listBackups(page, limit);
```

---

## 🚀 Quick Start

### 1. Import Module:
```typescript
// في app.module.ts
import { AdminModule } from './modules/admin/admin.module';
import { SupportModule } from './modules/support/support.module';

@Module({
  imports: [
    AdminModule,
    SupportModule,
  ],
})
```

### 2. Apply Audit Interceptor:
```typescript
// في main.ts
import { AuditInterceptor } from './common/interceptors/audit.interceptor';

const reflector = app.get(Reflector);
app.useGlobalInterceptors(
  app.get(AuditInterceptor)
);
```

### 3. Seed Initial Settings:
```typescript
await settingsService.seedDefaultSettings();
```

---

## 🔒 Security

### Audit Logging:
```typescript
@Patch('users/:id/ban')
@Audit('user.ban', 'User', 'critical')
async banUser() { }
```

### Rate Limiting:
```typescript
const { allowed, remaining } = await securityService.checkRateLimit(
  identifier,
  ipAddress,
  5,  // max attempts
  15  // minutes window
);
```

---

## 📊 Endpoints

**Total**: 87 endpoint جاهز  
**Coverage**: 100%  
**Documentation**: Swagger complete

### Main Categories:
- Dashboard & Statistics (6)
- Drivers Management (11)
- Withdrawals (4)
- Support Tickets (4)
- Store & Vendor Moderation (8)
- Users Management (6)
- Reports (2)
- Audit Logs (2)
- Settings (4)
- Backup (4)
- Data Deletion (3)
- Security (3)
- Shifts (5)
- Attendance (3)
- Leave (5)
- Marketer (12)
- Onboarding (5)
- ... والمزيد

---

## 📚 Documentation

للتفاصيل الكاملة، راجع:

1. **ADMIN_MODULE_ANALYSIS_REPORT.md** - تحليل شامل
2. **ENDPOINTS_DETAILED_STATUS.md** - حالة كل endpoint
3. **REQUIRED_ENTITIES_SPECIFICATIONS.md** - مواصفات Entities
4. **IMPLEMENTATION_ACTION_PLAN.md** - خطة العمل
5. **REFACTORING_SUMMARY.md** - ملخص إعادة الهيكلة
6. **TYPE_CLEANUP_SUMMARY.md** - إصلاح الـ types
7. **FINAL_COMPLETION_REPORT.md** - التقرير النهائي

---

## 🛠️ التطوير

### إضافة خدمة جديدة:
```typescript
// 1. إنشاء service
@Injectable()
export class MyNewService {
  // implementation
}

// 2. إضافة للـ module
@Module({
  providers: [
    AdminService,
    MyNewService,  // Add here
  ],
})

// 3. Inject في AdminService
constructor(
  private readonly myNewService: MyNewService,
) {}
```

---

## 🔧 صيانة

### Scripts الإدارية:
```bash
# Emergency pause
npm run script:pause-system -- --reason="Maintenance"

# Resume system
npm run script:resume-system

# Export data
npm run script:export-data -- --collections=users,orders
```

---

## 📞 الدعم

### الملفات المرجعية:
- `scripts/admin/README.md` - دليل Scripts
- `DUPLICATE_ENDPOINTS_REMOVAL.md` - Endpoints المحذوفة
- `CLEANUP_COMPLETED.md` - ملخص التنظيف

---

**آخر تحديث**: 2025-10-15  
**الإصدار**: 2.0 - Production Ready  
**الحالة**: ✅ مكتمل ✅  

🎉 **جاهز للاستخدام!** 🎉

