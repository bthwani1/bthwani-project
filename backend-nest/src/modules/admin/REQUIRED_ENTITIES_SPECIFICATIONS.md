# مواصفات Entities المطلوبة لإكمال Admin Module

## 🔴 الأولوية الحرجة - يجب البدء فوراً

---

### 1. WithdrawalRequest Entity

**الموقع المقترح**: `backend-nest/src/modules/finance/entities/withdrawal-request.entity.ts`

**الوصف**: لإدارة طلبات سحب الأموال من السائقين والتجار

**الحقول المطلوبة**:
```typescript
@Schema({ timestamps: true })
export class WithdrawalRequest extends Document {
  @Prop({ type: Types.ObjectId, refPath: 'userModel', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, enum: ['Driver', 'Vendor', 'Marketer'] })
  userModel: string;

  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({ required: true, enum: ['pending', 'approved', 'rejected', 'processing', 'completed', 'failed'] })
  status: string;

  @Prop({ type: Object })
  bankDetails: {
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
    iban?: string;
  };

  @Prop()
  transactionRef?: string; // من البنك

  @Prop()
  notes?: string;

  @Prop()
  rejectionReason?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  approvedBy?: Types.ObjectId;

  @Prop()
  approvedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  rejectedBy?: Types.ObjectId;

  @Prop()
  rejectedAt?: Date;

  @Prop()
  processedAt?: Date;

  @Prop({ default: 0 })
  processingFee: number;

  @Prop()
  receipt?: string; // رابط إيصال التحويل
}
```

**Indexes المطلوبة**:
```typescript
WithdrawalRequestSchema.index({ userId: 1, status: 1 });
WithdrawalRequestSchema.index({ status: 1, createdAt: -1 });
WithdrawalRequestSchema.index({ userModel: 1, status: 1 });
```

**العلاقات**:
- `userId` → Driver/Vendor/Marketer (polymorphic)
- `approvedBy` → User (Admin)
- `rejectedBy` → User (Admin)

---

### 2. SupportTicket Entity

**الموقع المقترح**: `backend-nest/src/modules/support/entities/support-ticket.entity.ts`

**الوصف**: لإدارة تذاكر الدعم الفني

**الحقول المطلوبة**:
```typescript
@Schema({ timestamps: true })
export class SupportTicket extends Document {
  @Prop({ required: true })
  ticketNumber: string; // ST-YYYYMMDD-XXXX

  @Prop({ type: Types.ObjectId, refPath: 'userModel' })
  userId?: Types.ObjectId;

  @Prop({ enum: ['User', 'Driver', 'Vendor'] })
  userModel?: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: ['low', 'medium', 'high', 'urgent'] })
  priority: string;

  @Prop({ 
    required: true, 
    enum: ['open', 'assigned', 'in-progress', 'pending-user', 'resolved', 'closed', 'cancelled'],
    default: 'open'
  })
  status: string;

  @Prop({ 
    required: true, 
    enum: ['technical', 'payment', 'account', 'order', 'general', 'complaint', 'feedback'] 
  })
  category: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignedTo?: Types.ObjectId;

  @Prop()
  assignedAt?: Date;

  @Prop({ type: [{ 
    message: String, 
    sender: { type: Types.ObjectId, ref: 'User' },
    senderModel: String,
    createdAt: Date,
    attachments: [String]
  }] })
  messages: Array<{
    message: string;
    sender: Types.ObjectId;
    senderModel: string;
    createdAt: Date;
    attachments?: string[];
  }>;

  @Prop()
  resolution?: string;

  @Prop()
  resolvedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  resolvedBy?: Types.ObjectId;

  @Prop()
  closedAt?: Date;

  @Prop({ min: 1, max: 5 })
  rating?: number;

  @Prop()
  feedback?: string;

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ type: Types.ObjectId, ref: 'Order' })
  relatedOrder?: Types.ObjectId;

  // SLA tracking
  @Prop()
  firstResponseAt?: Date;

  @Prop({ default: 0 })
  responseTime: number; // in minutes

  @Prop({ default: 0 })
  resolutionTime: number; // in minutes

  @Prop({ default: false })
  slaBreached: boolean;
}
```

