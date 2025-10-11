# سياسة الاحتفاظ بالبيانات والحذف لمنصة بثواني

## نظرة عامة على سياسة البيانات

توثق هذه السياسة قواعد الاحتفاظ بالبيانات وحذفها في منصة بثواني، مع ضمان الامتثال لمعايير حماية البيانات مثل GDPR وCCPA وقوانين حماية البيانات المحلية.

## مبادئ سياسة البيانات

### 1. الاحتفاظ بالحد الأدنى من البيانات (Data Minimization)
- جمع البيانات الضرورية فقط لتشغيل الخدمة
- حذف البيانات غير الضرورية فوراً
- مراجعة دورية للبيانات المخزنة

### 2. الاحتفاظ للمدة المطلوبة فقط (Retention Limitation)
- تحديد مدد احتفاظ محددة لكل نوع بيانات
- حذف تلقائي عند انتهاء مدة الاحتفاظ
- تمديد المدة فقط لأسباب قانونية محددة

### 3. حقوق أصحاب البيانات (Data Subject Rights)
- حق الوصول إلى البيانات الشخصية
- حق تصحيح البيانات غير الصحيحة
- حق حذف البيانات (Right to be Forgotten)
- حق نقل البيانات (Data Portability)

## تصنيف البيانات ومدد الاحتفاظ

### 1. بيانات المستخدمين الأساسية (User Core Data)

| نوع البيانات | مدة الاحتفاظ | سبب الاحتفاظ | آلية الحذف |
|---------------|---------------|---------------|-------------|
| **بيانات التسجيل** (الاسم، البريد، الهاتف) | 7 سنوات | الامتثال للقوانين المالية | حذف تلقائي + نسخة احتياطية |
| **بيانات المصادقة** (كلمات مرور، tokens) | 90 يوماً بعد آخر تسجيل دخول | أمان الحساب | حذف فوري بعد انتهاء الصلاحية |
| **صور الملف الشخصي** | حتى حذف الحساب | عرض الملف الشخصي | حذف فوري مع الحساب |
| **بيانات الموقع** | 30 يوماً | تحسين الخدمة | حذف تلقائي |

### 2. بيانات الطلبات والمعاملات (Transaction Data)

| نوع البيانات | مدة الاحتفاظ | سبب الاحتفاظ | آلية الحذف |
|---------------|---------------|---------------|-------------|
| **تفاصيل الطلبات** | 7 سنوات | قوانين التجارة والضرائب | أرشفة بعد 2 سنوات |
| **بيانات الدفع** | 7 سنوات | قوانين مكافحة غسيل الأموال | تشفير وأرشفة |
| **تتبع التوصيل** | 90 يوماً | خدمة العملاء | حذف تلقائي |
| **تقييمات العملاء** | 5 سنوات | تحسين الخدمة | إخفاء الهوية بعد سنتين |

### 3. بيانات التحليلات والسجلات (Analytics & Logs)

| نوع البيانات | مدة الاحتفاظ | سبب الاحتفاظ | آلية الحذف |
|---------------|---------------|---------------|-------------|
| **أحداث المستخدمين** | 2 سنوات | تحليل السلوك وتحسين المنتج | إخفاء الهوية بعد سنة |
| **سجلات الأخطاء** | 1 سنة | تشخيص المشاكل | حذف تلقائي |
| **سجلات الأمان** | 3 سنوات | الامتثال للمعايير الأمنية | أرشفة آمنة |
| **بيانات الأداء** | 6 أشهر | مراقبة الأداء | حذف تلقائي |

## آليات الحذف والتدمير

### 1. حذف البيانات الشخصية (Personal Data Deletion)

```typescript
interface DataDeletionRequest {
  userId: string;
  deletionType: 'account' | 'specific_data' | 'right_to_be_forgotten';
  reason: string;
  requestedBy: string;
  requestedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'failed';
}

// عملية حذف حساب مستخدم كاملة
const deleteUserAccount = async (userId: string, reason: string) => {
  const deletionRequest: DataDeletionRequest = {
    userId,
    deletionType: 'account',
    reason,
    requestedBy: 'user',
    requestedAt: new Date().toISOString(),
    status: 'approved'
  };

  // حفظ طلب الحذف للمراجعة
  await saveDeletionRequest(deletionRequest);

  // حذف البيانات من جميع الأنظمة
  await Promise.all([
    deleteUserFromDatabase(userId),
    deleteUserFromAnalytics(userId),
    deleteUserFromLogs(userId),
    deleteUserFromBackups(userId),
    deleteUserFromCDN(userId)
  ]);

  // إرسال تأكيد للمستخدم
  await sendDeletionConfirmation(userId);

  // تسجيل العملية في سجلات التدقيق
  await logDeletionAudit(userId, 'account_deleted');
};
```

