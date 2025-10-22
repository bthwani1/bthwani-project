# 🚀 دليل تنفيذ المرحلة 2 - توحيد API

## 📋 نظرة عامة على المرحلة 2

**BTW-AUD-001: توحيد OpenAPI كمصدر وحيد للحقيقة**
- **المدة**: 4 أيام
- **الهدف**: ParityGap ≤ 5%
- **المعايير**: ContractTests = green

## 📅 الخطة اليومية

### اليوم 1-2: تطبيع مسارات OpenAPI والحالات/الأخطاء

#### ✅ المهام المكتملة:
- [x] فحص الوضع الحالي للـ OpenAPI
- [x] تحديد التكرارات المتبقية (7 تكرارات في الـ backend)
- [x] إنشاء سكريبت تطبيع OpenAPI

#### 🔄 المهام المطلوبة:

**1. حل التكرارات المتبقية:**
```bash
# التكرارات الحالية:
- DELETE /DELIVERY/CART/{PARAM} (2 occurrences)
- GET / (2 occurrences)
- GET /CATEGORIES (2 occurrences)
- GET /DRIVERS/AVAILABLE (2 occurrences)
- GET /LEGAL/PRIVACY-POLICY (2 occurrences)
- POST /ADMIN/REPORTS/EXPORT/{PARAM}/{PARAM} (2 occurrences)
- POST /EVENTS (2 occurrences)
```

**2. توحيد رموز الاستجابة:**
```typescript
// Standard response codes
const STANDARD_RESPONSES = {
  200: 'Success',
  201: 'Created',
  204: 'No Content',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
  422: 'Unprocessable Entity',
  500: 'Internal Server Error'
};
```

**3. توحيد أسماء المعاملات:**
```typescript
// Standard parameter names
const STANDARD_PARAMS = {
  id: 'id',
  userId: 'userId',
  page: 'page',
  limit: 'limit',
  cursor: 'cursor',
  sort: 'sort'
};
```

### اليوم 3: إنتاج clients مكتوبة بأنواع البيانات

#### 🛠️ خطوات التنفيذ:

**1. تحديث OpenAPI Generator:**
```bash
# في backend-nest/scripts/generate-typed-clients.sh
npx openapi-typescript-codegen --input reports/openapi.json \
  --output ../admin-dashboard/src/api/generated \
  --client axios \
  --useOptions \
  --useUnionTypes
```

**2. إنتاج clients لجميع التطبيقات:**
```bash
# Admin Dashboard
npx openapi-typescript-codegen --input reports/openapi.json \
  --output admin-dashboard/src/api/generated \
  --client axios

# Bthwani Web
npx openapi-typescript-codegen --input reports/openapi.json \
  --output bthwani-web/src/api/generated \
  --client fetch

# App User & Vendor App & Rider App
npx openapi-typescript-codegen --input reports/openapi.json \
  --output app-user/src/api/generated \
  --client axios
```

**3. إضافة Type Guards:**
```typescript
// في كل client generated
export function isApiError(error: unknown): error is ApiError {
  return typeof error === 'object' &&
         error !== null &&
         'status' in error &&
         'message' in error;
}
```

### اليوم 4: ربط الـ clients في FE/Apps وإضافة CI

#### 🔗 خطوات الربط:

**1. استبدال API calls الحالية:**
```typescript
// قبل (bthwani-web/src/api/auth.ts)
export async function login(credentials: LoginDto) {
  return axiosInstance.post('/auth/login', credentials);
}

// بعد (مع generated client)
import { AuthApi } from '../generated';

const authApi = new AuthApi();
export async function login(credentials: LoginDto) {
  return authApi.authLoginPost(credentials);
}
```

**2. إضافة Error Handling:**
```typescript
// في كل API wrapper
export async function apiCall<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (isApiError(error)) {
      // Handle API errors
      throw new AppError(error.message, error.status);
    }
    throw error;
  }
}
```

**3. تحديث CI للاختبارات:**
```yaml
# في .github/workflows/ci.yml
- name: Run Contract Tests
  run: |
    npm run test:contract
    npm run test:e2e
```

## 📊 معايير القبول

### ✅ معايير النجاح:
- [ ] **ParityGap ≤ 5%** (من 23.87% إلى ≤5%)
- [ ] **duplicates_backend = 0** (حل جميع 7 التكرارات)
- [ ] **ContractTests = green** (جميع الاختبارات تمر)
- [ ] **Generated Clients** موجودة في جميع التطبيقات
- [ ] **Type Safety** مُطبقة في جميع API calls

### 📈 مقاييس التحسن:
| المقياس | الحالي | الهدف | التحسن |
|---------|--------|-------|---------|
| Parity Gap | 23.87% | ≤5% | ↓18.87% |
| Backend Duplicates | 7 | 0 | ↓7 |
| API Consistency | 15.72% | ≥95% | ↑79.28% |

## 🎯 خطة التنفيذ التفصيلية

### المرحلة 2.1: حل التكرارات (يوم 1)
1. **تحليل كل تكرار** وتحديد المصدر
2. **اختيار controller رئيسي** لكل مجموعة
3. **نقل endpoints** وإضافة redirects إذا لزم
4. **تحديث التوثيق**

### المرحلة 2.2: تطبيع OpenAPI (يوم 2)
1. **تشغيل سكريبت التطبيع**
2. **مراجعة النتائج** وإصلاح أي مشاكل
3. **التأكد من consistency** في الاستجابات
4. **تحديث المخططات**

### المرحلة 2.3: إنتاج Clients (يوم 3)
1. **تحديث OpenAPI generator**
2. **إنتاج clients** لجميع التطبيقات
3. **إضافة error handling**
4. **اختبار الإنتاج**

### المرحلة 2.4: الربط والاختبار (يوم 4)
1. **ربط clients** في التطبيقات
2. **تحديث API calls** تدريجياً
3. **إضافة CI للاختبارات**
4. **التحقق من التوافق**

## 🚨 المخاطر والحلول

### خطر 1: Breaking Changes
**الحل:** استخدام feature flags للانتقال التدريجي

### خطر 2: Type Conflicts
**الحل:** مراجعة types يدوياً قبل الدمج

### خطر 3: Performance Impact
**الحل:** اختبار الأداء بعد كل تغيير كبير

## 📞 نقاط الاتصال

- **قائد المرحلة**: Backend Lead
- **Frontend Team**: FE Lead
- **DevOps**: CI/CD Specialist
- **QA**: Testing Lead

---

**تاريخ الإنشاء**: $(date)
**الحالة**: جاهز للتنفيذ
**الأولوية**: P0 - Critical
