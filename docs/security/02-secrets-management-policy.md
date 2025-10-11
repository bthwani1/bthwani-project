# سياسة إدارة الأسرار والدوران لمنصة بثواني

## نظرة عامة على سياسة الأسرار

توثق هذه السياسة إجراءات إدارة وحماية ودوران الأسرار (Secrets) في منصة بثواني، مع ضمان أعلى مستويات الأمان والامتثال للمعايير الدولية.

## تصنيف الأسرار وحساسيتها

### مستويات حساسية الأسرار

| المستوى | الوصف | أمثلة | متطلبات الحماية | دورة الدوران |
|---------|--------|--------|-------------------|-------------|
| **حرج (Critical)** | أسرار تتحكم في أمان النظام بالكامل | مفاتيح تشفير قاعدة البيانات، شهادات SSL الجذر | تشفير متقدم، نسخ احتياطية آمنة، دوران شهري | شهرياً |
| **عالي (High)** | أسرار تؤثر على وظائف رئيسية | مفاتيح API لبوابات الدفع، رموز المصادقة | تشفير قوي، مراقبة مستمرة، دوران ربع سنوي | ربع سنوي |
| **متوسط (Medium)** | أسرار لخدمات مساعدة | رموز وصول خدمات خارجية، مفاتيح تخزين | تشفير أساسي، مراقبة دورية، دوران سنوي | سنوياً |
| **منخفض (Low)** | أسرار للتطوير والاختبار | مفاتيح اختبار، رموز وصول مؤقتة | تشفير بسيط، حذف فوري بعد الاستخدام | حسب الحاجة |

## هيكل نظام إدارة الأسرار

### 1. نظام تخزين الأسرار (Secrets Management)

#### أدوات مستخدمة
- **HashiCorp Vault**: نظام إدارة أسرار متقدم
- **AWS Secrets Manager**: تخزين آمن للأسرار السحابية
- **Kubernetes Secrets**: إدارة أسرار الحاويات
- **نظام داخلي**: تخزين مشفر محلي

#### هيكل تخزين الأسرار
```typescript
interface SecretStructure {
  id: string;
  name: string;
  type: 'api_key' | 'password' | 'certificate' | 'token' | 'key_pair';
  sensitivity: 'critical' | 'high' | 'medium' | 'low';

  // بيانات الأمان
  encryption: {
    algorithm: 'AES-256-GCM' | 'ChaCha20-Poly1305';
    keyRotation: 'automatic' | 'manual';
    backupEncryption: boolean;
  };

  // إعدادات الوصول
  access: {
    allowedEnvironments: string[];
    allowedServices: string[];
    requiredApprovals: number;
    maxAccessDuration: number; // بالساعات
  };

  // معلومات الدوران
  rotation: {
    schedule: 'monthly' | 'quarterly' | 'yearly' | 'manual';
    lastRotated: string;
    nextRotation: string;
    rotationWindow: number; // بالساعات
  };

  // معلومات التتبع
  metadata: {
    createdBy: string;
    createdAt: string;
    lastAccessedBy?: string;
    lastAccessedAt?: string;
    accessCount: number;
  };
}
```

### 2. لوحة إدارة الأسرار

```typescript
// مكون إدارة الأسرار للمشرفين
const SecretsManagementDashboard = () => {
  const [secrets, setSecrets] = useState<SecretStructure[]>([]);
  const [rotationSchedule, setRotationSchedule] = useState({});

  const rotateSecret = async (secretId: string) => {
    // إنشاء سر جديد
    const newSecret = await generateNewSecret(secretId);

    // تحديث جميع المراجع للسر
    await updateSecretReferences(secretId, newSecret);

    // حذف السر القديم بعد فترة انتقالية
    await scheduleOldSecretDeletion(secretId, 24); // 24 ساعة

    // تسجيل عملية الدوران
    await logSecretRotation(secretId, 'manual_rotation');

    // إشعار الفريق المعني
    await notifyTeam('secret_rotated', { secretId });
  };

  return (
    <div className="secrets-dashboard">
      <div className="secrets-overview">
        <h3>نظرة عامة على الأسرار</h3>
        <div className="secrets-stats">
          <MetricCard title="أسرار حرجة" value={countBySensitivity('critical')} />
          <MetricCard title="أسرار تحتاج دوران" value={secretsNeedingRotation.length} />
          <MetricCard title="عمليات الوصول الشهرية" value={totalAccessThisMonth} />
        </div>
      </div>

      <div className="rotation-schedule">
        <h3>جدول الدوران القادم</h3>
        <RotationScheduleTable
          schedule={rotationSchedule}
          onRotate={(secretId) => rotateSecret(secretId)}
        />
      </div>
    </div>
  );
};
```

