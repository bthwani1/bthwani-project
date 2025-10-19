# Proof Guards - FE Orphans & Typed Clients

## نظرة عامة (Overview)

نظام شامل للتحقق من:
1. **عدم وجود API calls يتيمة** - كل استدعاء في الـ Frontend له endpoint موثق في الـ Backend
2. **استخدام Typed Clients فقط** - منع استخدام `fetch()` و `axios.` المباشر
3. **Contract Testing** - تطابق بين Frontend و Backend APIs

## المكونات (Components)

### 1. CI Workflow

**الموقع**: `.github/workflows/proof-guards.yml`

يتم تشغيله تلقائياً عند:
- Push إلى `main`, `master`, أو `develop`
- فتح Pull Request
- تشغيل يدوي من GitHub Actions

### 2. السكريبتات (Scripts)

#### Backend Scripts

- `backend-nest/scripts/extract-routes.ts` - استخراج مسارات NestJS
- `backend-nest/scripts/extract-openapi.ts` - استخراج عقود OpenAPI

#### Frontend Scripts

- `scripts/extract-fe-calls.ts` - استخراج استدعاءات الـ API من Frontend
- `scripts/check-fe-orphans.js` - فحص الأيتام
- `scripts/block_raw_fetch.sh` - منع fetch/axios المباشر
- `scripts/generate-typed-clients-report.js` - تقرير Typed Clients

#### Test Scripts

- `scripts/test-proof-guards-local.sh` - اختبار محلي (Linux/Mac)
- `scripts/test-proof-guards-local.bat` - اختبار محلي (Windows)

## التشغيل المحلي (Local Testing)

### Windows

```cmd
cd C:\Users\Administrator\Desktop\bthwani_git
scripts\test-proof-guards-local.bat
```

### Linux/Mac

```bash
cd /path/to/bthwani_git
chmod +x scripts/test-proof-guards-local.sh
./scripts/test-proof-guards-local.sh
```

### خطوة بخطوة (Step by Step)

```bash
# 1. استخراج Backend routes
cd backend-nest
npx ts-node scripts/extract-routes.ts

# 2. استخراج OpenAPI contracts
npx ts-node scripts/extract-openapi.ts

# 3. استخراج FE calls من كل مشروع
cd ..
npx ts-node scripts/extract-fe-calls.ts admin-dashboard/src > artifacts/fe_calls_admin.csv
npx ts-node scripts/extract-fe-calls.ts bthwani-web/src > artifacts/fe_calls_web.csv
npx ts-node scripts/extract-fe-calls.ts app-user/src > artifacts/fe_calls_app.csv

# 4. فحص الأيتام
node scripts/check-fe-orphans.js

# 5. فحص raw fetch/axios
bash scripts/block_raw_fetch.sh

# 6. توليد تقرير Typed Clients
node scripts/generate-typed-clients-report.js
```

## الـ Artifacts المولدة

بعد التشغيل، ستجد في مجلد `artifacts/`:

### ✅ ملفات الإثبات (Proof Files)

1. **`fe_orphans.csv`**
   - قائمة الـ API calls اليتيمة
   - **يجب أن تكون فارغة** (0 صفوف بعد الـ header)
   - Format: `method,path`

2. **`grep_raw_fetch.txt`**
   - استخدامات `fetch()` و `axios.` المباشرة
   - **يجب أن تكون فارغة**
   - Format: `file:line:code`

3. **`typed_clients_report.json`**
   - تقرير شامل عن استخدام Typed Clients
   - يحتوي على:
     - عدد الملفات الممسوحة
     - عدد استخدامات Typed Clients
     - عدد استخدامات fetch/axios المباشرة
     - تفصيل لكل مشروع
     - حالة الامتثال (Compliance)

### 📋 ملفات مساعدة (Helper Files)

4. **`route_inventory_backend.csv`** - جرد مسارات Backend
5. **`openapi_contracts.csv`** - عقود OpenAPI
6. **`fe_calls_*.csv`** - استدعاءات Frontend لكل مشروع

## شروط النجاح (Success Criteria)

الـ Workflow ينجح فقط عند تحقق الشروط التالية:

### ✅ شرط 1: لا أيتام

```bash
# fe_orphans.csv يجب أن يحتوي فقط على header
$ cat artifacts/fe_orphans.csv
method,path
# <-- فارغ، لا صفوف
```

### ✅ شرط 2: لا raw fetch/axios

```bash
# grep_raw_fetch.txt يجب أن يكون فارغاً تماماً
$ cat artifacts/grep_raw_fetch.txt
# <-- فارغ تماماً
```

### ✅ شرط 3: Typed Clients مستخدمة

```json
{
  "summary": {
    "totalTypedClientUsages": 150,
    "totalRawFetchUsages": 0,
    "totalRawAxiosUsages": 0,
    "compliance": "✅ COMPLIANT"
  }
}
```

## الـ Wrappers المسموحة (Allowed Wrappers)