### 2. جدولة الحذف التلقائي (Automated Retention)

```javascript
// سكريبت حذف البيانات المنتهية الصلاحية
const cleanupExpiredData = async () => {
  const now = new Date();

  // حذف الجلسات المنتهية الصلاحية
  await Session.deleteMany({
    expiresAt: { $lt: now }
  });

  // حذف السجلات القديمة
  await Log.deleteMany({
    createdAt: { $lt: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) }
  });

  // حذف البيانات المؤقتة
  await TempData.deleteMany({
    expiresAt: { $lt: now }
  });

  // حذف الملفات المؤقتة من التخزين
  await cleanupTempFiles();
};
```

## حقوق أصحاب البيانات (GDPR Compliance)

### 1. حق الوصول (Right of Access)

```typescript
// طلب بيانات المستخدم
const getUserData = async (userId: string) => {
  const userData = {
    personal: await getUserPersonalData(userId),
    orders: await getUserOrders(userId),
    payments: await getUserPayments(userId),
    activity: await getUserActivityLogs(userId),
    preferences: await getUserPreferences(userId)
  };

  // إخفاء البيانات الحساسة
  const sanitizedData = sanitizeSensitiveData(userData);

  return {
    requestedAt: new Date().toISOString(),
    data: sanitizedData,
    format: 'json',
    retentionInfo: getRetentionInfo()
  };
};
```

### 2. حق التصحيح (Right to Rectification)

```typescript
// تصحيح بيانات المستخدم
const updateUserData = async (userId: string, updates: any) => {
  // التحقق من صحة البيانات الجديدة
  const validatedUpdates = validateUserUpdates(updates);

  // تحديث البيانات في قاعدة البيانات
  await User.updateOne({ _id: userId }, validatedUpdates);

  // تسجيل التغيير في سجلات التدقيق
  await logDataChange(userId, 'data_corrected', { updates });

  // إشعار المستخدم بالتغيير
  await notifyUserDataUpdated(userId, validatedUpdates);
};
```

### 3. حق الحذف (Right to Erasure)

```typescript
// حذف جميع بيانات المستخدم
const eraseUserData = async (userId: string) => {
  // التحقق من عدم وجود التزامات قانونية تحظر الحذف
  const legalHold = await checkLegalHold(userId);
  if (legalHold.exists) {
    throw new Error('Data deletion blocked by legal hold');
  }

  // حذف البيانات من جميع المصادر
  const deletionResults = await Promise.allSettled([
    deleteFromDatabase(userId),
    deleteFromAnalytics(userId),
    deleteFromLogs(userId),
    deleteFromBackups(userId),
    deleteFromExternalServices(userId)
  ]);

  // التحقق من نجاح جميع عمليات الحذف
  const failures = deletionResults.filter(result => result.status === 'rejected');

  if (failures.length > 0) {
    await logDeletionFailures(userId, failures);
    throw new Error('Some data deletion operations failed');
  }

  // تسجيل الحذف في سجلات التدقيق
  await logDataDeletion(userId, 'gdpr_erasure');

  return { success: true, deletedAt: new Date().toISOString() };
};
```

## آليات الحماية والأمان

### 1. تشفير البيانات (Data Encryption)

```typescript
// تشفير البيانات أثناء التخزين
const encryptSensitiveData = (data: string) => {
  const algorithm = 'aes-256-gcm';
  const key = process.env.ENCRYPTION_KEY;
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipher(algorithm, key);
  cipher.setAAD(Buffer.from('additional-auth-data'));

  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  };
};
```

### 2. نسخ احتياطية آمنة (Secure Backups)

