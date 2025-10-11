# 📚 API Documentation

## نظرة عامة

هذا المجلد يحتوي على توثيق شامل لـ API نظام Bthwani، بما في ذلك:

- **Postman Collection**: مجموعة طلبات API جاهزة للاختبار
- **مخطط علاقات البيانات**: رسوم بيانية توضح علاقات قاعدة البيانات
- **أدوات التصدير**: سكريبتات لتصدير التوثيق الآلي

## 📁 هيكل المجلد

```
docs/api/
├── postman_collection.json      # مجموعة طلبات Postman
├── data-map.mermaid.md         # مخطط علاقات البيانات
├── exports/                    # مجلد التصدير الآلي
│   ├── swagger.json           # مواصفات OpenAPI (اختياري)
│   ├── postman_collection.json # نسخة من المجموعة
│   ├── collection-summary.json # ملخص المجموعة
│   ├── data-relationships.mermaid.md # نسخة من مخطط البيانات
│   ├── schema-overview.json   # نظرة عامة على البيانات
│   └── README.md              # دليل استخدام التصدير
└── README.md                  # هذا الملف
```

## 🚀 البدء السريع

### 1. اختبار API باستخدام Postman

1. **تحميل Postman** من [getpostman.com](https://www.getpostman.com/downloads/)
2. **استيراد المجموعة**:
   - افتح Postman
   - اذهب إلى File → Import
   - اختر `Backend/docs/api/postman_collection.json`
3. **إعداد البيئة**:
   - في Postman، اذهب إلى Environments
   - أنشئ بيئة جديدة باسم "Bthwani API"
   - أضف المتغيرات التالية:
     ```
     baseUrl = http://localhost:3000
     accessToken = (اتركه فارغًا للآن)
     refreshToken = (اتركه فارغًا للآن)
     userId = (اتركه فارغًا للآن)
     ```

### 2. تشغيل الخادم محليًا

```bash
# في مجلد Backend
npm run dev
```

### 3. اختبار المصادقة

1. اذهب إلى مجلد "Authentication" في Postman
2. شغّل طلب "Register" لإنشاء حساب اختبار
3. شغّل طلب "Login" للحصول على tokens
4. استخدم الـ accessToken في الطلبات التالية

## 📋 مجموعة API المتاحة

### 🛡️ المصادقة (Authentication)
- `POST /api/v1/auth/login` - تسجيل الدخول
- `POST /api/v1/auth/register` - إنشاء حساب جديد
- `POST /api/v1/auth/refresh` - تجديد التوكن
- `POST /api/v1/auth/logout` - تسجيل الخروج

### 📦 الطلبات (Orders)
- `POST /api/v1/delivery/order` - إنشاء طلب جديد
- `GET /api/v1/delivery/order` - قائمة الطلبات (مع فلترة)
- `GET /api/v1/delivery/order/{id}` - تفاصيل طلب محدد
- `PATCH /api/v1/delivery/order/{id}/status` - تحديث حالة الطلب

### 💰 المحفظة (Wallet)
- `GET /api/v1/wallet/balance` - عرض رصيد المحفظة
- `POST /api/v1/wallet/topup` - شحن المحفظة
- `POST /api/v1/wallet/withdrawal` - طلب سحب

### 🏪 المتاجر (Vendors & Stores)
- `GET /api/v1/delivery/stores/search` - البحث في المتاجر
- `GET /api/v1/delivery/stores/{id}` - تفاصيل متجر محدد
- `GET /api/v1/delivery/stores/{id}/products` - منتجات المتجر

### 🚗 السائقين (Drivers)
- `GET /api/v1/admin/drivers` - قائمة السائقين
- `POST /api/v1/admin/drivers/assign` - تعيين سائق للطلب
- `GET /api/v1/admin/drivers/{id}/performance` - أداء السائق

### 📊 المحاسبة (Accounting)
- `GET /api/v1/er/chart-accounts` - دليل الحسابات
- `POST /api/v1/er/journal-entries` - إنشاء قيد محاسبي
- `GET /api/v1/er/journal-entries` - قائمة القيود
- `GET /api/v1/er/reports/financial` - التقارير المالية

### ⚙️ لوحة الإدارة (Admin Dashboard)
- `GET /api/v1/admin/dashboard/overview` - نظرة عامة على النظام
- `GET /api/v1/admin/settings` - إعدادات النظام
- `PATCH /api/v1/admin/settings` - تحديث الإعدادات

## 🗺️ فهم علاقات البيانات

### مخطط قاعدة البيانات

افتح `data-map.mermaid.md` في محرر يدعم Mermaid أو استخدم:
- [Mermaid Live Editor](https://mermaid.live/)
- [GitHub](https://github.com) (يدعم Mermaid تلقائيًا)

### الكيانات الرئيسية

#### 👤 المستخدمين (Users)
- **User**: بيانات المستخدمين الأساسية
- **Wallet**: محافظ المستخدمين المالية
- **Address**: عناوين المستخدمين
- **Favorite**: المنتجات المفضلة

#### 📦 الطلبات (Orders)
- **Order**: الطلبات الرئيسية
- **OrderItem**: عناصر الطلبات
- **OrderStatus**: سجل حالات الطلبات

#### 🏪 المتاجر (Stores)
- **DeliveryStore**: المتاجر والمطاعم
- **DeliveryProduct**: منتجات التوصيل
- **Category**: فئات المنتجات

#### 🚗 السائقين (Drivers)
- **Driver**: بيانات السائقين
- **DriverLocation**: مواقع السائقين
- **DriverShift**: ورديات السائقين

#### 💰 المحاسبة (Accounting)
- **ChartAccount**: دليل الحسابات
- **JournalEntry**: قيود اليومية
- **LedgerEntry**: سجلات الأستاذ

## 🧪 اختبار API

### تشغيل الاختبارات على البيئات المختلفة

#### البيئة المحلية (Local)
```bash
# تشغيل الخادم محليًا
cd Backend
npm run dev

# في Postman، استخدم:
baseUrl = http://localhost:3000
```

#### البيئة التجريبية (Staging)
```bash
# في Postman، استخدم:
baseUrl = https://bthwani-backend-staging.onrender.com
```

#### البيئة الإنتاجية (Production)
```bash
# في Postman، استخدم:
baseUrl = https://api.yourdomain.com
```

### الحصول على توكن المصادقة

1. شغّل طلب "Register" لإنشاء حساب اختبار
2. شغّل طلب "Login" للحصول على التوكن
3. انسخ `accessToken` من الرد
4. أضف التوكن إلى متغير البيئة في Postman

### اختبار مسار محمي

```bash
# مثال: جلب قائمة الطلبات
GET {{baseUrl}}/api/v1/delivery/order?user={{userId}}
Headers:
  Authorization: Bearer {{accessToken}}
```

## 📊 مراقبة الأداء

### استخدام Postman للمراقبة

1. شغّل مجموعة من الطلبات لقياس الأداء
2. استخدم Postman Console لمراقبة الطلبات
3. راقب أوقات الاستجابة والأخطاء

### مؤشرات الأداء المهمة

- **Response Time**: يجب أن يكون < 500ms للطلبات البسيطة
- **Status Codes**: يجب أن تكون 2xx للنجاح
- **Error Rates**: يجب أن تكون < 1% في الإنتاج

## 🔧 استكشاف الأخطاء

### أخطاء شائعة وحلولها

#### خطأ 401 Unauthorized
```
{
  "error": {
    "code": "INVALID_TOKEN",
    "message": "Invalid access token"
  }
}
```
**الحل**: تجديد التوكن باستخدام refresh token أو إعادة تسجيل الدخول

#### خطأ 404 Not Found
```
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested resource was not found"
  }
}
```
**الحل**: التحقق من صحة المسار ومعرف المورد

#### خطأ 422 Validation Error
```
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [...]
  }
}
```
**الحل**: التحقق من صحة البيانات المرسلة حسب API documentation

### تسجيل الأخطاء

جميع الأخطاء تُسجل في:
- **Console Logs**: في الخادم المحلي
- **Render Logs**: في البيئات السحابية
- **Sentry**: للأخطاء في الإنتاج

## 📝 إضافة مسارات جديدة

### خطوات إضافة مسار جديد إلى المجموعة

1. **إنشاء الـ Controller** في `Backend/src/controllers/`
2. **إضافة الـ Route** في `Backend/src/routes/`
3. **توثيق المسار** في Swagger
4. **إضافة الطلب** إلى Postman Collection
5. **تحديث مخطط البيانات** إذا لزم الأمر

### مثال إضافة مسار جديد

```javascript
// 1. في Controller
export const getUserProfile = async (req, res) => {
  // منطق الدالة
};

// 2. في Route
router.get('/profile', authMiddleware, getUserProfile);

// 3. في Postman Collection
{
  "name": "Get User Profile",
  "request": {
    "method": "GET",
    "url": "{{baseUrl}}/api/v1/users/profile",
    "header": [
      {
        "key": "Authorization",
        "value": "Bearer {{accessToken}}"
      }
    ]
  }
}
```

## 🔄 تصدير التوثيق الآلي

### تشغيل سكريبت التصدير

```bash
# تصدير جميع التوثيق
npm run docs:export

# النتيجة في مجلد docs/api/exports/
```

### ما يتم تصديره

- **swagger.json**: مواصفات OpenAPI إذا كان الخادم يعمل
- **postman_collection.json**: نسخة محدثة من المجموعة
- **collection-summary.json**: ملخص إحصائيات المجموعة
- **data-relationships.mermaid.md**: مخطط علاقات البيانات
- **schema-overview.json**: نظرة عامة على هيكل قاعدة البيانات

## 🛠️ أدوات مفيدة للتطوير

### اختبار API
- **Postman**: للاختبار اليدوي والآلي
- **Insomnia**: بديل مجاني لـ Postman
- **curl**: للاختبار من سطر الأوامر

### توثيق API
- **Swagger UI**: لتصفح API documentation
- **Redoc**: بديل لـ Swagger UI
- **Stoplight**: أدوات شاملة لتوثيق API

### مراقبة الأداء
- **Postman Monitors**: مراقبة API uptime
- **New Relic**: مراقبة شاملة للأداء
- **DataDog**: مراقبة البنية التحتية

## 📞 الدعم والمساعدة

### فريق التطوير
- **Backend Team**: [البريد الإلكتروني]
- **DevOps Team**: [البريد الإلكتروني]
- **Product Team**: [البريد الإلكتروني]

### موارد إضافية
- **API Guidelines**: [رابط الدليل]
- **Code Standards**: [رابط معايير الكود]
- **Security Best Practices**: [رابط ممارسات الأمان]

---

## 📅 تاريخ آخر تحديث
أكتوبر 2025

## 🔄 إصدار التوثيق
v1.0.0

---

*هذا التوثيق جزء من مشروع Bthwani ويُحدث بانتظام لضمان دقة المعلومات.*