يُسمح باستخدام:

1. **`axiosInstance`** - النسخة الموحدة من axios
2. **`apiClient`** - العميل العام للـ API
3. **`httpClient`** - عميل HTTP المطبوع
4. **`typedClient`** - العميل المطبوع
5. **`useAdminAPI`** - Hook للـ Admin API
6. **`useAdminQuery`** - Hook للاستعلامات
7. **`useAdminMutation`** - Hook للتعديلات

### ❌ ممنوع

```typescript
// ❌ استخدام مباشر
fetch('/api/users');
axios.get('/api/users');

// ✅ استخدام Typed Client
import axiosInstance from '@/api/axios-instance';
axiosInstance.get('/api/users');

// ✅ أو استخدام Hook
const { data } = useAdminQuery(endpoint);
```

## إضافة Wrapper جديد

إذا أردت إضافة wrapper جديد:

### 1. تحديث `block_raw_fetch.sh`

```bash
# في scripts/block_raw_fetch.sh
ALLOW='(httpClient|apiClient|typedClient|newWrapper)'
```

### 2. تحديث `generate-typed-clients-report.js`

```javascript
// في scripts/generate-typed-clients-report.js
const allowedWrappers = [
  'axiosInstance',
  'apiClient',
  'httpClient',
  'typedClient',
  'useAdminAPI',
  'useAdminQuery',
  'useAdminMutation',
  'newWrapper'  // أضف هنا
];
```

### 3. تحديث التوثيق

حدّث هذا الملف وملف `.github/workflows/README.md`

## استكشاف الأخطاء (Troubleshooting)

### المشكلة: وُجدت أيتام

```bash
❌ Found 5 orphan API calls!
method,path
GET,/api/unknown-endpoint
POST,/api/old-endpoint
```

**الحل**:
1. تحقق من أن الـ endpoint موجود في Backend
2. تحقق من أن الـ endpoint موثق بـ OpenAPI decorators
3. تحقق من تطابق الـ path (بما في ذلك params)

### المشكلة: raw fetch/axios detected

```bash
❌ Raw fetch/axios detected
admin-dashboard/src/api/old.ts:15:  const res = await fetch('/api/data');
```

**الحل**:
استبدل بـ typed client:

```typescript
// قبل
const res = await fetch('/api/data');

// بعد
import axiosInstance from '@/api/axios-instance';
const { data } = await axiosInstance.get('/api/data');
```

### المشكلة: Scripts fail with TypeScript errors

**الحل**:

```bash
# تأكد من تثبيت dependencies
cd backend-nest && npm install
cd ../admin-dashboard && npm install
cd ../bthwani-web && npm install

# أو استخدم ts-node-dev
npm install -g ts-node
```

## التكامل مع CI/CD

### GitHub Actions

الـ workflow يعمل تلقائياً. لعرض النتائج:

1. اذهب إلى **Actions** tab في GitHub
2. اختر **Proof Guards** workflow
3. شاهد النتائج والـ artifacts

### Download Artifacts

```bash
# من GitHub Actions UI
1. انقر على الـ workflow run
2. scroll للأسفل إلى "Artifacts"
3. حمّل "proof-guards-artifacts.zip"
```

## الفوائد (Benefits)

### 🔒 Type Safety
كل API call مطبوع (typed) ومحدد بوضوح

### 📝 Documentation
لا توجد endpoints غير موثقة أو منسية

### 🛡️ Consistency
استخدام موحّد لـ API clients في كل المشاريع

### 🐛 Early Detection
كشف المشاكل في CI قبل الوصول إلى Production

### ✅ Contract Testing
ضمان تطابق Frontend و Backend APIs

### 📊 Visibility
تقارير واضحة عن استخدام APIs

## الخطوات التالية (Next Steps)

1. ✅ شغّل الـ test محلياً: `scripts/test-proof-guards-local.bat`
2. ✅ افحص الـ artifacts المولدة
3. ✅ أصلح أي orphans أو raw usages
4. ✅ ادفع التغييرات إلى GitHub
5. ✅ راقب الـ CI workflow

## الصيانة (Maintenance)

### شهرياً (Monthly)

- راجع تقرير Typed Clients
- تحقق من إضافة wrappers جديدة
- حدّث التوثيق

### عند إضافة مشروع جديد

1. أضف extraction step في الـ workflow
2. أضف المشروع إلى `generate-typed-clients-report.js`
3. أضف FE calls file إلى `check-fe-orphans.js`

### عند تغيير Backend framework

1. حدّث `extract-routes.ts`
2. حدّث `extract-openapi.ts`
3. اختبر محلياً قبل الدفع

---

## المساعدة (Help)

إذا واجهت مشاكل:

1. شغّل `scripts/test-proof-guards-local.bat` محلياً
2. افحص `artifacts/*.csv` للتفاصيل
3. راجع هذا التوثيق
4. راجع `.github/workflows/README.md`

**تم بنجاح! 🎉**

