# 📋 User Consent - Quick Reference Card

## 🎯 أنواع الموافقات
```typescript
ConsentType.PRIVACY_POLICY      // سياسة الخصوصية
ConsentType.TERMS_OF_SERVICE    // شروط الخدمة
ConsentType.MARKETING           // التسويق
ConsentType.DATA_PROCESSING     // معالجة البيانات
```

---

## 🔧 Service Methods

### تسجيل
```typescript
// موافقة واحدة
await consentService.recordConsent(userId, consentDto, ip, userAgent);

// موافقات متعددة
await consentService.recordBulkConsents(userId, consentsArray, ip, userAgent);
```

### التحقق
```typescript
// موافقة واحدة
const hasConsent = await consentService.checkConsent(userId, ConsentType.PRIVACY_POLICY);

// موافقات متعددة
const results = await consentService.checkMultipleConsents(userId, [ConsentType.PRIVACY_POLICY, ConsentType.TERMS_OF_SERVICE]);
```

### السحب
```typescript
await consentService.withdrawConsent(userId, ConsentType.MARKETING, 'سبب السحب');
```

### الاستعلامات
```typescript
// سجل كامل
const history = await consentService.getConsentHistory(userId);

// سجل نوع محدد
const privacyHistory = await consentService.getConsentHistory(userId, ConsentType.PRIVACY_POLICY);

// آخر موافقة
const latest = await consentService.getLatestConsent(userId, ConsentType.PRIVACY_POLICY);

// ملخص شامل
const summary = await consentService.getConsentSummary(userId);
```

### GDPR
```typescript
// حذف كل الموافقات
await consentService.deleteAllUserConsents(userId);

// التحقق من الحاجة للتحديث
const needsUpdate = await consentService.needsConsentUpdate(userId, ConsentType.PRIVACY_POLICY, '2.0.0');
```

---

## 🛡️ Guards

### Guard عام
```typescript
@UseGuards(UnifiedAuthGuard, ConsentGuard)
@RequireConsents(ConsentType.PRIVACY_POLICY, ConsentType.TERMS_OF_SERVICE)
async protectedMethod() {}
```

### Guards محددة
```typescript
// سياسة الخصوصية
@UseGuards(PrivacyPolicyConsentGuard)

// شروط الخدمة
@UseGuards(TermsOfServiceConsentGuard)
```

---

## 📡 API Endpoints

| Method | Endpoint | الوصف |
|--------|----------|-------|
| POST | `/auth/consent` | تسجيل موافقة |
| POST | `/auth/consent/bulk` | تسجيل موافقات متعددة |
| DELETE | `/auth/consent/:type` | سحب موافقة |
| GET | `/auth/consent/history` | سجل الموافقات |
| GET | `/auth/consent/summary` | ملخص الموافقات |
| GET | `/auth/consent/check/:type` | التحقق من موافقة |

---

## 📦 DTOs

### ConsentDto
```typescript
{
  consentType: ConsentType;
  granted: boolean;
  version: string;
  notes?: string;
}
```

### BulkConsentDto
```typescript
{
  consents: ConsentDto[];
}
```

---

## 🔍 Database Query Examples

```javascript
// موافقات نشطة
db.user_consents.find({
  userId: ObjectId("..."),
  granted: true,
  withdrawnAt: null
})

// موافقات مسحوبة
db.user_consents.find({
  userId: ObjectId("..."),
  withdrawnAt: { $ne: null }
})

// آخر موافقة
db.user_consents.find({ userId: ObjectId("...") })
  .sort({ consentDate: -1 })
  .limit(1)
```

---

## ⚡ Common Patterns

### Pattern 1: Registration
```typescript
async register(userData, req) {
  const user = await this.createUser(userData);
  
  await this.consentService.recordBulkConsents(
    user._id,
    [
      { consentType: 'privacy_policy', granted: true, version: '1.0.0' },
      { consentType: 'terms_of_service', granted: true, version: '1.0.0' }
    ],
    req.ip,
    req.headers['user-agent']
  );
  
  return user;
}
```