**Indexes**:
```typescript
SupportTicketSchema.index({ ticketNumber: 1 }, { unique: true });
SupportTicketSchema.index({ userId: 1, status: 1 });
SupportTicketSchema.index({ status: 1, priority: -1 });
SupportTicketSchema.index({ assignedTo: 1, status: 1 });
SupportTicketSchema.index({ category: 1, status: 1 });
SupportTicketSchema.index({ createdAt: -1 });
```

---

### 3. AuditLog Entity

**الموقع المقترح**: `backend-nest/src/modules/admin/entities/audit-log.entity.ts`

**الوصف**: لتتبع جميع الأنشطة الحساسة في النظام

**الحقول المطلوبة**:
```typescript
@Schema({ timestamps: true, collection: 'audit_logs' })
export class AuditLog extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId?: Types.ObjectId;

  @Prop()
  userEmail?: string;

  @Prop()
  userRole?: string;

  @Prop({ required: true })
  action: string; // e.g., 'user.ban', 'withdrawal.approve', 'settings.update'

  @Prop({ required: true })
  resource: string; // e.g., 'User', 'Withdrawal', 'Settings'

  @Prop({ type: Types.ObjectId })
  resourceId?: Types.ObjectId;

  @Prop()
  method?: string; // GET, POST, PATCH, DELETE

  @Prop()
  endpoint?: string; // /admin/users/:id/ban

  @Prop({ type: Object })
  requestBody?: Record<string, any>;

  @Prop({ type: Object })
  previousData?: Record<string, any>; // البيانات قبل التعديل

  @Prop({ type: Object })
  newData?: Record<string, any>; // البيانات بعد التعديل

  @Prop()
  ipAddress?: string;

  @Prop()
  userAgent?: string;

  @Prop({ enum: ['success', 'failure', 'error'] })
  status: string;

  @Prop()
  errorMessage?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>; // بيانات إضافية

  @Prop({ enum: ['low', 'medium', 'high', 'critical'] })
  severity: string;

  @Prop({ default: false })
  flagged: boolean; // للأنشطة المشبوهة
}
```

**Indexes**:
```typescript
AuditLogSchema.index({ userId: 1, createdAt: -1 });
AuditLogSchema.index({ action: 1, createdAt: -1 });
AuditLogSchema.index({ resource: 1, resourceId: 1 });
AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ severity: 1, flagged: 1 });
AuditLogSchema.index({ ipAddress: 1 });
```

**TTL Index** (للحذف التلقائي بعد سنة):
```typescript
AuditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 31536000 }); // 365 days
```

---

### 4. DataDeletionRequest Entity

**الموقع المقترح**: `backend-nest/src/modules/legal/entities/data-deletion-request.entity.ts`

**الوصف**: لإدارة طلبات حذف البيانات (GDPR)

**الحقول المطلوبة**:
```typescript
@Schema({ timestamps: true })
export class DataDeletionRequest extends Document {
  @Prop({ required: true })
  requestNumber: string; // DDR-YYYYMMDD-XXXX

  @Prop({ type: Types.ObjectId, refPath: 'userModel', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, enum: ['User', 'Driver', 'Vendor'] })
  userModel: string;

  @Prop({ required: true })
  userEmail: string;

  @Prop({ required: true })
  userPhone: string;

  @Prop({ 
    required: true, 
    enum: ['pending', 'under-review', 'approved', 'rejected', 'processing', 'completed'],
    default: 'pending'
  })
  status: string;

  @Prop({ required: true })
  reason: string;

  @Prop({ type: [String] })
  dataTypes: string[]; // ['personal_info', 'orders', 'transactions', 'all']

  @Prop({ default: false })
  hardDelete: boolean; // true = حذف نهائي، false = soft delete

  @Prop({ type: Types.ObjectId, ref: 'User' })
  reviewedBy?: Types.ObjectId;

  @Prop()
  reviewedAt?: Date;

  @Prop()
  reviewNotes?: string;

  @Prop()
  rejectionReason?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  approvedBy?: Types.ObjectId;

  @Prop()
  approvedAt?: Date;

  @Prop()
  scheduledDeletionDate?: Date; // تاريخ الحذف المجدول (بعد فترة سماح)

  @Prop()
  deletedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  deletedBy?: Types.ObjectId;

  @Prop({ type: Object })
  deletionSummary?: {
    ordersDeleted: number;
    transactionsAnonymized: number;
    filesDeleted: number;
    relationsRemoved: number;
  };

  @Prop({ type: [String] })
  backupFiles: string[]; // روابط النسخ الاحتياطية قبل الحذف

  @Prop({ default: false })
  notificationSent: boolean;

  @Prop({ type: Object })
  verificationData?: {
    code: string;
    verified: boolean;
    verifiedAt?: Date;
  };
}
```

