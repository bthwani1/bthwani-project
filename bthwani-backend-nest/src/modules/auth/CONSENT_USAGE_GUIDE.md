# دليل استخدام نظام الموافقات (User Consent System)

## نظرة عامة
نظام شامل لإدارة موافقات المستخدمين بما يتوافق مع معايير GDPR وحماية البيانات.

## أنواع الموافقات المتاحة

```typescript
enum ConsentType {
  PRIVACY_POLICY = 'privacy_policy',        // سياسة الخصوصية
  TERMS_OF_SERVICE = 'terms_of_service',    // شروط الخدمة
  MARKETING = 'marketing',                  // التسويق والإعلانات
  DATA_PROCESSING = 'data_processing',      // معالجة البيانات
}
```

---

## API Endpoints

### 1. تسجيل موافقة واحدة
```http
POST /auth/consent
Authorization: Bearer {token}
Content-Type: application/json

{
  "consentType": "privacy_policy",
  "granted": true,
  "version": "1.0.0",
  "notes": "موافقة تلقائية عند التسجيل"
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم تسجيل الموافقة بنجاح",
  "data": {
    "_id": "...",
    "userId": "...",
    "consentType": "privacy_policy",
    "granted": true,
    "version": "1.0.0",
    "consentDate": "2025-10-14T...",
    "ipAddress": "192.168.1.1",
    "userAgent": "..."
  }
}
```

---

### 2. تسجيل موافقات متعددة
```http
POST /auth/consent/bulk
Authorization: Bearer {token}

{
  "consents": [
    {
      "consentType": "privacy_policy",
      "granted": true,
      "version": "1.0.0"
    },
    {
      "consentType": "terms_of_service",
      "granted": true,
      "version": "1.0.0"
    }
  ]
}
```

---

### 3. سحب موافقة
```http
DELETE /auth/consent/{type}
Authorization: Bearer {token}

{
  "reason": "المستخدم لم يعد راغبًا في تلقي رسائل تسويقية"
}
```

---

### 4. الحصول على سجل الموافقات
```http
GET /auth/consent/history?type=privacy_policy
Authorization: Bearer {token}
```

---

### 5. ملخص موافقات المستخدم
```http
GET /auth/consent/summary
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "privacy_policy": {
      "hasActiveConsent": true,
      "latestConsent": {
        "granted": true,
        "version": "1.0.0",
        "date": "2025-10-14T...",
        "withdrawnAt": null
      }
    },
    "terms_of_service": {
      "hasActiveConsent": true,
      "latestConsent": {...}
    },
    "marketing": {
      "hasActiveConsent": false,
      "latestConsent": null
    },
    "data_processing": {
      "hasActiveConsent": true,
      "latestConsent": {...}
    }
  }
}
```

---

### 6. التحقق من موافقة محددة
```http
GET /auth/consent/check/privacy_policy
Authorization: Bearer {token}
```

---

## استخدام Guards

### 1. Guard عام للموافقات المتعددة
```typescript
import { RequireConsents, ConsentGuard } from '@/common/guards/consent.guard';
import { ConsentType } from '@/modules/auth/dto/consent.dto';

@Controller('orders')
export class OrderController {
  
  // يتطلب موافقة على سياسة الخصوصية وشروط الخدمة
  @Post()
  @UseGuards(UnifiedAuthGuard, ConsentGuard)
  @RequireConsents(ConsentType.PRIVACY_POLICY, ConsentType.TERMS_OF_SERVICE)
  async createOrder() {
    // ...
  }
}
```

### 2. Guard محدد لسياسة الخصوصية
```typescript
import { PrivacyPolicyConsentGuard } from '@/common/guards/consent.guard';

@Controller('profile')
export class ProfileController {
  
  @Get('sensitive-data')
  @UseGuards(UnifiedAuthGuard, PrivacyPolicyConsentGuard)
  async getSensitiveData() {
    // ...
  }
}
```

### 3. Guard لشروط الخدمة
```typescript
import { TermsOfServiceConsentGuard } from '@/common/guards/consent.guard';

@Controller('services')
export class ServicesController {
  
  @Post('subscribe')
  @UseGuards(UnifiedAuthGuard, TermsOfServiceConsentGuard)
  async subscribe() {
    // ...
  }
}
```

---

## التكامل مع Registration Flow