### Pattern 2: Marketing Check
```typescript
async sendMarketing(userId) {
  if (!await this.consentService.checkConsent(userId, ConsentType.MARKETING)) {
    throw new ForbiddenException('No marketing consent');
  }
  // إرسال...
}
```

### Pattern 3: Version Update
```typescript
const needsUpdate = await this.consentService.needsConsentUpdate(
  userId,
  ConsentType.PRIVACY_POLICY,
  '2.0.0'
);

if (needsUpdate) {
  return { requiresConsent: true };
}
```

---

## 🔥 Quick Start

### 1. في AuthModule - **تم بالفعل ✅**
```typescript
imports: [
  MongooseModule.forFeature([
    { name: UserConsent.name, schema: UserConsentSchema }
  ])
],
providers: [ConsentService]
```

### 2. في Controller
```typescript
constructor(private consentService: ConsentService) {}

@Post('consent')
async grantConsent(@CurrentUser('id') userId, @Body() dto: ConsentDto, @Req() req) {
  return this.consentService.recordConsent(userId, dto, req.ip, req.headers['user-agent']);
}
```

### 3. استخدام Guard
```typescript
@UseGuards(ConsentGuard)
@RequireConsents(ConsentType.PRIVACY_POLICY)
async sensitiveData() {}
```

---

## ❌ Error Responses

### Missing Consent
```json
{
  "statusCode": 403,
  "message": "يجب الموافقة على الشروط المطلوبة للمتابعة",
  "missingConsents": ["privacy_policy"],
  "code": "MISSING_CONSENTS"
}
```

### Not Found
```json
{
  "statusCode": 404,
  "message": "لم يتم العثور على موافقة نشطة لسحبها"
}
```

---

## 📊 Indexes (مُنفّذة تلقائياً)
```typescript
{ userId: 1, consentType: 1 }
{ userId: 1, consentDate: -1 }
{ userId: 1, consentType: 1, granted: 1, withdrawnAt: 1 }
{ createdAt: -1 }
```

---

## ✅ Checklist للمطور

عند إضافة feature جديدة:
- [ ] هل تحتاج موافقات محددة؟
- [ ] أضف `@RequireConsents()` decorator
- [ ] أضف Guard المناسب
- [ ] وثّق الموافقات المطلوبة في API Docs
- [ ] اختبر بدون/مع الموافقات
- [ ] تأكد من رسائل الخطأ واضحة

---

## 📚 الملفات المهمة

| الملف | الوصف |
|------|-------|
| `entities/user-consent.entity.ts` | Schema |
| `services/consent.service.ts` | Business Logic |
| `dto/consent.dto.ts` | DTOs |
| `common/guards/consent.guard.ts` | Guards |
| `CONSENT_USAGE_GUIDE.md` | دليل مفصّل |
| `TESTING_GUIDE.md` | دليل الاختبار |
| `examples/consent-integration.example.ts` | أمثلة |

---

## 🚀 Commands

```bash
# تشغيل السيرفر
npm run start:dev

# فتح Swagger
open http://localhost:3000/api

# فحص Linter
npm run lint

# اختبار
npm run test
```

---

## 💡 Tips

1. **دائماً سجّل IP و User Agent** للتدقيق
2. **احفظ نسخة السياسة** مع كل موافقة
3. **استخدم Bulk Recording** للموافقات المتعددة
4. **راجع الموافقات** عند تحديث السياسات
5. **وفّر سهولة السحب** للمستخدمين
6. **Export البيانات** للامتثال لـ GDPR

---

## 🆘 Help

- **Swagger**: `http://localhost:3000/api`
- **Docs**: `src/modules/auth/CONSENT_USAGE_GUIDE.md`
- **Examples**: `src/modules/auth/examples/`
- **Postman**: `docs/CONSENT_POSTMAN_COLLECTION.json`

---

## 📞 Contact

للأسئلة أو المشاكل، راجع:
- `CONSENT_USAGE_GUIDE.md` للتفاصيل الكاملة
- `TESTING_GUIDE.md` لحالات الاختبار
- `examples/` للأمثلة العملية

---

**Made with ❤️ for GDPR Compliance**