```yaml
# إعدادات النسخ الاحتياطي المشفر
backup:
  encryption:
    enabled: true
    algorithm: "AES-256-GCM"
    key_rotation_days: 90

  retention:
    daily: 30     # احتفظ بالنسخ اليومية لمدة 30 يوم
    weekly: 12    # احتفظ بالنسخ الأسبوعية لمدة 12 أسبوع
    monthly: 24   # احتفظ بالنسخ الشهرية لمدة 24 شهر

  storage:
    primary: "encrypted-s3-bucket"
    secondary: "encrypted-azure-blob"
    tertiary: "encrypted-gcp-bucket"
```

## مراقبة الامتثال والتدقيق

### 1. سجلات التدقيق (Audit Logs)

```typescript
interface DataAuditLog {
  id: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'export';
  dataType: string;
  userId?: string;
  adminId?: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  location?: string;
  purpose: string;
  legalBasis?: string;
  retention: {
    scheduledDeletion: string;
    actualDeletion?: string;
  };
}

// تسجيل جميع عمليات البيانات
const logDataAccess = async (action: DataAuditLog) => {
  await AuditLog.create({
    ...action,
    timestamp: new Date().toISOString(),
    retention: {
      scheduledDeletion: calculateRetentionDate(action.dataType)
    }
  });
};
```

### 2. لوحة مراقبة الامتثال (Compliance Dashboard)

```typescript
// مكون مراقبة امتثال البيانات
const ComplianceDashboard = () => {
  const [complianceMetrics, setComplianceMetrics] = useState({});

  useEffect(() => {
    const fetchComplianceData = async () => {
      const metrics = await api.getComplianceMetrics({
        timeRange: '30d',
        include: ['gdpr', 'ccpa', 'data_retention', 'audit_logs']
      });
      setComplianceMetrics(metrics);
    };

    fetchComplianceData();
    const interval = setInterval(fetchComplianceData, 3600000); // كل ساعة

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="compliance-dashboard">
      <div className="gdpr-compliance">
        <h3>امتثال GDPR</h3>
        <ComplianceMetric
          title="طلبات الوصول إلى البيانات"
          value={complianceMetrics.dataAccessRequests}
          target="< 30 أيام للرد"
        />
        <ComplianceMetric
          title="طلبات الحذف"
          value={complianceMetrics.deletionRequests}
          target="معدلة خلال 30 يوماً"
        />
      </div>

      <div className="data-retention">
        <h3>الاحتفاظ بالبيانات</h3>
        <Chart
          title="البيانات حسب مدة الاحتفاظ"
          data={complianceMetrics.retentionDistribution}
          type="pie"
        />
      </div>
    </div>
  );
};
```

## الخلاصة والتوصيات

### النتائج الحالية
- ✅ **سياسة احتفاظ محددة**: مدد احتفاظ واضحة لجميع أنواع البيانات
- ✅ **آليات حذف فعالة**: حذف تلقائي ويدوي للبيانات المنتهية الصلاحية
- ✅ **حقوق المستخدمين مضمونة**: تطبيق كامل لحقوق GDPR
- ✅ **حماية وتشفير**: تشفير شامل للبيانات الحساسة
- ✅ **مراقبة وتدقيق**: تتبع كامل لجميع عمليات البيانات

### التوصيات الرئيسية

1. **مراجعة دورية**: مراجعة مدد الاحتفاظ سنوياً
2. **أتمتة الحذف**: زيادة استخدام المهام المجدولة للحذف التلقائي
3. **تحسين التشفير**: تطبيق تشفير شامل للبيانات أثناء النقل والتخزين
4. **تدريب الفريق**: تدريب منتظم على سياسات حماية البيانات
5. **مراقبة مستمرة**: مراقبة يومية للامتثال والأمان

### مؤشرات الامتثال

| المؤشر | الهدف | طريقة القياس | تكرار المراجعة |
|---------|-------|-------------|----------------|
| **وقت الرد على طلبات البيانات** | < 30 يوماً | تتبع وقت الرد في نظام التذاكر | شهري |
| **معدل الحذف الناجح** | > 99% | نسبة طلبات الحذف المكتملة بنجاح | ربع سنوي |
| **تغطية التشفير** | 100% | نسبة البيانات المشفرة | شهري |
| **دقة سجلات التدقيق** | 100% | مراجعة يدوية لسجلات التدقيق | ربع سنوي |

---

هذه السياسة تُحدث سنوياً مع مراجعة شاملة للمتطلبات القانونية والتغييرات في قوانين حماية البيانات.
