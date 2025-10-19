# CI Workflows

## proof-guards.yml

**الهدف (Purpose)**: التحقق من عدم وجود API calls يتيمة في الـ Frontend والتأكد من استخدام Typed Clients فقط.

### ماذا يفعل (What it does)

1. **فحص الأيتام (FE Orphans Check)**
   - يستخرج جميع استدعاءات الـ API من Frontend projects
   - يقارنها مع Backend routes و OpenAPI contracts
   - ينتج `artifacts/fe_orphans.csv` (يجب أن يكون فارغاً = 0 صفوف)
   - يفشل إذا وُجدت API calls غير موثقة

2. **فحص Raw fetch/axios**
   - يبحث عن استخدامات `fetch()` و `axios.` خارج الـ wrappers المسموحة
   - الـ Wrappers المسموحة: `axiosInstance`, `apiClient`, `httpClient`, `typedClient`
   - ينتج `artifacts/grep_raw_fetch.txt` (يجب أن يكون فارغاً)
   - يفشل إذا وُجد استخدام مباشر لـ fetch/axios

3. **تقرير Typed Clients**
   - يحلل استخدام Typed Clients في جميع مشاريع الـ Frontend
   - يعد الاستخدامات لكل wrapper
   - ينتج `artifacts/typed_clients_report.json`
   - يحدد مستوى الامتثال (Compliance)

### البيانات المخرجة (Artifacts)

الملفات المولدة في `artifacts/`:

- ✅ `fe_orphans.csv` - قائمة الـ API calls اليتيمة (يجب أن تكون فارغة)
- ✅ `grep_raw_fetch.txt` - استخدامات fetch/axios المباشرة (يجب أن تكون فارغة)
- ✅ `typed_clients_report.json` - تقرير شامل عن استخدام Typed Clients
- 📋 `fe_calls_*.csv` - جميع استدعاءات الـ API المستخرجة من كل مشروع
- 📋 `route_inventory_backend.csv` - جرد مسارات الـ Backend
- 📋 `openapi_contracts.csv` - عقود OpenAPI المستخرجة

### شروط النجاح (Success Criteria)

✅ الـ Workflow ينجح فقط إذا:

1. `fe_orphans.csv` يحتوي على 0 صفوف (بعد استثناء الـ header)
2. `grep_raw_fetch.txt` فارغ تماماً
3. تقرير Typed Clients يُظهر `compliance: "✅ COMPLIANT"`

❌ الـ Workflow يفشل إذا:

1. وُجدت API calls يتيمة (غير موثقة في Backend)
2. وُجد استخدام مباشر لـ `fetch()` أو `axios.` خارج wrappers
3. فشل توليد أي من التقارير المطلوبة

### تشغيل يدوي (Manual Run)

```bash
# 1. استخراج Backend routes
cd backend-nest
npx ts-node scripts/extract-routes.ts

# 2. استخراج OpenAPI contracts
npx ts-node scripts/extract-openapi.ts

# 3. استخراج FE calls
cd ../admin-dashboard
npx ts-node ../scripts/extract-fe-calls.ts src > ../artifacts/fe_calls_admin.csv

cd ../bthwani-web
npx ts-node ../scripts/extract-fe-calls.ts src > ../artifacts/fe_calls_web.csv

cd ../app-user
npx ts-node ../scripts/extract-fe-calls.ts src > ../artifacts/fe_calls_app.csv

# 4. فحص الأيتام
cd ..
node scripts/check-fe-orphans.js

# 5. فحص raw fetch/axios
bash scripts/block_raw_fetch.sh

# 6. توليد تقرير Typed Clients
node scripts/generate-typed-clients-report.js
```

### الصيانة (Maintenance)

عند إضافة wrapper جديد:

1. أضفه إلى `scripts/block_raw_fetch.sh` في متغير `ALLOW`
2. أضفه إلى `scripts/generate-typed-clients-report.js` في array `allowedWrappers`
3. حدّث هذا التوثيق

### الفوائد (Benefits)

- 🔒 **Type Safety**: كل API calls مطبوعة (typed) ومعرّفة
- 📝 **Documentation**: لا توجد endpoints غير موثقة
- 🛡️ **Consistency**: استخدام موحّد لـ API clients
- 🐛 **Early Detection**: كشف المشاكل قبل الـ production
- ✅ **Contract Testing**: تطابق بين Frontend و Backend


