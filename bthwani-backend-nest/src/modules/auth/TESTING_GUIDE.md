# دليل اختبار نظام الموافقات

## 🧪 طرق الاختبار

### 1. اختبار عبر Swagger UI

#### الخطوات:
1. شغّل السيرفر: `npm run start:dev`
2. افتح Swagger: `http://localhost:3000/api`
3. سجّل دخول أو استخدم Firebase token
4. جرّب endpoints الموافقات:

```
POST   /auth/consent              # تسجيل موافقة
POST   /auth/consent/bulk         # تسجيل موافقات متعددة
GET    /auth/consent/summary      # ملخص الموافقات
GET    /auth/consent/history      # سجل الموافقات
GET    /auth/consent/check/:type  # التحقق من موافقة
DELETE /auth/consent/:type        # سحب موافقة
```

---

### 2. اختبار عبر Postman

#### الخطوات:
1. استورد `docs/CONSENT_POSTMAN_COLLECTION.json`
2. حدّث متغير `token` بـ Bearer token
3. حدّث `baseUrl` إذا لزم الأمر
4. شغّل الطلبات بالترتيب

#### Test Flow المقترح:
```
1. تسجيل موافقات متعددة (Bulk)
2. الحصول على ملخص
3. التحقق من موافقة محددة
4. سحب موافقة التسويق
5. الحصول على السجل الكامل
6. التحقق مرة أخرى
```

---

### 3. اختبار عبر cURL

#### A. تسجيل موافقة واحدة
```bash
curl -X POST http://localhost:3000/auth/consent \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "consentType": "privacy_policy",
    "granted": true,
    "version": "1.0.0",
    "notes": "موافقة على سياسة الخصوصية"
  }'
```

**Expected Response:**
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
    "ipAddress": "::1",
    "userAgent": "curl/..."
  }
}
```

---

#### B. تسجيل موافقات متعددة
```bash
curl -X POST http://localhost:3000/auth/consent/bulk \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

---

#### C. الحصول على ملخص
```bash
curl -X GET http://localhost:3000/auth/consent/summary \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
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
      "hasActiveConsent": false,
      "latestConsent": null
    }
  }
}
```

---

#### D. التحقق من موافقة محددة
```bash
curl -X GET http://localhost:3000/auth/consent/check/privacy_policy \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "consentType": "privacy_policy",
    "hasActiveConsent": true
  }
}
```

---

#### E. سحب موافقة
```bash
curl -X DELETE http://localhost:3000/auth/consent/marketing \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "لا أرغب في تلقي رسائل تسويقية"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "تم سحب الموافقة بنجاح",
  "data": {
    "_id": "...",
    "userId": "...",
    "consentType": "marketing",
    "granted": false,
    "withdrawnAt": "2025-10-14T...",
    "notes": "تم السحب: لا أرغب في تلقي رسائل تسويقية"
  }
}
```

---

#### F. الحصول على سجل الموافقات
```bash
curl -X GET "http://localhost:3000/auth/consent/history?type=privacy_policy" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "userId": "...",
      "consentType": "privacy_policy",
      "granted": true,
      "version": "1.0.0",
      "consentDate": "2025-10-14T...",
      "ipAddress": "::1",
      "userAgent": "...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "count": 1
}
```

---

### 4. اختبار Guards

#### Test Case 1: Endpoint محمي بموافقة واحدة
```typescript
// في controller
@Post('test-consent')
@UseGuards(UnifiedAuthGuard, PrivacyPolicyConsentGuard)
async testConsent() {
  return { message: 'Success! You have consent.' };
}
```

**Test Steps:**
1. احذف أو اسحب موافقة سياسة الخصوصية
2. جرّب الوصول للـ endpoint:
```bash
curl -X POST http://localhost:3000/test-consent \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Error:**
```json
{
  "statusCode": 403,
  "message": "يجب الموافقة على سياسة الخصوصية للمتابعة",
  "missingConsents": ["privacy_policy"],
  "code": "MISSING_PRIVACY_POLICY_CONSENT"
}
```

3. سجّل الموافقة
4. جرّب مرة أخرى - يجب أن ينجح

---

#### Test Case 2: Endpoint محمي بموافقات متعددة
```typescript
@Post('test-multiple-consents')
@UseGuards(UnifiedAuthGuard, ConsentGuard)
@RequireConsents(ConsentType.PRIVACY_POLICY, ConsentType.TERMS_OF_SERVICE)
async testMultiple() {
  return { message: 'Success! You have all consents.' };
}
```

**Test Steps:**
1. تأكد من عدم وجود الموافقات
2. جرّب الوصول - يجب أن يفشل
3. سجّل موافقة واحدة فقط
4. جرّب مرة أخرى - يجب أن يفشل
5. سجّل الموافقة الثانية
6. جرّب مرة أخرى - يجب أن ينجح

---

### 5. اختبار في Database

#### MongoDB Queries للتحقق:

```javascript
// عرض جميع الموافقات لمستخدم
db.user_consents.find({ userId: ObjectId("USER_ID") })

