# دليل توليد SDKs المتحد - نظام Bthwani

## نظرة عامة

تم توحيد نظام توليد SDKs ليكون `openapi.yaml` في الجذر هو المصدر الوحيد للحقيقة لجميع واجهات API. يتم توليد SDKs مكتوبة بـ TypeScript لجميع التطبيقات الأمامية تلقائياً.

## الملفات الرئيسية

### المصدر الوحيد للحقيقة
- `openapi.yaml` - مواصفات OpenAPI 3.0 (المصدر الرئيسي)
- `openapi.json` - نفس المواصفات بتنسيق JSON

### ملفات التكوين
- `openapitools.json` - إعدادات توليد SDKs لجميع التطبيقات
- `package.json` - scripts لإدارة التوليد

### scripts التوليد
- `scripts/generate-sdks.js` - السكريبت الرئيسي للتوليد
- `scripts/validate-sdks.js` - التحقق من سلامة الـ SDKs
- `scripts/clean-sdks.js` - تنظيف الـ SDKs المولدة

## التطبيقات المدعومة

| التطبيق | نوع العميل | المسار المولد |
|---------|------------|---------------|
| admin-dashboard | axios | `admin-dashboard/src/api/generated/` |
| bthwani-web | fetch | `bthwani-web/src/api/generated/` |
| app-user | axios | `app-user/src/api/generated/` |
| vendor-app | axios | `vendor-app/src/api/generated/` |
| rider-app | axios | `rider-app/src/api/generated/` |
| field-marketers | axios | `field-marketers/src/api/generated/` |

## الأوامر المتاحة

### التوليد الكامل
```bash
npm run generate:all
```
يولد مواصفات OpenAPI وجميع SDKs

### توليد SDKs فقط
```bash
npm run generate:sdks
```
يستخدم `openapi.yaml` الموجود لتوليد SDKs

### توليد OpenAPI فقط
```bash
npm run generate:openapi
```
يولد مواصفات OpenAPI من backend-nest

### توليد SDK محدد
```bash
npm run generate:sdk:admin     # لوحة الإدارة
npm run generate:sdk:web       # التطبيق الرئيسي
npm run generate:sdk:user      # تطبيق المستخدم
npm run generate:sdk:vendor    # تطبيق التاجر
npm run generate:sdk:rider     # تطبيق السائق
npm run generate:sdk:marketer  # تطبيق المسوق
```

### التحقق والتنظيف
```bash
npm run validate:sdks  # التحقق من سلامة SDKs
npm run clean:sdks     # حذف جميع SDKs المولدة
```

## كيفية الاستخدام في الكود

### استيراد API Client

```typescript
// استيراد من SDK المولد
import { AuthApi, UserApi, WalletApi } from './api/generated';

// إنشاء instance
const authApi = new AuthApi();
const userApi = new UserApi();
```

### استخدام مع Axios (للتطبيقات التي تستخدم axios)

```typescript
// إعداد base URL
const apiClient = new AuthApi();
apiClient.basePath = process.env.REACT_APP_API_URL;

// استخدام API
try {
  const response = await authApi.authControllerLogin(loginData);
  console.log('Login successful:', response.data);
} catch (error) {
  console.error('Login failed:', error);
}
```

### استخدام مع Fetch (للتطبيقات التي تستخدم fetch)

```typescript
// إعداد configuration
const config: RequestInit = {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
};

// استخدام API
const response = await UserApi.getUserById(userId, config);
```

## إعدادات OpenAPI Generator

### الخصائص المشتركة
- `typescriptThreePlus: true` - دعم TypeScript 3.0+
- `useSingleRequestParameter: true` - معامل واحد للطلبات
- `withInterfaces: true` - توليد interfaces

### أنواع العملاء
- **axios**: للتطبيقات التي تحتاج interceptors وإعدادات متقدمة
- **fetch**: للتطبيقات الحديثة التي تفضل Fetch API

## سير العمل الموصى به

### للمطورين الخلفيين (Backend Developers)
1. إضافة decorators و documentation للـ endpoints الجديدة
2. تشغيل `npm run generate:openapi` لإعادة توليد المواصفات
3. تشغيل `npm run generate:sdks` لتحديث جميع SDKs

### للمطورين الأماميين (Frontend Developers)
1. تشغيل `npm run generate:sdk:[app-name]` لتطبيقهم المحدد
2. مراجعة التغييرات في الـ types والـ APIs
3. تحديث الكود لاستخدام الـ types الجديدة

### في CI/CD
```yaml
# أضف هذه الخطوات في pipeline
- name: Generate OpenAPI
  run: npm run generate:openapi

- name: Generate SDKs
  run: npm run generate:sdks

- name: Validate SDKs
  run: npm run validate:sdks
```

## التحقق من الجودة

### فحوصات تلقائية
- وجود جميع الملفات المطلوبة (apis.ts, models.ts, index.ts)
- حجم الملفات المناسب
- عدم وجود أخطاء في التوليد

### فحوصات يدوية
- التأكد من أن الـ types تطابق backend models
- اختبار endpoints رئيسية
- التحقق من التوافق مع الإصدارات السابقة

## استكشاف الأخطاء

### مشاكل شائعة

#### 1. OpenAPI spec غير محدث
```bash
# الحل: إعادة توليد المواصفات
npm run generate:openapi
```

#### 2. SDKs مفقودة
```bash
# الحل: إعادة توليد جميع SDKs
npm run generate:sdks
```

#### 3. أخطاء في التحقق
```bash
# الحل: تنظيف وإعادة توليد
npm run clean:sdks && npm run generate:all
```

#### 4. تضارب في الـ dependencies
```bash
# الحل: التأكد من تثبيت openapi-generator-cli
npm install
```

## أفضل الممارسات

### للـ Backend
- استخدم `@ApiTags()`, `@ApiOperation()`, `@ApiResponse()` دائماً
- حدد أنواع البيانات بوضوح في DTOs
- أضف أمثلة للـ responses

### للـ Frontend
- استخدم الـ types المولدة في جميع API calls
- لا تعدل الملفات المولدة مباشرة
- استخدم interceptors للمعالجة المشتركة

### للـ DevOps
- شغل التوليد في كل push للـ main branch
- احفظ SDKs كـ artifacts
- أضف اختبارات للتحقق من عدم كسر التغييرات

## الدعم والمساعدة

### المراجع
- [OpenAPI Generator Documentation](https://openapi-generator.tech/)
- [NestJS Swagger Documentation](https://docs.nestjs.com/openapi/introduction)
- [TypeScript Axios Client](https://openapi-generator.tech/docs/generators/typescript-axios)

### الاتصال
- للأسئلة حول التوليد: فريق Backend
- للأسئلة حول الاستخدام: فريق Frontend المعني
- للمشاكل الفنية: إنشاء issue في repository

---

**تاريخ آخر تحديث:** أكتوبر 2025
**الإصدار:** 1.0.0