### في AuthService
```typescript
async registerUser(registerDto: RegisterDto, req: Request) {
  // 1. إنشاء المستخدم
  const user = await this.createUser(registerDto);
  
  // 2. تسجيل الموافقات الإلزامية
  const ipAddress = req.ip;
  const userAgent = req.headers['user-agent'];
  
  await this.consentService.recordBulkConsents(
    user._id.toString(),
    [
      {
        consentType: ConsentType.PRIVACY_POLICY,
        granted: true,
        version: '1.0.0',
      },
      {
        consentType: ConsentType.TERMS_OF_SERVICE,
        granted: true,
        version: '1.0.0',
      },
    ],
    ipAddress,
    userAgent,
  );
  
  return user;
}
```

---

## الاستخدام في Service

```typescript
import { ConsentService } from '@/modules/auth/services/consent.service';
import { ConsentType } from '@/modules/auth/dto/consent.dto';

@Injectable()
export class MarketingService {
  constructor(private consentService: ConsentService) {}
  
  async sendMarketingEmail(userId: string) {
    // التحقق من موافقة التسويق
    const hasConsent = await this.consentService.checkConsent(
      userId,
      ConsentType.MARKETING,
    );
    
    if (!hasConsent) {
      throw new ForbiddenException('المستخدم لم يوافق على تلقي رسائل تسويقية');
    }
    
    // إرسال البريد...
  }
}
```

---

## التحقق من الحاجة لتحديث الموافقة

```typescript
// عند تحديث سياسة الخصوصية لنسخة جديدة
const needsUpdate = await consentService.needsConsentUpdate(
  userId,
  ConsentType.PRIVACY_POLICY,
  '2.0.0', // النسخة الجديدة
);

if (needsUpdate) {
  // إعادة توجيه المستخدم لصفحة الموافقة
  return {
    requiresConsent: true,
    consentType: ConsentType.PRIVACY_POLICY,
    version: '2.0.0',
  };
}
```

---

## GDPR Compliance - حق النسيان

```typescript
// حذف جميع موافقات المستخدم عند حذف الحساب
async deleteUserAccount(userId: string) {
  // حذف الموافقات
  await this.consentService.deleteAllUserConsents(userId);
  
  // حذف باقي بيانات المستخدم...
}
```

---

## معالجة الأخطاء

عند عدم وجود موافقة مطلوبة:

```json
{
  "statusCode": 403,
  "message": "يجب الموافقة على الشروط المطلوبة للمتابعة",
  "missingConsents": ["privacy_policy", "terms_of_service"],
  "code": "MISSING_CONSENTS"
}
```

الـ Frontend يمكنه التعامل مع هذا الخطأ:

```typescript
if (error.code === 'MISSING_CONSENTS') {
  // إعادة توجيه المستخدم لصفحة الموافقة
  router.push({
    name: 'consent',
    query: {
      required: error.missingConsents.join(','),
      redirect: currentRoute,
    },
  });
}
```

---

## Best Practices

1. **تسجيل الموافقات عند التسجيل**: دائماً سجّل الموافقات الإلزامية عند إنشاء حساب جديد

2. **تتبع النسخ**: احتفظ بنسخة السياسة/الشروط مع كل موافقة

3. **IP و User Agent**: سجّل هذه المعلومات لأغراض التدقيق

4. **Guards على المسارات الحساسة**: استخدم Guards للتحقق من الموافقات قبل الوصول للبيانات الحساسة

5. **UI واضح**: اعرض للمستخدم حالة موافقاته بشكل واضح في الإعدادات

6. **سهولة السحب**: يجب أن يكون سحب الموافقة سهلاً مثل منحها

---

## Indexes

تم إنشاء Indexes محسّنة للأداء:

```typescript
// البحث حسب المستخدم ونوع الموافقة
{ userId: 1, consentType: 1 }

// البحث عن آخر موافقة
{ userId: 1, consentDate: -1 }

// البحث عن الموافقات النشطة
{ userId: 1, consentType: 1, granted: 1, withdrawnAt: 1 }

// التدقيق حسب التاريخ
{ createdAt: -1 }
```

---

## Audit Trail

كل موافقة تحتوي على:
- ✅ User ID
- ✅ نوع الموافقة
- ✅ حالة الموافقة (granted/withdrawn)
- ✅ نسخة السياسة
- ✅ تاريخ الموافقة
- ✅ IP Address
- ✅ User Agent
- ✅ تاريخ السحب (إن وُجد)
- ✅ ملاحظات إضافية

هذا يضمن Audit Trail كامل لأغراض Compliance والتدقيق القانوني.

