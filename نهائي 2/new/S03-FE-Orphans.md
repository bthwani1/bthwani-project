# S03 — FE-only Orphans — تشخيص وعلاج

> Generated: 2025-10-22 18:22:24Z UTC


## المشكلة
نداءات FE بلا مقابل BE موثّق أو منشور.

## الأدلة
- قائمة كاملة من parity_details.csv + عيّنات من parity_summary.md.

### أمثلة (من الملخّص)
- `DELETE /AUTH/DELETE-ACCOUNT`
- `DELETE /DELIVERY/CART`
- `DELETE /DRIVER`
- `DELETE /ER/DOCUMENTS/BULK`
- `DELETE /USER`
- `DELETE /USERS/ME`
- `DELETE /VENDOR`
- `GET /ACCEPT`
- `GET /ADMIN/AMANI`
- `GET /ADMIN/ARABON`
- `GET /ADMIN/AUDIT-LOGS/MY-ACTIONS`
- `GET /ADMIN/AUDIT-LOGS/STATS`
- `GET /ADMIN/DASHBOARD/ALERTS`
- `GET /ADMIN/DASHBOARD/SUMMARY`
- `GET /ADMIN/DASHBOARD/SUPPORT-TICKETS`
- `GET /ADMIN/DASHBOARD/TIMESERIES`
- `GET /ADMIN/DASHBOARD/TOP`
- `GET /ADMIN/DRIVER-ASSETS`
- `GET /ADMIN/DRIVER-PAYOUTS`
- `GET /ADMIN/DRIVER-SHIFTS`
- `GET /ADMIN/DRIVERS/ATTENDANCE`
- `GET /ADMIN/DRIVERS/DOCS`
- `GET /ADMIN/DRIVERS/DOCS/EXPIRING`
- `GET /ADMIN/DRIVERS/FINANCE`
- `GET /ADMIN/DRIVERS/VACATIONS/STATS`
- `GET /ADMIN/ES3AFNI`
- `GET /ADMIN/KAWADER`
- `GET /ADMIN/KAWADER/STATS/OVERVIEW`
- `GET /ADMIN/KENZ`
- `GET /ADMIN/KENZ/STATS/OVERVIEW`


### قائمة كاملة من CSV (إن وُجدت)
- [TBD]


## المعالجة
- قرار لكل عنصر: Implement API / Reuse existing / Remove.
- فتح PRs صغيرة حسب السطح.

## أوامر
```bash
node scripts/api/oas_parity_diff.js || true
node scripts/ci/aggregate_gates.js > reports/gates/aggregate.json
```

### معايير القبول (DoD)
- كل الحُرّاس تحت `reports/gates/**` = **PASS**.
- لا عناصر [TBD] مفتوحة. الاستثناءات ضمن صلاحية زمنية ومُوثّقة.
- تحديث OAS/Runbooks/Policies متزامن مع التغييرات.

