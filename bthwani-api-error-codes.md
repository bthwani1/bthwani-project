# bThwani API Error Codes Documentation

## نظرة عامة

توثيق شامل لأكواد الأخطاء المستخدمة في bThwani API مع أمثلة على الاستخدام والحلول المقترحة.

## أنواع الأخطاء الرئيسية

### أخطاء المصادقة (Authentication Errors)
- **AUTHENTICATION_REQUIRED** (401): يتطلب المورد مصادقة صالحة
- **INVALID_TOKEN** (401): التوكن المقدم غير صالح أو منتهي الصلاحية
- **EXPIRED_TOKEN** (401): انتهت صلاحية التوكن
- **INVALID_CREDENTIALS** (401): بيانات الدخول غير صحيحة
- **USER_NOT_FOUND** (401): المستخدم غير موجود في النظام
- **USER_INACTIVE** (401): حساب المستخدم غير نشط

### أخطاء الصلاحيات (Authorization Errors)
- **INSUFFICIENT_PERMISSIONS** (403): ليس لدى المستخدم صلاحيات كافية
- **ACCESS_DENIED** (403): الوصول محظور لهذا المورد
- **RESOURCE_NOT_OWNED** (403): المستخدم لا يملك هذا المورد

### أخطاء التحقق من البيانات (Validation Errors)
- **VALIDATION_FAILED** (400): البيانات المرسلة غير صالحة
- **REQUIRED_FIELD_MISSING** (400): حقل مطلوب مفقود
- **INVALID_FORMAT** (400): تنسيق البيانات غير صحيح
- **INVALID_EMAIL** (400): عنوان البريد الإلكتروني غير صالح
- **INVALID_PHONE** (400): رقم الهاتف غير صالح
- **INVALID_AMOUNT** (400): المبلغ المحدد غير صالح

### أخطاء الموارد (Resource Errors)
- **RESOURCE_NOT_FOUND** (404): المورد المطلوب غير موجود
- **RESOURCE_ALREADY_EXISTS** (409): المورد موجود بالفعل
- **RESOURCE_CONFLICT** (409): تعارض في البيانات
- **RESOURCE_LOCKED** (423): المورد مقفل ولا يمكن تعديله

### أخطاء الأعمال (Business Logic Errors)
- **INSUFFICIENT_BALANCE** (402): رصيد غير كافي لإتمام العملية
- **ORDER_NOT_CANCELLABLE** (422): الطلب لا يمكن إلغاؤه في الوقت الحالي
- **ORDER_ALREADY_DELIVERED** (422): الطلب مُسلم بالفعل
- **STORE_NOT_OPERATIONAL** (422): المتجر غير متاح حالياً
- **DRIVER_NOT_AVAILABLE** (422): السائق غير متاح حالياً
- **PAYMENT_FAILED** (402): فشل في عملية الدفع
- **PAYMENT_DECLINED** (402): تم رفض عملية الدفع

### أخطاء الخادم (Server Errors)
- **INTERNAL_SERVER_ERROR** (500): خطأ داخلي في الخادم
- **SERVICE_UNAVAILABLE** (503): الخدمة غير متاحة مؤقتاً
- **DATABASE_ERROR** (500): خطأ في قاعدة البيانات
- **EXTERNAL_SERVICE_ERROR** (502): خطأ في خدمة خارجية

## أمثلة على استخدام الأخطاء

### مثال 1: خطأ مصادقة
```json
{
  "error": {
    "code": "AUTHENTICATION_REQUIRED",
    "message": "Authentication required",
    "detail": {
      "reason": "No valid token provided",
      "suggestion": "Please provide a valid Bearer token in Authorization header"
    }
  }
}
```

### مثال 2: خطأ تحقق من البيانات
```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Validation failed",
    "detail": {
      "fields": {
        "email": [
          "Email is required",
          "Email format is invalid"
        ],
        "phone": [
          "Phone number must start with +966"
        ],
        "amount": [
          "Amount must be greater than 0",
          "Amount cannot exceed 10000"
        ]
      }
    }
  }
}
```