**Indexes**:
```typescript
DataDeletionRequestSchema.index({ requestNumber: 1 }, { unique: true });
DataDeletionRequestSchema.index({ userId: 1, status: 1 });
DataDeletionRequestSchema.index({ status: 1, createdAt: 1 });
DataDeletionRequestSchema.index({ scheduledDeletionDate: 1 });
```

---

### 5. BackupRecord Entity

**الموقع المقترح**: `backend-nest/src/modules/admin/entities/backup-record.entity.ts`

**الوصف**: لإدارة سجلات النسخ الاحتياطية

**الحقول المطلوبة**:
```typescript
@Schema({ timestamps: true })
export class BackupRecord extends Document {
  @Prop({ required: true })
  backupId: string; // BACKUP-YYYYMMDD-HHMMSS

  @Prop({ required: true, enum: ['full', 'incremental', 'differential', 'collections'] })
  type: string;

  @Prop({ type: [String] })
  collections: string[]; // إذا كان collections backup

  @Prop({ required: true, enum: ['pending', 'in-progress', 'completed', 'failed'] })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop()
  description?: string;

  @Prop({ default: 0 })
  size: number; // بالبايت

  @Prop()
  path: string; // مسار الملف

  @Prop()
  s3Key?: string; // إذا كان في S3

  @Prop()
  checksum?: string; // MD5 hash للتحقق من السلامة

  @Prop({ default: false })
  encrypted: boolean;

  @Prop()
  encryptionKey?: string; // encrypted key

  @Prop()
  startedAt?: Date;

  @Prop()
  completedAt?: Date;

  @Prop({ default: 0 })
  duration: number; // seconds

  @Prop({ type: Object })
  stats?: {
    totalDocuments: number;
    totalSize: number;
    collectionsCount: number;
  };

  @Prop()
  errorMessage?: string;

  @Prop()
  expiresAt?: Date; // تاريخ انتهاء الصلاحية

  @Prop({ default: false })
  isRestored: boolean;

  @Prop()
  restoredAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  restoredBy?: Types.ObjectId;

  @Prop({ type: [String] })
  tags: string[];
}
```

**Indexes**:
```typescript
BackupRecordSchema.index({ backupId: 1 }, { unique: true });
BackupRecordSchema.index({ status: 1, createdAt: -1 });
BackupRecordSchema.index({ createdBy: 1 });
BackupRecordSchema.index({ expiresAt: 1 });
BackupRecordSchema.index({ type: 1, status: 1 });
```

---

## 🟠 الأولوية العالية - خلال الأسبوع الأول

---

### 6. DriverShift Entity

**الموقع المقترح**: `backend-nest/src/modules/driver/entities/driver-shift.entity.ts`

