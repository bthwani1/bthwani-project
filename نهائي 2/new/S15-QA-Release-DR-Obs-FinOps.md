# S15 — QA والتشغيل والإصدار والتعافي والتمويل التشغيلي

> Generated: 2025-10-22 18:22:24Z UTC


## الأهداف
- تغطية ≥80% للمسارات الحرجة، إزالة flake
- OPA allow=true قبل النشر + كاناري تحت مراقبة SLO
- Rollback مُختبر ≤30d، DR Drill ≤90d، Burn-rate Freeze
- مراقبة FinOps: CPV Δ ≤10%، CDN hit ≥95%

## أوامر
```bash
node scripts/qa/coverage_gate.js
python3 scripts/qa/flake_guard.py
node scripts/ci/aggregate_gates.js > reports/gates/aggregate.json
opa eval -i reports/gate_input.json -d policy/opa/release_gate.rego "data.gate.allow"
python3 scripts/release/rollback_freshness.py
python3 scripts/obs/alert_runbook_link.py
python3 scripts/obs/burn_rate_freeze.py
```

### معايير القبول (DoD)
- كل الحُرّاس تحت `reports/gates/**` = **PASS**.
- لا عناصر [TBD] مفتوحة. الاستثناءات ضمن صلاحية زمنية ومُوثّقة.
- تحديث OAS/Runbooks/Policies متزامن مع التغييرات.