### مثال 3: خطأ مورد غير موجود
```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Order not found",
    "detail": {
      "resource_id": "60f1b2b3c4d5e6f7g8h9i0j1",
      "resource_type": "order",
      "suggestion": "Please check the order ID and try again"
    }
  }
}
```

### مثال 4: خطأ أعمال
```json
{
  "error": {
    "code": "INSUFFICIENT_BALANCE",
    "message": "Insufficient wallet balance",
    "detail": {
      "required_amount": 150.00,
      "current_balance": 50.00,
      "difference": 100.00,
      "suggestion": "Please top up your wallet and try again"
    }
  }
}
```

## رموز الحالة HTTP المستخدمة

| كود الحالة | الوصف | الأخطاء المرتبطة |
|-------------|--------|------------------|
| 400 | Bad Request | VALIDATION_FAILED, INVALID_FORMAT, REQUIRED_FIELD_MISSING |
| 401 | Unauthorized | AUTHENTICATION_REQUIRED, INVALID_TOKEN, EXPIRED_TOKEN |
| 402 | Payment Required | INSUFFICIENT_BALANCE, PAYMENT_FAILED, PAYMENT_DECLINED |
| 403 | Forbidden | INSUFFICIENT_PERMISSIONS, ACCESS_DENIED, RESOURCE_NOT_OWNED |
| 404 | Not Found | RESOURCE_NOT_FOUND |
| 409 | Conflict | RESOURCE_ALREADY_EXISTS, RESOURCE_CONFLICT |
| 422 | Unprocessable Entity | ORDER_NOT_CANCELLABLE, ORDER_ALREADY_DELIVERED, STORE_NOT_OPERATIONAL |
| 423 | Locked | RESOURCE_LOCKED |
| 500 | Internal Server Error | INTERNAL_SERVER_ERROR, DATABASE_ERROR |
| 502 | Bad Gateway | EXTERNAL_SERVICE_ERROR |
| 503 | Service Unavailable | SERVICE_UNAVAILABLE |

## نصائح للتعامل مع الأخطاء

### للمطورين (Frontend/Backend)
1. **دائماً تحقق من وجود خاصية `error` في الاستجابة**
2. **استخدم كود الخطأ (error.code) لتحديد نوع الخطأ بدلاً من الرسالة فقط**
3. **عرض رسالة الخطأ للمستخدم باللغة المناسبة**
4. **استخدم التفاصيل (error.detail) للحصول على معلومات إضافية**

### للمستخدمين النهائيين
1. **التحقق من صحة البيانات قبل الإرسال**
2. **التأكد من وجود رصيد كافي في المحفظة**
3. **التحقق من حالة الطلب قبل محاولة الإلغاء**
4. **التأكد من أن المتجر متاح قبل الطلب**

## تسجيل الأخطاء

جميع الأخطاء يتم تسجيلها في نظام التسجيل مع المعلومات التالية:
- وقت حدوث الخطأ
- معرف المستخدم (إن وجد)
- عنوان IP للطلب
- مسار الطلب (URL)
- كود الخطأ ورسالته
- تفاصيل إضافية حسب نوع الخطأ

## التحديثات والصيانة

هذا التوثيق يتم تحديثه مع كل إصدار جديد من API. للحصول على أحدث المعلومات، يرجى مراجعة:
- [Swagger Documentation](https://api.bthwani.com/api-docs)
- [API Changelog](https://docs.bthwani.com/changelog)

## الدعم الفني

للحصول على مساعدة إضافية أو الإبلاغ عن أخطاء، يرجى التواصل مع فريق التطوير:
- البريد الإلكتروني: dev@bthwani.com
- Slack: #api-support
- GitHub Issues: [bThwani API Issues](https://github.com/bthwani/api/issues)