**الحقول المطلوبة**:
```typescript
@Schema({ timestamps: true })
export class DriverShift extends Document {
  @Prop({ required: true })
  name: string; // e.g., "Morning Shift", "Night Shift"

  @Prop({ required: true })
  startTime: string; // "08:00"

  @Prop({ required: true })
  endTime: string; // "16:00"

  @Prop({ type: [Number], default: [0, 1, 2, 3, 4, 5, 6] })
  days: number[]; // 0=Sunday, 1=Monday, etc.

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: [{ 
    driverId: { type: Types.ObjectId, ref: 'Driver' },
    startDate: Date,
    endDate: Date,
    isActive: Boolean
  }] })
  assignments: Array<{
    driverId: Types.ObjectId;
    startDate: Date;
    endDate?: Date;
    isActive: boolean;
  }>;

  @Prop({ type: Object })
  breakTimes?: {
    start: string;
    end: string;
    duration: number; // minutes
  };

  @Prop()
  maxDrivers?: number;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;
}
```

---

### 7. AppSettings Entity

**الموقع المقترح**: `backend-nest/src/modules/admin/entities/app-settings.entity.ts`

**الحقول المطلوبة**:
```typescript
@Schema({ timestamps: true })
export class AppSettings extends Document {
  @Prop({ required: true, unique: true })
  key: string;

  @Prop({ required: true, type: Object })
  value: any;

  @Prop({ enum: ['string', 'number', 'boolean', 'object', 'array'] })
  type: string;

  @Prop()
  description?: string;

  @Prop({ default: false })
  isPublic: boolean; // يمكن للعملاء قراءته

  @Prop({ default: false })
  isEncrypted: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy?: Types.ObjectId;

  @Prop()
  category?: string; // 'general', 'payment', 'delivery', 'commission'

  @Prop({ type: Object })
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    enum?: string[];
  };
}
```

---

### 8. FeatureFlag Entity

**الموقع المقترح**: `backend-nest/src/modules/admin/entities/feature-flag.entity.ts`

**الحقول المطلوبة**:
```typescript
@Schema({ timestamps: true })
export class FeatureFlag extends Document {
  @Prop({ required: true, unique: true })
  key: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ default: false })
  enabled: boolean;

  @Prop({ enum: ['development', 'staging', 'production', 'all'], default: 'all' })
  environment: string;

  @Prop({ type: [String] })
  enabledForUsers?: string[]; // user IDs for beta testing

  @Prop({ type: [String] })
  enabledForRoles?: string[]; // roles

  @Prop({ min: 0, max: 100 })
  rolloutPercentage?: number; // for gradual rollout

  @Prop()
  startDate?: Date;

  @Prop()
  endDate?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy?: Types.ObjectId;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}
```

---

### 9. LoginAttempt Entity

**الموقع المقترح**: `backend-nest/src/modules/auth/entities/login-attempt.entity.ts`

**الحقول المطلوبة**:
```typescript
@Schema({ timestamps: true })
export class LoginAttempt extends Document {
  @Prop()
  userId?: Types.ObjectId;

  @Prop({ required: true })
  identifier: string; // email or phone

  @Prop({ required: true })
  ipAddress: string;

  @Prop()
  userAgent?: string;

  @Prop({ required: true, enum: ['success', 'failure'] })
  status: string;

  @Prop()
  failureReason?: string; // 'invalid_credentials', 'account_locked', 'banned'

  @Prop({ type: Object })
  location?: {
    country?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };

  @Prop()
  device?: string;

  @Prop()
  browser?: string;

  @Prop({ default: false })
  isSuspicious: boolean;
}
```

**TTL Index**:
```typescript
LoginAttemptSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // 30 days
LoginAttemptSchema.index({ identifier: 1, createdAt: -1 });
LoginAttemptSchema.index({ ipAddress: 1, createdAt: -1 });
```

---

## 🟡 الأولوية المتوسطة - خلال أسبوعين

---

### 10. DriverAsset Entity

**الحقول المطلوبة**:
```typescript
@Schema({ timestamps: true })
export class DriverAsset extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string; // 'motorcycle', 'bike', 'bag', 'phone', 'uniform'

  @Prop()
  serialNumber?: string;

  @Prop({ required: true })
  value: number;

  @Prop({ enum: ['available', 'assigned', 'maintenance', 'retired'], default: 'available' })
  status: string;

  @Prop()
  condition?: string; // 'new', 'good', 'fair', 'poor'

  @Prop({ type: Types.ObjectId, ref: 'Driver' })
  assignedTo?: Types.ObjectId;

  @Prop()
  assignedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignedBy?: Types.ObjectId;

  @Prop()
  returnedAt?: Date;

  @Prop()
  returnCondition?: string;

  @Prop()
  returnNotes?: string;

  @Prop({ type: [{ date: Date, description: String, cost: Number }] })
  maintenanceHistory: Array<{
    date: Date;
    description: string;
    cost: number;
  }>;
}
```