## سياسات الدوران (Rotation Policies)

### 1. جدولة الدوران التلقائي

```yaml
# جدول دوران الأسرار التلقائي
rotation_schedule:
  critical_secrets:
    frequency: "monthly"
    day_of_month: 1
    time_window: "2h"  # نافذة زمنية للدوران
    approval_required: true

  high_secrets:
    frequency: "quarterly"
    day_of_quarter: 1
    time_window: "4h"
    approval_required: true

  medium_secrets:
    frequency: "yearly"
    day_of_year: 1
    time_window: "8h"
    approval_required: false

  low_secrets:
    frequency: "manual"
    approval_required: false
```

### 2. إجراءات الدوران اليدوي

```typescript
// دوران سر محدد يدوياً
const manualSecretRotation = async (secretId: string, reason: string) => {
  // 1. إنشاء نسخة احتياطية من السر الحالي
  await backupCurrentSecret(secretId);

  // 2. إنشاء سر جديد
  const newSecretValue = await generateNewSecretValue(secretId);

  // 3. تحديث السر في نظام التخزين
  await updateSecretInVault(secretId, newSecretValue);

  // 4. تحديث جميع المراجع للسر
  const servicesToUpdate = await getServicesUsingSecret(secretId);
  await Promise.all(
    servicesToUpdate.map(service => updateServiceSecret(service, secretId, newSecretValue))
  );

  // 5. جدولة حذف السر القديم
  await scheduleOldSecretDeletion(secretId, 48); // 48 ساعة

  // 6. تسجيل العملية
  await logSecretRotation(secretId, 'manual', reason);

  return {
    success: true,
    newSecretId: generateSecretId(),
    rotationCompletedAt: new Date().toISOString()
  };
};
```

## مراقبة وتدقيق الأسرار

### 1. مراقبة الوصول للأسرار

```typescript
interface SecretAccessLog {
  id: string;
  secretId: string;
  accessedBy: string;
  accessedAt: string;
  accessType: 'read' | 'update' | 'delete' | 'rotate';
  ipAddress: string;
  userAgent: string;
  justification?: string;
  approvedBy?: string;

  // معلومات السياق
  context: {
    serviceName?: string;
    environment: string;
    operation: string;
  };
}

// تسجيل كل عملية وصول للأسرار
const logSecretAccess = async (access: SecretAccessLog) => {
  await SecretAuditLog.create({
    ...access,
    timestamp: new Date().toISOString(),
    retention: {
      scheduledDeletion: new Date(Date.now() + 7 * 365 * 24 * 60 * 60 * 1000) // 7 سنوات
    }
  });

  // فحص الأنماط المشبوهة
  await detectSuspiciousAccessPatterns(access);
};
```

### 2. تنبيهات الأمان للأسرار

```typescript
interface SecretSecurityAlert {
  id: string;
  type: 'unauthorized_access' | 'unusual_pattern' | 'rotation_overdue' | 'weak_secret';
  severity: 'low' | 'medium' | 'high' | 'critical';
  secretId: string;
  description: string;
  detectedAt: string;

  // معلومات إضافية
  details: {
    suspiciousActivity?: string;
    recommendedAction: string;
    autoRemediation?: boolean;
  };
}

// قواعد التنبيه التلقائي
const secretAlertRules = [
  {
    type: 'unauthorized_access',
    condition: 'access_without_approval && secret.sensitivity === "critical"',
    severity: 'critical',
    autoRemediation: true,
    action: 'revoke_access_and_notify_security_team'
  },
  {
    type: 'rotation_overdue',
    condition: 'days_since_last_rotation > rotation_schedule_days',
    severity: 'high',
    autoRemediation: false,
    action: 'notify_secret_owner_and_schedule_rotation'
  },
  {
    type: 'unusual_pattern',
    condition: 'access_frequency > baseline * 3',
    severity: 'medium',
    autoRemediation: false,
    action: 'notify_secret_owner_for_review'
  }
];
```

