# S10-PUBLIC-API — PUBLIC-API

> Generated: 2025-10-22 18:33:08Z UTC


## النطاق
Segments: ABANDONED, ACCEPT, ADD, AKHDIMNI, ANALYTICS, API, ASSETS, ATTENDANCE, AUDIT-LOGS, BALANCE, BILLS, BY-STORES, CATALOG, CATEGORIES, CATEGORYID, COMBINED, CONSENT, COUNT, COUPONS, CREATE, DEACTIVATE, DEFAULT-ADDRESS, DELIVERY, DELIVERY-ADDRESS, DLQ, DOCUMENTS, DRIVER-ASSETS, DRIVER-PAYOUTS, DRIVER-SHIFTS, EMPLOYEES, ER, ERRANDS, EVENTS, EXPORT, FEATURES, FEE, FIELD, FINANCE, FIREBASE, FORGOT, HEALTH, HOLD, ITEMS, JOURNALS, LEADS, LEAVE-REQUESTS, LEGAL, LIST, MAAROUF, MARKETER, MARKETING, MEDIA, MERCHANT, MERCHANTS, MERGE, METRICS, MODULES, MY-ERRANDS, MY-ORDERS, NOTE, ONBOARDING, OPENING-BALANCE, ORDER, ORDERS-CQRS, ORDER_ID, PAGE, PARAM, PAY-BILL, PAYROLL, PIN, PRICING-STRATEGIES, PROMOTIONS, PUBLIC, Q, QUALITY, RELEASE, RESET, RIDES, SEARCH, SEGMENTS, SESSION_ID, SETTINGS, SHEIN, SHIFTS, SORT, STATUS, STEP, STORAGEKEY, STORES, SUBSCRIPTIONS, TOPUP, TRANSACTION, TRANSACTIONS, TRANSFER, TRANSFERS, TYPE, UTILITY, UTM_CAMPAIGN, UTM_CONTENT, UTM_MEDIUM, UTM_SOURCE, UTM_TERM, V1, V2, VERIFY-OTP, WALLET, WINDOW, WITHDRAW, WITHDRAWALS

## مؤشرات هذه الوحدة
- Total: **459**
- FE-only: **0**
- BE-only: **0**
- Both: **0**
- Duplicates: **0**

## أهم الفجوات
- **FE-only:** نقص توصيل API أو استدعاءات قديمة.
- **BE-only:** مسارات مكشوفة دون مستهلك. مخاطرة سطوح هجوم + التزام عقود.
- **Duplicates:** تضارب سلوك/توثيق للمسارات المتشابهة.

## معالجة تفصيلية
1) FE-only → تنفيذ API أو ربط بمسار قائم أو حذف الاستدعاء.
2) BE-only → ربط UI/Client أو تعطيل/إخفاء أو توثيق OAS للاستهلاك غير البشري.
3) Duplicates → توحيد، Redirect، وتحديث المستهلكين.
4) اختبارات: تشغيل E2E على الرحلات الحرجة لهذه الوحدة.
5) قيود الأمن: CSP/CORS/HSTS، Idempotency حيث يلزم، JWT/TTL/MFA لمقاطع Auth/Admin.

## قوائم موجهة للعمل
### FE-only (أول 100)
- لا عناصر محصاة أو لم تُستورد الأعلام من CSV.

### BE-only (أول 100)
- لا عناصر محصاة أو لم تُستورد الأعلام من CSV.

### Duplicates (أول 100)
- لا عناصر محصاة أو لم تُستورد الأعلام من CSV.

## أوامر Cursor
```bash
# API contracts & uniqueness
npx spectral lint openapi/*.yaml --fail-severity=warn --format json > reports/openapi/spectral.json
node scripts/api/routes_uniqueness.ts

# FE budgets & headers
node scripts/fe/bundle_budget.js
bash scripts/headers/snapshot_stage.sh https://staging.example.tld
node scripts/headers/lint_csp_cors_hsts.js

# Aggregate gates & evaluate
node scripts/ci/aggregate_gates.js > reports/gates/aggregate.json
opa eval -i reports/gate_input.json -d policy/opa/release_gate.rego "data.gate.allow"
```
### معايير القبول (DoD)
- جميع الـGates المعنية **PASS** تحت `reports/gates/**`، وملف `reports/gate_input.json` يمر سياسة OPA.
- لا عناصر [TBD]، لا استثناءات منتهية الصلاحية.
- تم تحديث OAS/Runbooks/Policies وارتباطها بالـPR.
