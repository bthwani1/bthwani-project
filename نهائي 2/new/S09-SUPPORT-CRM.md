# S09-SUPPORT-CRM — SUPPORT-CRM

> Generated: 2025-10-22 18:33:08Z UTC


## النطاق
Segments: SUPPORT

## مؤشرات هذه الوحدة
- Total: **11**
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
