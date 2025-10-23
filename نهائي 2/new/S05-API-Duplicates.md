# S05 — تكرارات API — التوحيد ومنع التضارب

> Generated: 2025-10-22 18:22:24Z UTC


## المشكلة
تعدد METHOD+PATH لنفس المعنى سبّب تضارباً وصعوبة صيانة.

### أمثلة (من الملخّص)
- `GET /DASHBOARD/ALERTS`
- `GET /DASHBOARD/SUMMARY`
- `GET /DASHBOARD/TIMESERIES`
- `GET /DASHBOARD/TOP`
- `GET /ME`
- `POST /DRIVERS`
- `GET /VENDORS`
- `GET /USERS/LIST`
- `GET /SUPPORT/STATS`
- `POST /SUPPORT/TICKETS`
- `POST /VENDORS`
- `GET /ACCOUNTS/CHART`
- `GET /JOURNAL-ENTRIES`
- `POST /JOURNAL-ENTRIES`
- `GET /PARTNERS`
- `GET /DASHBOARD/SUPPORT-TICKETS`
- `GET /DRIVERS/WITHDRAWALS/MY`
- `POST /DRIVERS/WITHDRAWALS/REQUEST`
- `POST /REFUND`
- `GET /`
- `POST /ONBOARDING-SLIDES`
- `PUT /ONBOARDING-SLIDES/{PARAM}`
- `DELETE /ONBOARDING-SLIDES/{PARAM}`
- `PUT /PAGES/{PARAM}`
- `DELETE /PAGES/{PARAM}`
- `POST /STRINGS`
- `PUT /STRINGS/{PARAM}`
- `DELETE /STRINGS/{PARAM}`
- `POST /HOME-LAYOUTS`
- `PUT /HOME-LAYOUTS/{PARAM}`


### قائمة كاملة من CSV (إن وُجدت)
- [TBD]


## المعالجة
- اعتماد endpoint قياسي وإزالة/إعادة توجيه الباقي.
- إضافة قاعدة Spectral path-keys-unique.

## أوامر
```bash
node scripts/api/routes_uniqueness.ts
node scripts/ci/aggregate_gates.js > reports/gates/aggregate.json
```

### معايير القبول (DoD)
- كل الحُرّاس تحت `reports/gates/**` = **PASS**.
- لا عناصر [TBD] مفتوحة. الاستثناءات ضمن صلاحية زمنية ومُوثّقة.
- تحديث OAS/Runbooks/Policies متزامن مع التغييرات.

