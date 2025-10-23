# S04 — BE-only Orphans — توثيق وربط

> Generated: 2025-10-22 18:22:24Z UTC


## المشكلة
مسارات BE مكشوفة أو غير موثّقة بلا مستهلكين محددين.

### أمثلة (من الملخّص)
- `DELETE /`
- `DELETE /ACCOUNTS/CHART/{PARAM}`
- `DELETE /ADDRESS/{PARAM}`
- `DELETE /ADDRESSES/{PARAM}`
- `DELETE /ADMIN/DRIVERS/ASSETS/{PARAM}`
- `DELETE /ADMIN/DRIVERS/LEAVE-REQUESTS/{PARAM}`
- `DELETE /ADMIN/DRIVERS/SHIFTS/{PARAM}`
- `DELETE /ADMIN/DRIVERS/{PARAM}`
- `DELETE /ADMIN/STORES/{PARAM}`
- `DELETE /AMANI/{PARAM}`
- `DELETE /API/V2/SANAD/{PARAM}`
- `DELETE /ARABON/{PARAM}`
- `DELETE /ASSETS/{PARAM}`
- `DELETE /ATTRIBUTES/{PARAM}`
- `DELETE /CART/{PARAM}`
- `DELETE /CATEGORIES/{PARAM}`
- `DELETE /COMBINED/CLEAR-ALL`
- `DELETE /CONSENT/{PARAM}`
- `DELETE /CONTENT/ADMIN/FAQS/{PARAM}`
- `DELETE /CONTENT/BANNERS/{PARAM}`
- `DELETE /CONTENT/SECTIONS/{PARAM}`
- `DELETE /DEACTIVATE`
- `DELETE /DOCUMENTS/BULK`
- `DELETE /DOCUMENTS/{PARAM}`
- `DELETE /DRIVERS/ASSETS/{PARAM}`
- `DELETE /DRIVERS/LEAVE-REQUESTS/{PARAM}`
- `DELETE /DRIVERS/SHIFTS/{PARAM}`
- `DELETE /DRIVERS/{PARAM}`
- `DELETE /EMPLOYEES/{PARAM}`
- `DELETE /ES3AFNI/{PARAM}`


### قائمة كاملة من CSV (إن وُجدت)
- [TBD]


## المعالجة
- إلغاء تعريض endpoints غير المُستخدمة أو توثيقها في OAS.
- ربط مستهلك FE/Mobile عند الحاجة.

## أوامر
```bash
npx spectral lint openapi/*.yaml --fail-severity=warn --format json > reports/openapi/spectral.json
node scripts/api/routes_uniqueness.ts
```

### معايير القبول (DoD)
- كل الحُرّاس تحت `reports/gates/**` = **PASS**.
- لا عناصر [TBD] مفتوحة. الاستثناءات ضمن صلاحية زمنية ومُوثّقة.
- تحديث OAS/Runbooks/Policies متزامن مع التغييرات.

