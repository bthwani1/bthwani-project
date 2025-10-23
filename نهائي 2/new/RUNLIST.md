# RUNLIST — أوامر تنفيذ متسلسلة في Cursor

> Generated: 2025-10-22 18:22:24Z UTC


1) Parity
```bash
node scripts/api/routes_uniqueness.ts
node scripts/ci/aggregate_gates.js > reports/gates/aggregate.json
```
2) Security/Identity/Headers/Egress
```bash
bash scripts/headers/snapshot_stage.sh https://staging.example.tld
node scripts/headers/lint_csp_cors_hsts.js
node scripts/sec/cookie_session_lint.js
python3 scripts/iam/mfa_coverage.py
python3 scripts/sec/egress_allowlist_guard.py
```
3) Perf/A11y/i18n
```bash
npx lhci autorun --config=perf/lhci.json
npx pa11y-ci --config perf/pa11y.json --json > reports/a11y/pa11y.json
ts-node scripts/fe/i18n_coverage.ts
node scripts/fe/bundle_budget.js
node scripts/fe/cache_control_guard.js
```
4) Payments/Notifications
```bash
python3 scripts/fin/recon_variance.py evidence/fin/recon_today.csv 0.001
node scripts/api/webhook_replay_guard.js
node scripts/fe/cookie_consent_gate.js || true
```
5) Data/Privacy
```bash
python3 scripts/data/validate_event_schemas.py
python3 scripts/privacy/pii_logs_scan.py
```
6) Infra/Supply/Licenses
```bash
python3 scripts/infra/netpol_coverage.py
checkov -d infra/ -o json > reports/infra/checkov.json || true
trivy fs --format json --output reports/containers/trivy.json .
node scripts/sec/license_check.js
```
7) QA/Release/DR/Obs/FinOps
```bash
node scripts/qa/coverage_gate.js
python3 scripts/qa/flake_guard.py
node scripts/ci/aggregate_gates.js > reports/gates/aggregate.json
opa eval -i reports/gate_input.json -d policy/opa/release_gate.rego "data.gate.allow"
python3 scripts/release/rollback_freshness.py
python3 scripts/obs/alert_runbook_link.py
python3 scripts/obs/burn_rate_freeze.py
```