---

### 11. QualityReview Entity

**الحقول المطلوبة**:
```typescript
@Schema({ timestamps: true })
export class QualityReview extends Document {
  @Prop({ required: true, enum: ['driver', 'store', 'order'] })
  type: string;

  @Prop({ type: Types.ObjectId, refPath: 'type' })
  entityId: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true })
  comments: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  reviewedBy: Types.ObjectId;

  @Prop({ type: [String] })
  issues: string[];

  @Prop({ type: [String] })
  positives: string[];

  @Prop({ type: [String] })
  photos: string[];

  @Prop({ enum: ['pending', 'acknowledged', 'resolved'], default: 'pending' })
  status: string;
}
```

---

### 12. ActivationCode Entity

**الحقول المطلوبة**:
```typescript
@Schema({ timestamps: true })
export class ActivationCode extends Document {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ enum: ['driver', 'vendor', 'any'], default: 'any' })
  userType: string;

  @Prop({ enum: ['unused', 'used', 'expired'], default: 'unused' })
  status: string;

  @Prop()
  expiresAt?: Date;

  @Prop({ type: Types.ObjectId, refPath: 'userType' })
  usedBy?: Types.ObjectId;

  @Prop()
  usedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  generatedBy: Types.ObjectId;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}
```

---

### 13. ErrorLog Entity

**الحقول المطلوبة**:
```typescript
@Schema({ timestamps: true })
export class ErrorLog extends Document {
  @Prop({ required: true })
  message: string;

  @Prop()
  stack?: string;

  @Prop({ enum: ['low', 'medium', 'high', 'critical'] })
  severity: string;

  @Prop()
  code?: string;

  @Prop()
  endpoint?: string;

  @Prop()
  method?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId?: Types.ObjectId;

  @Prop()
  ipAddress?: string;

  @Prop({ type: Object })
  requestBody?: Record<string, any>;

  @Prop({ type: Object })
  headers?: Record<string, any>;

  @Prop({ default: false })
  resolved: boolean;

  @Prop()
  resolvedAt?: Date;
}
```

**TTL Index**:
```typescript
ErrorLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // 30 days
```

---

## 📝 ملاحظات التنفيذ

### Best Practices

1. **Timestamps**: جميع الـ Entities يجب أن تحتوي على `timestamps: true`

2. **Indexes**: إضافة indexes مناسبة لتحسين الأداء

3. **Validation**: استخدام class-validator في الـ DTOs

4. **Soft Delete**: استخدام soft delete للبيانات الحساسة

5. **Audit Trail**: تسجيل جميع التعديلات في AuditLog

6. **TTL Indexes**: للبيانات المؤقتة (logs, attempts)

### Security Considerations

1. **Encryption**: تشفير البيانات الحساسة (bankDetails, passwords)

2. **Access Control**: RBAC للـ endpoints الحساسة

3. **Rate Limiting**: لمنع الهجمات

4. **Input Validation**: التحقق من جميع المدخلات

5. **Audit Logging**: تسجيل جميع العمليات الحساسة

---

## 🔗 الربط مع Modules الموجودة

### Finance Module
- `WithdrawalRequest` → `WalletTransaction`
- `BackupRecord` → `Settlement`

### ER Module
- `DriverShift` → `Attendance`
- استخدام `LeaveRequest` الموجود

### Legal Module
- `DataDeletionRequest` → `UserConsent`

### Marketer Module
- استخدام `Marketer`, `CommissionPlan`, `Onboarding` الموجودة

---

**آخر تحديث**: 2025-10-15
**الحالة**: جاهز للتنفيذ

