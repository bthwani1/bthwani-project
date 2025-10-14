# هيكل المشروع المحدث

## 📁 الهيكل العام

```
Bthwani Project/
├── bthwani-backend-nest/        # ✅ الباك إند الجديد (NestJS)
├── bthwani-web/                 # ✅ تم التحديث
├── admin-dashboard/             # ✅ تم التحديث
├── bThwaniApp/                  # ✅ تم التحديث
├── vendor-app/                  # ✅ تم التحديث
├── rider-app/                   # ✅ تم التحديث
├── field-marketers/             # ✅ تم التحديث
└── docs/                        # التوثيق
```

---

## 🎯 الملفات المضافة في كل تطبيق

### bthwani-web (Web App)
```
bthwani-web/
├── src/
│   ├── types/
│   │   └── api.ts                    # ⭐ جديد - تعريفات API
│   ├── utils/
│   │   └── api-helpers.ts            # ⭐ جديد - دوال مساعدة
│   └── api/
│       ├── axios-instance.ts         # ✏️ محدث
│       └── user.ts                   # ✏️ محدث (نموذج)
└── API_MIGRATION_GUIDE.md            # ⭐ جديد - دليل الترحيل
```

### admin-dashboard (Admin Panel)
```
admin-dashboard/
├── src/
│   ├── types/
│   │   └── api.ts                    # ⭐ جديد
│   ├── utils/
│   │   ├── api-helpers.ts            # ⭐ جديد
│   │   └── axios.ts                  # ✏️ محدث
│   └── api/
│       └── [all API files]           # 📝 يحتاج تحديث
```

### bThwaniApp (Mobile App)
```
bThwaniApp/
├── src/
│   ├── types/
│   │   └── api.ts                    # ⭐ جديد
│   ├── utils/
│   │   └── api/
│   │       ├── apiHelpers.ts         # ⭐ جديد
│   │       └── axiosInstance.ts      # ✏️ محدث
│   └── api/
│       └── [all API files]           # 📝 يحتاج تحديث
```

### vendor-app (Vendor Mobile)
```
vendor-app/
├── src/
│   ├── types/
│   │   └── api.ts                    # ⭐ جديد
│   ├── utils/
│   │   └── apiHelpers.ts             # ⭐ جديد
│   └── api/
│       └── axiosInstance.ts          # ✏️ محدث
```

### rider-app (Driver Mobile)
```
rider-app/
├── src/
│   ├── types/
│   │   └── api.ts                    # ⭐ جديد
│   └── api/
│       └── axios.ts                  # ✏️ محدث
```

### field-marketers (Marketers Mobile)
```
field-marketers/
├── src/
│   ├── types/
│   │   └── api.ts                    # ⭐ جديد
│   └── api/
│       └── client.ts                 # ✏️ محدث
```

---

## 📋 ملفات التوثيق العامة

```
Bthwani Project/
├── BACKEND_INTEGRATION_SUMMARY.md   # ⭐ جديد - ملخص التحديثات
└── PROJECT_STRUCTURE_UPDATED.md     # ⭐ جديد - هذا الملف
```

---

## 🔍 محتوى الملفات الجديدة

### 1. `types/api.ts`
محتوى موحد في جميع التطبيقات:
- `ApiResponse<T>` - شكل الاستجابة الموحد
- `ApiError` - تفاصيل الخطأ
- `ApiMeta` - معلومات إضافية
- `PaginationMeta` - معلومات الصفحات
- `ErrorCode` enum - أكواد الأخطاء
- `ERROR_MESSAGES` - رسائل الأخطاء بالعربي
- دوال مساعدة للاستخراج

### 2. `utils/api-helpers.ts` (Web Apps)
دوال مساعدة للتعامل مع API:
- `extractApiData<T>()` - استخراج البيانات
- `extractApiArray<T>()` - استخراج مصفوفة
- `checkApiSuccess()` - التحقق من النجاح
- `apiGet<T>()` - wrapper للـ GET
- `apiMutate<T>()` - wrapper للـ POST/PUT/PATCH
- `apiDelete()` - wrapper للـ DELETE
- `apiGetArray<T>()` - wrapper للمصفوفات

### 3. Axios Instance Updates
جميع axios instances محدثة بـ:
- ✅ Request interceptor لإضافة token
- ✅ Response interceptor محسن
- ✅ طباعة تفاصيل الأخطاء في DEV mode
- ✅ معالجة userMessage من الباك إند
- ✅ timeout 10 ثوانٍ