// عرض الموافقات النشطة فقط
db.user_consents.find({
  userId: ObjectId("USER_ID"),
  granted: true,
  withdrawnAt: null
})

// عرض الموافقات المسحوبة
db.user_consents.find({
  userId: ObjectId("USER_ID"),
  withdrawnAt: { $ne: null }
})

// عد الموافقات حسب النوع
db.user_consents.aggregate([
  { $match: { userId: ObjectId("USER_ID") } },
  { $group: { _id: "$consentType", count: { $sum: 1 } } }
])

// آخر موافقة لكل نوع
db.user_consents.aggregate([
  { $match: { userId: ObjectId("USER_ID") } },
  { $sort: { consentDate: -1 } },
  { $group: {
      _id: "$consentType",
      latest: { $first: "$$ROOT" }
    }
  }
])
```

---

### 6. Test Scenarios

#### Scenario 1: تدفق التسجيل الكامل
```
1. إنشاء مستخدم جديد
2. تسجيل موافقات إلزامية (Privacy + Terms)
3. التحقق من الموافقات
4. محاولة إنشاء طلب (يجب أن ينجح)
```

---

#### Scenario 2: تدفق سحب الموافقة
```
1. تسجيل موافقة تسويق
2. التحقق من الموافقة (نشطة)
3. سحب الموافقة
4. التحقق مرة أخرى (غير نشطة)
5. محاولة إرسال بريد تسويقي (يجب أن يفشل)
```

---

#### Scenario 3: تدفق تحديث النسخة
```
1. تسجيل موافقة على Privacy Policy v1.0.0
2. التحقق من الحاجة للتحديث (v1.0.0) → false
3. التحقق من الحاجة للتحديث (v2.0.0) → true
4. تسجيل موافقة جديدة على v2.0.0
5. التحقق من الحاجة للتحديث (v2.0.0) → false
```

---

#### Scenario 4: GDPR - حق النسيان
```
1. إنشاء مستخدم مع موافقات
2. التحقق من وجود البيانات
3. طلب حذف الحساب
4. تشغيل deleteAllUserConsents()
5. التحقق من حذف جميع الموافقات
```

---

### 7. Performance Testing

```bash
# اختبار تسجيل 100 موافقة
for i in {1..100}; do
  curl -X POST http://localhost:3000/auth/consent \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"consentType\": \"privacy_policy\",
      \"granted\": true,
      \"version\": \"1.0.$i\"
    }" &
done
wait

# قياس وقت الاستجابة
time curl -X GET http://localhost:3000/auth/consent/summary \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 8. Error Handling Testing

#### Test Cases:
1. ✅ موافقة بنوع غير صالح
2. ✅ موافقة بدون version
3. ✅ سحب موافقة غير موجودة
4. ✅ الوصول لـ endpoint محمي بدون موافقة
5. ✅ الوصول لـ endpoint محمي بدون token
6. ✅ موافقات متعددة مع خطأ في إحداها

---

## ✅ Checklist للاختبار

- [ ] تسجيل موافقة واحدة
- [ ] تسجيل موافقات متعددة
- [ ] التحقق من موافقة نشطة
- [ ] سحب موافقة
- [ ] الحصول على سجل الموافقات
- [ ] الحصول على ملخص الموافقات
- [ ] اختبار PrivacyPolicyConsentGuard
- [ ] اختبار TermsOfServiceConsentGuard
- [ ] اختبار ConsentGuard مع موافقات متعددة
- [ ] اختبار Error Handling
- [ ] اختبار تحديث النسخة
- [ ] اختبار GDPR deletion
- [ ] التحقق من Indexes في Database
- [ ] التحقق من IP و User Agent في السجل

---

## 📊 Expected Results

### Success Criteria:
- ✅ جميع endpoints تعمل بشكل صحيح
- ✅ Guards تمنع الوصول بدون موافقات
- ✅ IP و User Agent مسجّلة بشكل صحيح
- ✅ withdrawnAt يتم تحديثه عند السحب
- ✅ السجل الكامل محفوظ (Audit Trail)
- ✅ Performance جيد حتى مع بيانات كثيرة
- ✅ Error Messages واضحة ومفيدة
- ✅ لا أخطاء في Linter

---

## 🐛 Known Issues

لا توجد issues معروفة حالياً! 🎉

---

## 📝 Notes

- تأكد من تشغيل MongoDB قبل الاختبار
- استخدم `npm run start:dev` للـ hot reload
- راجع Logs في Console للتدقيق
- استخدم MongoDB Compass لمراجعة البيانات

