# Proof Guards - دليل البدء السريع

## 🎯 الهدف

**FE أيتام = 0** + **Typed Clients مدمجة** = **✅ CI Pass**

## ⚡ تشغيل سريع

### Windows (أنت هنا)

```cmd
cd C:\Users\Administrator\Desktop\bthwani_git
scripts\test-proof-guards-local.bat
```

## 📊 ما يحدث

1. يستخرج Backend routes و OpenAPI contracts
2. يستخرج جميع API calls من Frontend projects
3. يقارن ويجد الأيتام (orphans)
4. يبحث عن `fetch()` و `axios.` مباشرة
5. ينتج تقارير

## ✅ النجاح يعني

```
✅ artifacts/fe_orphans.csv = 0 rows
✅ artifacts/grep_raw_fetch.txt = empty
✅ typed_clients_report.json = COMPLIANT
```

## ❌ الفشل يعني

أحد الحالات التالية:
- وُجدت API calls غير موثقة في Backend
- وُجد استخدام مباشر لـ `fetch()` أو `axios.`
- لم يتم استخدام Typed Clients

## 🔧 إصلاح المشاكل

### وُجدت أيتام

```typescript
// ❌ المشكلة: endpoint غير موجود في backend
await axiosInstance.get('/api/unknown');

// ✅ الحل: أضف endpoint في Backend أو صحح المسار
await axiosInstance.get('/api/users'); // endpoint موجود
```

### raw fetch/axios

```typescript
// ❌ المشكلة
const res = await fetch('/api/users');
const data = await axios.get('/api/users');

// ✅ الحل
import axiosInstance from '@/api/axios-instance';
const { data } = await axiosInstance.get('/api/users');
```

## 📁 الملفات المهمة

```
.github/workflows/proof-guards.yml     # CI workflow
scripts/check-fe-orphans.js            # فحص الأيتام
scripts/block_raw_fetch.sh             # منع raw fetch/axios
scripts/generate-typed-clients-report.js  # تقرير Typed Clients
scripts/test-proof-guards-local.bat    # اختبار محلي (Windows)
artifacts/                             # المخرجات
  ├── fe_orphans.csv                   # ⚠️ يجب أن يكون فارغاً
  ├── grep_raw_fetch.txt               # ⚠️ يجب أن يكون فارغاً
  └── typed_clients_report.json        # 📊 التقرير
```

## 🚀 GitHub Actions

الـ workflow يشتغل تلقائياً على:
- Push إلى `main`, `master`, `develop`
- Pull Requests
- Manual trigger

## 📖 المزيد

راجع `PROOF_GUARDS_SETUP.md` للتفاصيل الكاملة.

---

**الآن شغّل**: `scripts\test-proof-guards-local.bat` 🎯