---

## 🎨 أنماط الاستخدام

### Pattern 1: استخدام مباشر
```typescript
import type { ApiResponse } from "../types/api";

const response = await axiosInstance.get<ApiResponse<User>>("/users/me");
const apiResponse = response.data;

if (!apiResponse.success || !apiResponse.data) {
  throw new Error(apiResponse.error?.userMessage || "خطأ");
}

return apiResponse.data;
```

### Pattern 2: استخدام helpers
```typescript
import { extractApiData } from "../utils/api-helpers";
import type { ApiResponse } from "../types/api";

const response = await axiosInstance.get<ApiResponse<User>>("/users/me");
return extractApiData(response, "فشل تحميل المستخدم");
```

### Pattern 3: استخدام wrappers
```typescript
import { apiGet } from "../utils/api-helpers";
import type { ApiResponse } from "../types/api";

return apiGet(
  () => axiosInstance.get<ApiResponse<User>>("/users/me"),
  "فشل تحميل المستخدم"
);
```

---

## 📊 حالة التحديث

| التطبيق | Axios | Types | Helpers | API Files | الحالة |
|---------|-------|-------|---------|-----------|--------|
| bthwani-web | ✅ | ✅ | ✅ | ⚠️ (1/11) | جاهز للتحديث |
| admin-dashboard | ✅ | ✅ | ✅ | ⏳ | جاهز للتحديث |
| bThwaniApp | ✅ | ✅ | ✅ | ⏳ | جاهز للتحديث |
| vendor-app | ✅ | ✅ | ✅ | ⏳ | جاهز للتحديث |
| rider-app | ✅ | ✅ | - | ⏳ | جاهز للتحديث |
| field-marketers | ✅ | ✅ | - | ⏳ | جاهز للتحديث |

**ملاحظة:**
- ✅ = مكتمل
- ⚠️ = جزئي
- ⏳ = يحتاج تحديث
- \- = غير مطلوب

---

## 🚀 خطوات العمل القادمة

### المرحلة 1: تحديث API Files (جاري)
1. ✅ bthwani-web/src/api/user.ts - تم
2. ⏳ bthwani-web/src/api/delivery.ts
3. ⏳ bthwani-web/src/api/cart.ts
4. ⏳ bthwani-web/src/api/notifications.ts
5. ⏳ بقية ملفات الـ API

### المرحلة 2: تحديث باقي التطبيقات
1. ⏳ admin-dashboard API files
2. ⏳ bThwaniApp API files
3. ⏳ vendor-app API files
4. ⏳ rider-app API files
5. ⏳ field-marketers API files

### المرحلة 3: الاختبار
1. ⏳ Unit tests
2. ⏳ Integration tests
3. ⏳ E2E tests
4. ⏳ Manual testing

---

## 💡 نصائح للتحديث

### نصيحة 1: استخدم Find & Replace
ابحث عن:
```typescript
const response = await axiosInstance.get<User>
```
واستبدل بـ:
```typescript
const response = await axiosInstance.get<ApiResponse<User>>
```

### نصيحة 2: استخدم Helpers
بدلاً من كتابة نفس الكود كل مرة، استخدم:
```typescript
import { apiGet } from "../utils/api-helpers";
```

### نصيحة 3: التوافق العكسي
استخدم `extractDataLegacy` إذا كنت غير متأكد:
```typescript
import { extractDataLegacy } from "../utils/api-helpers";
const data = extractDataLegacy(response);
```

---

## 📞 المراجع

- [Axios Documentation](https://axios-http.com/)
- [TypeScript Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [NestJS Error Handling](https://docs.nestjs.com/exception-filters)
- Backend: `bthwani-backend-nest/src/common/`

---

## ✅ Checklist للمطورين

عند تحديث ملف API جديد:

- [ ] استيراد `ApiResponse` من `types/api`
- [ ] استيراد helper functions من `utils/api-helpers`
- [ ] تحديث type للـ axios request
- [ ] استخدام helper للاستخراج
- [ ] معالجة الأخطاء بشكل صحيح
- [ ] اختبار الطلب
- [ ] تحديث الـ types إذا لزم
- [ ] مراجعة الكود

---

**آخر تحديث**: $(date)
**الحالة**: ✅ البنية الأساسية مكتملة، جاهز لتحديث API files