## تكامل مع أدوات CI/CD

### 1. تكامل مع GitHub Actions

```yaml
# سير عمل دوران الأسرار في GitHub Actions
name: Secrets Rotation Workflow

on:
  schedule:
    - cron: '0 0 1 * *'  # اليوم الأول من كل شهر
  workflow_dispatch:      # دوران يدوي

jobs:
  rotate-critical-secrets:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Rotate critical secrets
        run: npm run rotate:critical-secrets
        env:
          VAULT_TOKEN: ${{ secrets.VAULT_TOKEN }}
          SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}

      - name: Notify team
        run: |
          curl -X POST -H 'Content-type: application/json' \
            --data '{"text":"Critical secrets rotated successfully"}' \
            $SLACK_WEBHOOK
```

### 2. تكامل مع Kubernetes

```yaml
# إدارة أسرار Kubernetes
apiVersion: v1
kind: Secret
metadata:
  name: database-credentials
  namespace: production
  annotations:
    secrets-manager/rotation-schedule: "monthly"
    secrets-manager/last-rotated: "2025-01-01T00:00:00Z"
    secrets-manager/rotation-duration: "2h"
type: Opaque
data:
  username: <base64-encoded-username>
  password: <base64-encoded-password>
---
# مهمة دوران الأسرار
apiVersion: batch/v1
kind: CronJob
metadata:
  name: secrets-rotation
  namespace: production
spec:
  schedule: "0 0 1 * *"  # شهرياً
  jobTemplate:
    spec:
      template:
        spec:
          serviceAccountName: secrets-manager
          containers:
          - name: rotator
            image: bthwani/secrets-rotator:latest
            env:
            - name: VAULT_ADDR
              value: "https://vault.bthwani.com"
          restartPolicy: OnFailure
```

## الخلاصة والتوصيات

### النتائج الحالية
- ✅ **نظام إدارة أسرار متقدم**: HashiCorp Vault متكامل مع جميع البيئات
- ✅ **دوران منتظم**: جدولة تلقائية لدوران جميع الأسرار حسب حساسيتها
- ✅ **مراقبة شاملة**: تتبع كامل للوصول والاستخدام
- ✅ **تنبيهات أمنية**: كشف فوري للأنشطة المشبوهة
- ✅ **تكامل مع CI/CD**: أتمتة عمليات الدوران والنشر

### التوصيات الرئيسية

1. **مراجعة دورية**: مراجعة شاملة للأسرار كل ربع سنة
2. **تقليل سطح الهجوم**: حذف الأسرار غير المستخدمة فوراً
3. **تدريب الفريق**: تثقيف المطورين حول أفضل ممارسات إدارة الأسرار
4. **مراقبة متقدمة**: تطبيق تحليلات للكشف عن الأنماط المشبوهة
5. **نسخ احتياطية آمنة**: ضمان سلامة النسخ الاحتياطية للأسرار

### مؤشرات الأمان

| المؤشر | الهدف | طريقة القياس | تكرار المراجعة |
|---------|-------|-------------|----------------|
| **تغطية الدوران** | 100% | نسبة الأسرار التي تم دورانها في وقتها | شهري |
| **وقت اكتشاف الوصول غير المصرح** | < 5 دقائق | وقت من الوصول لاكتشافه | أسبوعي |
| **معدل الأسرار الضعيفة** | 0% | نسبة الأسرار التي لا تتوافق مع متطلبات القوة | شهري |
| **وقت الاستجابة للتنبيهات** | < 15 دقيقة | متوسط وقت الاستجابة للتنبيهات الأمنية | أسبوعي |

---

هذه السياسة تُحدث سنوياً مع مراجعة شاملة للمتطلبات الأمنية والتغييرات في البنية التحتية.
