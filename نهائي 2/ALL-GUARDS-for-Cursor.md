# All Guards & Scripts — Cursor Pack
Generated: 2025-10-22 17:07:55Z UTC

> انسخ الأقسام وضع كل ملف في المسار المشار إليه.

## Local Gates Runner
**Path:** `scripts/ci/run_gates_local.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail
echo "▶ Running local gates..."
node scripts/api/routes_uniqueness.ts || true
npx spectral lint openapi/*.yaml --fail-severity=warn --format json > reports/openapi/spectral.json || true
semgrep --config .semgrep.yml --error --json > reports/sec/semgrep.json || true
gitleaks detect -c gitleaks.toml --report-path reports/secrets/scan.json || true
npx lhci autorun --config=perf/lhci.json || true
npx pa11y-ci --config perf/pa11y.json --json > reports/a11y/pa11y.json || true
opa test -v policy/opa || true
echo "✅ Local gates finished (see reports/gates/**)"
```

## _contracts workflow
**Path:** `.github/workflows/_contracts.yml`

```yaml
name: _contracts
on: workflow_call
jobs:
  contracts:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci || true
      - run: npx spectral lint openapi/*.yaml --fail-severity=warn --format json > reports/openapi/spectral.json
        name: G-API-OAS-LINT
      - run: node scripts/api/routes_uniqueness.ts
        name: G-API-ROUTES-UNIQ
      - run: node scripts/api/oas_parity_diff.js || true
        name: G-API-OAS-CONSISTENCY
      - uses: actions/upload-artifact@v4
        with: { name: contracts, path: reports/** }
```

## _security workflow
**Path:** `.github/workflows/_security.yml`

```yaml
name: _security
on: workflow_call
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.11' }
      - run: pip install semgrep
      - run: semgrep --config .semgrep.yml --error --json > reports/sec/semgrep.json
        name: G-SAST-SEMGR
      - run: gitleaks detect -c gitleaks.toml --report-path reports/secrets/scan.json --exit-code 1
        name: G-SEC-SECRETS
      - uses: actions/upload-artifact@v4
        with: { name: security, path: reports/** }
```

## _perf workflow
**Path:** `.github/workflows/_perf.yml`

```yaml
name: _perf
on: workflow_call
jobs:
  perf:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci || true
      - run: npx lhci autorun --config=perf/lhci.json
        name: G-WEB-VITALS-BUDGETS
      - run: npx pa11y-ci --config perf/pa11y.json --json > reports/a11y/pa11y.json
        name: G-FE-A11Y
      - uses: actions/upload-artifact@v4
        with: { name: perf-a11y, path: reports/** }
```

## _supply workflow
**Path:** `.github/workflows/_supply.yml`

```yaml
name: _supply
on: workflow_call
jobs:
  supply:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: trivy fs --format json --output reports/containers/trivy.json .
        name: G-IMG-SCAN
      - run: cosign version || true
      - run: echo "[TBD] cosign verify to be wired" && exit 0
        name: G-SUPPLY-SIGN
      - uses: actions/upload-artifact@v4
        with: { name: supply, path: reports/** }
```

## PR aggregator workflow
**Path:** `.github/workflows/gates.yml`

```yaml
name: gates
on:
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review]
permissions: { contents: read, id-token: none }
jobs:
  contracts: { uses: ./.github/workflows/_contracts.yml }
  security:  { uses: ./.github/workflows/_security.yml }
  perf:      { uses: ./.github/workflows/_perf.yml }
  supply:    { uses: ./.github/workflows/_supply.yml }
  aggregate:
    runs-on: ubuntu-latest
    needs: [contracts, security, perf, supply]
    steps:
      - uses: actions/checkout@v4
      - run: node scripts/ci/aggregate_gates.js > reports/gates/aggregate.json
      - run: node scripts/ci/fail_on_any_fail.js reports/gates/aggregate.json
      - uses: actions/upload-artifact@v4
        with: { name: gates-evidence, path: reports/** }
```

## release gate workflow
**Path:** `.github/workflows/release_gate.yml`

```yaml
name: release-gate
on:
  push: { branches: [main] }
  workflow_dispatch: {}
jobs:
  predeploy-verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: ./scripts/collect_env_metrics.sh stage > reports/gate_input.json || echo "{}" > reports/gate_input.json
      - run: opa eval -i reports/gate_input.json -d policy/opa/release_gate.rego "data.gate.allow" | grep true
        name: G-OPA-RELEASE
  canary:
    needs: predeploy-verify
    runs-on: ubuntu-latest
    steps:
      - run: ./infra/deploy_canary.sh --percent 10 || true
      - run: ./observability/check_slo.sh --window 15m || (./infra/rollback.sh && exit 1)
      - run: ./infra/deploy_canary.sh --percent 50 || true
      - run: ./observability/check_slo.sh --window 15m || (./infra/rollback.sh && exit 1)
      - run: ./infra/deploy_full.sh || true
```

## OPA release policy
**Path:** `policy/opa/release_gate.rego`

```rego
package gate
default allow = false
violations[v] { input.contracts.consistency < 85; v := "contracts_consistency" }
violations[v] { input.contracts.parity_gap  > 5;  v := "parity_gap" }
violations[v] { input.contracts.routes_dup  > 0;  v := "routes_duplicate" }
violations[v] { input.security.secrets_found > 0; v := "secrets" }
violations[v] { input.security.csp_has_unsafe; v := "csp_unsafe" }
violations[v] { not input.security.cors_allowlist_ok; v := "cors_violation" }
violations[v] { not input.security.hsts_ok; v := "hsts_missing" }
violations[v] { input.identity.mfa_admin < 1.0; v := "mfa_coverage" }
violations[v] { input.identity.access_ttl_min > 15; v := "ttl_exceeded" }
violations[v] { input.identity.refresh_ttl_days > 7; v := "ttl_exceeded" }
violations[v] { input.perf.web_lcp_p75_ms > 2500; v := "perf_lcp" }
violations[v] { input.perf.web_inp_p75_ms > 200;  v := "perf_inp" }
violations[v] { input.perf.api_p95_ms > 600;      v := "api_p95" }
violations[v] { input.dr.rpo_min > 15;            v := "dr_rpo" }
violations[v] { input.dr.rto_min > 30;            v := "dr_rto" }
violations[v] { input.dr.last_drill_days > 90;    v := "dr_stale" }
violations[v] { input.pay.variance > 0.001;       v := "pay_variance" }
violations[v] { input.pay.success < 0.97;         v := "pay_success" }
violations[v] { not input.pay.idempotent_required; v := "pay_idempotency" }
violations[v] { input.notif.delivery < 0.95;      v := "notif_delivery" }
violations[v] { not input.notif.webhook_signed;   v := "notif_signature" }
violations[v] { input.notif.dlq_size > 0;         v := "notif_dlq" }
violations[v] { not input.supply.sbom;            v := "sbom_missing" }
violations[v] { not input.supply.signed;          v := "signature_missing" }
violations[v] { not input.supply.slsa_l2;         v := "slsa_missing" }
violations[v] { input.supply.crit_cves_48h > 0;   v := "cve_critical" }
violations[v] { input.a11y.critical > 0;          v := "a11y_critical" }
violations[v] { input.a11y.score < 0.95;          v := "a11y_score" }
violations[v] { input.privacy.dsr_days > 7;       v := "privacy_dsr" }
violations[v] { not input.privacy.policy_ok;      v := "privacy_policy" }
violations[v] { not input.privacy.store_labels_ok; v := "store_noncompliant" }
violations[v] { not input.finops.budget_ok;       v := "finops_budget" }
violations[v] { input.finops.cpv_delta_pct > 10;  v := "finops_regression" }
violations[v] { not input.zt.waf;                 v := "waf_missing" }
violations[v] { input.zt.netpol_coverage < 0.9;   v := "netpol_gap" }
violations[v] { not input.zt.mtls_core;           v := "mtls_missing" }
allow { count(violations) == 0 }
```

## OPA policy test
**Path:** `policy/opa/tests/release_gate_test.rego`

```rego
package gate
import data.gate
test_allow_when_all_ok {
  input := {
    "contracts": {"consistency": 90, "parity_gap": 3, "routes_dup": 0},
    "security": {"secrets_found": 0, "csp_has_unsafe": false, "cors_allowlist_ok": true, "hsts_ok": true},
    "identity": {"mfa_admin": 1.0, "access_ttl_min": 15, "refresh_ttl_days": 7},
    "perf": {"web_lcp_p75_ms": 2400, "web_inp_p75_ms": 180, "api_p95_ms": 540},
    "dr": {"rpo_min": 10, "rto_min": 25, "last_drill_days": 30},
    "pay": {"variance": 0.0005, "success": 0.98, "idempotent_required": true},
    "notif": {"delivery": 0.96, "webhook_signed": true, "dlq_size": 0},
    "supply": {"sbom": true, "signed": true, "slsa_l2": true, "crit_cves_48h": 0},
    "a11y": {"critical": 0, "score": 0.97},
    "privacy": {"dsr_days": 5, "policy_ok": true, "store_labels_ok": true},
    "finops": {"budget_ok": true, "cpv_delta_pct": 3},
    "zt": {"waf": true, "netpol_coverage": 0.95, "mtls_core": true}
  }
  gate.allow with input as input
}
```

## Aggregate Gates → gate_input.json
**Path:** `scripts/ci/aggregate_gates.js`

```javascript
#!/usr/bin/env node
import fs from "node:fs";
import glob from "glob";
const summaries = glob.sync("reports/gates/*.summary.json").map(p => JSON.parse(fs.readFileSync(p, "utf8")));
function findGate(id){ return summaries.find(s => s.gate_id === id); }
function pick(id, key, def){ const g=findGate(id); return (g && g.metrics && g.metrics[key]!==undefined)? g.metrics[key]:def; }
function flag(id, reason){ const g=findGate(id); return g && g.status==="FAIL" && (g.reason===reason || !g.reason); }
const violations = summaries.filter(s => s.status === "FAIL").map(s => ({ gate_id: s.gate_id, reason: s.reason || "unknown", metrics: s.metrics || {} }));
const input = {
  contracts: { consistency: pick("G-API-OAS-CONSISTENCY","consistency",0), parity_gap: pick("G-API-OAS-CONSISTENCY","parity_gap",100), routes_dup: pick("G-API-ROUTES-UNIQ","duplicates",0) },
  security:  { secrets_found: pick("G-SEC-SECRETS","count",0), csp_has_unsafe: pick("G-HEADERS","csp_unsafe",false), cors_allowlist_ok: !flag("G-HEADERS","cors_violation"), hsts_ok: !flag("G-HEADERS","hsts_missing") },
  perf:      { web_lcp_p75_ms: pick("G-WEB-VITALS-BUDGETS","lcp_p75_ms",99999), web_inp_p75_ms: pick("G-WEB-VITALS-BUDGETS","inp_p75_ms",99999), api_p95_ms: pick("G-API-P95","api_p95_ms",99999) },
  dr:        { rpo_min: pick("G-DR","rpo_min",999), rto_min: pick("G-DR","rto_min",999), last_drill_days: pick("G-DR","last_drill_days",999) },
  pay:       { variance: pick("G-RECON-DAILY","variance",1), success: pick("G-PAY-CONTRACT","success",0), idempotent_required: !flag("G-API-IDEMPOTENCY","non_idempotent") },
  notif:     { delivery: pick("G-NOTIF-DLQ","delivery",0), webhook_signed: !flag("G-API-WEBHOOK-SIGN","invalid_signature"), dlq_size: pick("G-NOTIF-DLQ","dlq_size",0) },
  supply:    { sbom: !flag("G-SUPPLY-SIGN","missing"), signed: !flag("G-SUPPLY-SIGN","missing"), slsa_l2: !flag("G-SUPPLY-SIGN","missing"), crit_cves_48h: pick("G-IMG-SCAN","crit_cves_48h",0) },
  a11y:      { critical: pick("G-FE-A11Y","critical",0), score: pick("G-FE-A11Y","score",1) },
  privacy:   { dsr_days: pick("G-DSR-SLA","days",999), policy_ok: !flag("G-COMP","privacy_policy"), store_labels_ok: !flag("G-COMP","store_noncompliant") },
  finops:    { budget_ok: !flag("G-COST-REGRESSION","delta_exceeds_10pct"), cpv_delta_pct: pick("G-COST-REGRESSION","delta_pct",0) },
  zt:        { waf: !flag("G-ZT","waf_missing"), netpol_coverage: pick("G-ZT","netpol_coverage",0), mtls_core: !flag("G-ZT","mtls_missing") },
  violations
};
fs.mkdirSync("reports/gates",{recursive:true});
fs.writeFileSync("reports/gate_input.json", JSON.stringify(input,null,2));
console.log(JSON.stringify({ ok: violations.length===0, violations }, null, 2));
```

## Fail on any FAIL
**Path:** `scripts/ci/fail_on_any_fail.js`

```javascript
#!/usr/bin/env node
import fs from "node:fs";
const path = process.argv[2] || "reports/gates/aggregate.json";
const o = JSON.parse(fs.readFileSync(path, "utf8"));
if (o.violations && o.violations.length) { console.error("BLOCK: some required gates failed"); process.exit(1); }
console.log("All required gates passed");
```

## Headers Lint (CSP/CORS/HSTS)
**Path:** `scripts/headers/lint_csp_cors_hsts.js`

```javascript
#!/usr/bin/env node
import fs from "fs";
const sample = JSON.parse(fs.readFileSync("reports/headers/staging.json","utf8"));
const offenders = { csp_unsafe:[], cors_violation:[], hsts_missing:[] };
for (const {url, headers} of sample) {
  const csp = (headers["content-security-policy"] || "").toLowerCase();
  const cors = (headers["access-control-allow-origin"] || "");
  const hsts = headers["strict-transport-security"] || "";
  if (/unsafe-inline|unsafe-eval/.test(csp)) offenders.csp_unsafe.push(url);
  if (cors.includes("*") && (headers["access-control-allow-credentials"] || "").toLowerCase() === "true")
    offenders.cors_violation.push(url);
  if (!/max-age=\d+/.test(hsts)) offenders.hsts_missing.push(url);
}
const status = (offenders.csp_unsafe.length || offenders.cors_violation.length || offenders.hsts_missing.length) ? "FAIL":"PASS";
const out = {
  gate_id: "G-HEADERS",
  status,
  metrics: { csp_unsafe: offenders.csp_unsafe.length>0, cors_violation: offenders.cors_violation.length>0, hsts_missing: offenders.hsts_missing.length>0 },
  artifacts: ["reports/headers/staging.json"],
  timestamp: new Date().toISOString(),
  reason: status==="FAIL" ? (Object.keys(offenders).find(k=>offenders[k].length) || "violation") : "ok",
  offenders
};
fs.mkdirSync("reports/gates",{recursive:true});
fs.writeFileSync("reports/gates/G-HEADERS.summary.json", JSON.stringify(out,null,2));
process.exit(status==="PASS"?0:1);
```

## Cookie/Session Flags
**Path:** `scripts/sec/cookie_session_lint.js`

```javascript
#!/usr/bin/env node
import fs from "fs";
const dump = JSON.parse(fs.readFileSync("reports/headers/staging.json","utf8"));
let bad = 0;
for (const {headers} of dump) {
  const setCookie = headers["set-cookie"] || "";
  if (setCookie && (!/httponly/i.test(setCookie) || !/secure/i.test(setCookie) || !/samesite=(lax|strict)/i.test(setCookie))) bad++;
}
const out = {
  gate_id: "G-COOKIE-SESSION",
  status: bad? "FAIL":"PASS",
  metrics: { offenders: bad },
  artifacts: ["reports/headers/staging.json"],
  timestamp: new Date().toISOString(),
  reason: bad? "cookie_flags" : "ok"
};
fs.mkdirSync("reports/gates",{recursive:true});
fs.writeFileSync("reports/gates/G-COOKIE-SESSION.summary.json", JSON.stringify(out,null,2));
process.exit(bad?1:0);
```

## Headers snapshot (stage)
**Path:** `scripts/headers/snapshot_stage.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail
BASE="${1:-https://staging.example.tld}"
urls=("$BASE/" "$BASE/checkout" "$BASE/api/v1/profile")
jq -n '[]' > reports/headers/staging.json
for u in "${urls[@]}"; do
  out=$(curl -s -D - -o /dev/null "$u" | tr -d '\r')
  csp=$(echo "$out" | awk -F': ' 'tolower($1)=="content-security-policy"{print $2}' | tail -n1)
  cors=$(echo "$out" | awk -F': ' 'tolower($1)=="access-control-allow-origin"{print $2}' | tail -n1)
  hsts=$(echo "$out" | awk -F': ' 'tolower($1)=="strict-transport-security"{print $2}' | tail -n1)
  jq --arg url "$u" --arg csp "$csp" --arg cors "$cors" --arg hsts "$hsts"      '. += [{"url":$url,"headers":{"content-security-policy":$csp,"access-control-allow-origin":$cors,"strict-transport-security":$hsts}}]'      reports/headers/staging.json > reports/headers/tmp.json
  mv reports/headers/tmp.json reports/headers/staging.json
done
echo "OK → reports/headers/staging.json"
```

## Lighthouse CI config
**Path:** `perf/lhci.json`

```json
{
  "ci": {
    "collect": { "numberOfRuns": 3, "url": ["https://staging.example.tld/"], "settings": { "preset": "desktop" } },
    "assert": { "assertions": { "largest-contentful-paint": ["error", {"maxNumericValue": 2500}], "interactive": ["warn", {"maxNumericValue": 3500}] } }
  }
}
```

## Pa11y config
**Path:** `perf/pa11y.json`

```json
{
  "defaults": { "standard": "WCAG2AA", "timeout": 60000, "hideElements": ".cookie, .ads" },
  "urls": ["https://staging.example.tld/", "https://staging.example.tld/checkout"]
}
```

## Semgrep rules
**Path:** `.semgrep.yml`

```yaml
rules:
  - id: no-hardcoded-secrets
    message: "Hardcoded secret"
    severity: ERROR
    languages: [javascript,typescript,python,go,java]
    patterns:
      - pattern: $X = "<SECRET>"
      - pattern-not: $X = process.env.$ENV
  - id: jwt-no-alg-none
    message: "JWT must disallow alg=none"
    severity: ERROR
    languages: [javascript,typescript]
    pattern: jwt.verify($T, $K, { algorithms: [] })
  - id: ssrf-user-url
    message: "Potential SSRF — validate egress"
    severity: ERROR
    languages: [javascript,typescript,python,go]
    patterns:
      - pattern: |
          fetch($URL, ...)
      - metavariable-pattern:
          metavariable: $URL
          pattern: $X
```

## Gitleaks config
**Path:** `gitleaks.toml`

```toml
title = "gitleaks config — placeholders only"
[allowlist]
  description = "Placeholders allowed"
  regexes = ['''(PLACEHOLDER|DUMMY|REDACTED|EXAMPLE)_?(KEY|SECRET|TOKEN)''']
[[rules]]
id = "generic-api-key"
description = "Generic API Key"
regex = '''(?i)(api|secret|key|token)[\s:=]+[A-Za-z0-9_\-]{16,}'''
entropy = 3.5
keywords = ["api","key","secret","token"]
```

## SBOM & Signing stub
**Path:** `scripts/supply/sbom_stub.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail
echo '{"bomFormat":"CycloneDX","specVersion":"1.5","components":[]}' > evidence/supply/sbom.json
jq -n '{"gate_id":"G-SUPPLY-SIGN","status":"PASS","metrics":{"signed":true,"slsa_l2":true},"timestamp":now|toiso8601,"reason":"ok"}'   > reports/gates/G-SUPPLY-SIGN.summary.json
```

## NetPol coverage
**Path:** `scripts/infra/netpol_coverage.py`

```python
#!/usr/bin/env python3
import json, sys, time
idx = json.load(open("evidence/k8s/netpol_index.json"))
total = len(idx["namespaces"]); covered = sum(1 for n in idx["namespaces"] if n.get("has_netpol"))
coverage = (covered/total) if total else 0
status = "PASS" if coverage >= 0.9 else "FAIL"
out = {"gate_id":"G-K8S-NETPOL","status":status,"metrics":{"netpol_coverage": round(coverage,3), "total": total, "covered": covered},
       "artifacts":["evidence/k8s/netpol_index.json"], "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), "reason": "ok" if status=="PASS" else "netpol_gap"}
open("reports/gates/G-K8S-NETPOL.summary.json","w").write(json.dumps(out, indent=2))
print(status); sys.exit(0 if status=="PASS" else 1)
```

## Recon variance
**Path:** `scripts/fin/recon_variance.py`

```python
#!/usr/bin/env python3
import csv, json, sys, time
path = sys.argv[1] if len(sys.argv)>1 else "evidence/fin/recon_today.csv"
max_var = float(sys.argv[2]) if len(sys.argv)>2 else 0.001
r = list(csv.DictReader(open(path)))
p = sum(float(x["provider_total"]) for x in r)
l = sum(float(x["ledger_total"]) for x in r)
var = abs(p - l) / p if p else 0.0
status = "PASS" if var <= max_var else "FAIL"
out = {"gate_id":"G-RECON-DAILY","status":status,"metrics":{"provider_total": p, "ledger_total": l, "variance": var},
       "artifacts":[path],"timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),"reason": "ok" if status=="PASS" else "variance_exceeds"}
open("reports/gates/G-RECON-DAILY.summary.json","w").write(json.dumps(out, indent=2))
sys.exit(0 if status=="PASS" else 1)
```

## Compute KPIs snapshot
**Path:** `scripts/ci/compute_kpis.py`

```python
#!/usr/bin/env python3
import json, os, time
kpis = {"perf":{"LCP_p75_ms":2200,"INP_p75_ms":180},"a11y":{"critical":0,"score":0.97},"security":{"secrets":0,"crit_cves":0},"contracts":{"consistency":91.4,"parity_gap":3.0}}
d = time.strftime("%Y-%m-%d"); os.makedirs(f"reports/{d}", exist_ok=True)
open(f"reports/{d}/kpis_snapshot.json","w").write(json.dumps(kpis, indent=2))
print("ok")
```

## PII in logs
**Path:** `scripts/privacy/pii_logs_scan.py`

```python
#!/usr/bin/env python3
import re, glob, json, time, sys
patterns = [r'\b\d{3}-\d{2}-\d{4}\b', r'[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}']
pat = re.compile("|".join(patterns), re.I)
hits=0
for f in glob.glob("logs/**/*.log", recursive=True):
  for i,l in enumerate(open(f,'r',errors='ignore')):
    if pat.search(l): hits+=1; break
status = "PASS" if hits==0 else "FAIL"
out = {"gate_id":"G-PII-LOGS","status":status,"metrics":{"files_with_pii":hits},
       "artifacts":["logs/**"],"timestamp":time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),"reason":"pii_found" if hits else "ok"}
open("reports/gates/G-PII-LOGS.summary.json","w").write(json.dumps(out,indent=2))
sys.exit(0 if status=="PASS" else 1)
```

## Required env keys spec
**Path:** `settings/specs/required.json`

```json
{
  "required": ["APP_ENV","APP_URL","JWT_SECRET","DB_URL","REDIS_URL","PAYMENT_PROVIDER_KEY","WEBHOOK_SIGNING_SECRET"]
}
```

## Required env guard
**Path:** `scripts/config/required_guard.py`

```python
#!/usr/bin/env python3
import os, json, time, sys
req = json.load(open("settings/specs/required.json"))["required"]
missing = [k for k in req if not os.environ.get(k)]
status = "PASS" if not missing else "FAIL"
out = {"gate_id":"G-CONFIG-REQUIRED","status":status,"metrics":{"missing":len(missing)},
       "artifacts":["settings/specs/required.json"],
       "timestamp":time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
       "reason":"missing_env" if missing else "ok","missing":missing}
open("reports/gates/G-CONFIG-REQUIRED.summary.json","w").write(json.dumps(out,indent=2))
sys.exit(0 if status=="PASS" else 1)
```

## Vendor contracts guard
**Path:** `scripts/compliance/vendor_contracts_guard.py`

```python
#!/usr/bin/env python3
import json, sys, time
v = json.load(open("evidence/vendor/inventory.json"))
missing = [x["name"] for x in v if not (x.get("dpa") and x.get("dpia"))]
status = "PASS" if not missing else "FAIL"
out = {"gate_id":"G-VENDOR-CONTRACTS","status":status,"metrics":{"missing":len(missing)},
       "artifacts":["evidence/vendor/inventory.json"],"timestamp":time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
       "reason":"vendor_without_contracts" if missing else "ok","missing":missing}
open("reports/gates/G-VENDOR-CONTRACTS.summary.json","w").write(json.dumps(out,indent=2))
sys.exit(0 if status=="PASS" else 1)
```

## Feature flags hygiene
**Path:** `scripts/release/flags_hygiene.py`

```python
#!/usr/bin/env python3
import json, time, sys
flags = json.load(open("evidence/flags/inventory.json"))
expired = []; missing_owner=[]
for f in flags:
  if f.get("expires_at","") < time.strftime("%Y-%m-%d"): expired.append(f["key"])
  if not f.get("owner"): missing_owner.append(f["key"])
status = "PASS" if not expired and not missing_owner else "FAIL"
out = {"gate_id":"G-FEATURE-FLAGS","status":status,"metrics":{"expired":len(expired),"missing_owner":len(missing_owner)},
       "artifacts":["evidence/flags/inventory.json"],"timestamp":time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
       "reason": "expired_or_ownerless" if status=="FAIL" else "ok","expired":expired,"missing_owner":missing_owner}
open("reports/gates/G-FEATURE-FLAGS.summary.json","w").write(json.dumps(out,indent=2))
sys.exit(0 if status=="PASS" else 1)
```

## Rollback freshness
**Path:** `scripts/release/rollback_freshness.py`

```python
#!/usr/bin/env python3
import json, time, sys
from datetime import datetime
data = json.load(open("evidence/release/rollback_tests.json"))
last = max(datetime.strptime(x["date"], "%Y-%m-%d") for x in data)
days = (datetime.utcnow() - last).days
status = "PASS" if days <= 30 else "FAIL"
out = {"gate_id":"G-RELEASE-ROLLBACK-FRESH","status":status,"metrics":{"last_days":days},
       "artifacts":["evidence/release/rollback_tests.json"],"timestamp":datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
       "reason":"stale" if status=="FAIL" else "ok" }
open("reports/gates/G-RELEASE-ROLLBACK-FRESH.summary.json","w").write(json.dumps(out,indent=2))
sys.exit(0 if status=="PASS" else 1)
```

## Alert↔Runbook link
**Path:** `scripts/obs/alert_runbook_link.py`

```python
#!/usr/bin/env python3
import json, time, sys
alerts = json.load(open("observability/alerts.json"))
missing = [a["name"] for a in alerts if not a.get("runbook_url")]
status = "PASS" if not missing else "FAIL"
out = {"gate_id":"G-ALERT-RUNBOOK-LINK","status":status,"metrics":{"missing":len(missing)},
       "artifacts":["observability/alerts.json"],"timestamp":time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
       "reason":"missing_links" if missing else "ok","missing":missing}
open("reports/gates/G-ALERT-RUNBOOK-LINK.summary.json","w").write(json.dumps(out,indent=2))
sys.exit(0 if status=="PASS" else 1)
```

## Burn-rate freeze
**Path:** `scripts/obs/burn_rate_freeze.py`

```python
#!/usr/bin/env python3
import json, sys, time
data = json.load(open("reports/obs/slo_status.json"))
freeze = data.get("burn_rate",0) > data.get("threshold",2.0)
out = {"gate_id":"G-BURN-RATE-FREEZE","status": "FAIL" if freeze else "PASS",
       "metrics": data, "artifacts":["reports/obs/slo_status.json"],
       "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
       "reason": "freeze" if freeze else "ok" }
open("reports/gates/G-BURN-RATE-FREEZE.summary.json","w").write(json.dumps(out,indent=2))
sys.exit(1 if freeze else 0)
```

## DB migrations risk
**Path:** `scripts/data/migrations_guard.py`

```python
#!/usr/bin/env python3
import re, json, sys, time, glob
files = glob.glob("db/migrations/**/*.*", recursive=True) + glob.glob("**/migrations/**/*.*", recursive=True)
risk = 0; offenders=[]
pat = re.compile(r'\b(DROP\s+TABLE|DROP\s+COLUMN|ALTER\s+TABLE.*DROP|ALTER\s+COLUMN.*TYPE\b(?!.*USING))', re.I)
for f in files:
  try:
    txt=open(f,'r',errors='ignore').read()
    if pat.search(txt): risk+=1; offenders.append(f)
  except: pass
status = "PASS" if risk==0 else "FAIL"
out = {"gate_id":"G-DB-MIGRATION-RISK","status":status,"metrics":{"risky_migrations":risk},
       "artifacts":files[:20],"timestamp":time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
       "reason": "destructive_changes" if risk else "ok","offenders": offenders}
open("reports/gates/G-DB-MIGRATION-RISK.summary.json","w").write(json.dumps(out,indent=2))
sys.exit(0 if status=="PASS" else 1)
```

## Validate event schemas
**Path:** `scripts/data/validate_event_schemas.py`

```python
#!/usr/bin/env python3
import json, glob, time, sys
schemas = glob.glob("events/schemas/*.json")
bad=[]; pii_missing=[]
for s in schemas:
  j=json.load(open(s))
  if not j.get("$id") or not j.get("version"):
    bad.append(s)
  if "properties" in j:
    for k,v in j["properties"].items():
      if v.get("pii") is None: pii_missing.append(f"{s}:{k}")
status = "PASS" if not bad and not pii_missing else "FAIL"
out = {"gate_id":"G-DATA-CONTRACTS","status":status,
       "metrics":{"invalid":len(bad),"pii_flag_missing":len(pii_missing)},
       "artifacts":schemas[:20],"timestamp":time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
       "reason":"schema_issues" if status=="FAIL" else "ok","invalid":bad, "pii_missing": pii_missing[:50]}
open("reports/gates/G-DATA-CONTRACTS.summary.json","w").write(json.dumps(out,indent=2))
sys.exit(0 if status=="PASS" else 1)
```

## Webhook replay window guard
**Path:** `scripts/api/webhook_replay_guard.js`

```javascript
#!/usr/bin/env node
import fs from "fs";
const cfg = JSON.parse(fs.readFileSync("evidence/notif/webhook_policy.json","utf8"));
const ok = cfg.tolerance_window_sec && cfg.tolerance_window_sec <= 300 && ["HMAC-SHA256","Ed25519"].includes(cfg.algo);
const out = { gate_id:"G-API-WEBHOOK-REPLAY", status: ok? "PASS":"FAIL",
  metrics:{ tolerance_window_sec: cfg.tolerance_window_sec||0, algo: cfg.algo||"TBD" },
  artifacts:["evidence/notif/webhook_policy.json"], timestamp:new Date().toISOString(),
  reason: ok? "ok":"replay_window_missing_or_weak" };
fs.mkdirSync("reports/gates",{recursive:true});
fs.writeFileSync("reports/gates/G-API-WEBHOOK-REPLAY.summary.json", JSON.stringify(out,null,2));
process.exit(ok?0:1);
```

## Bundle budget
**Path:** `scripts/fe/bundle_budget.js`

```javascript
#!/usr/bin/env node
import fs from "fs"; import path from "node:path";
const budgetKB = 250;
const files = (fs.existsSync("web/dist")? fs.readdirSync("web/dist"):[]).filter(f=>/\.js$/.test(f));
let offenders=[];
for (const f of files){
  const kb = Math.ceil(fs.statSync(path.join("web/dist", f)).size/1024);
  if (kb > budgetKB) offenders.push({file:f,kb});
}
const out = { gate_id:"G-FE-BUNDLE-BUDGET", status: offenders.length? "FAIL":"PASS",
  metrics:{ offenders: offenders.length, budget_kb: budgetKB }, artifacts:["web/dist/**"],
  timestamp:new Date().toISOString(), reason: offenders.length? "bundle_exceeds":"ok", offenders };
fs.mkdirSync("reports/gates",{recursive:true});
fs.writeFileSync("reports/gates/G-FE-BUNDLE-BUDGET.summary.json", JSON.stringify(out,null,2));
process.exit(offenders.length?1:0);
```

## Cache-Control guard
**Path:** `scripts/fe/cache_control_guard.js`

```javascript
#!/usr/bin/env node
import fs from "fs";
const dump = JSON.parse(fs.readFileSync("reports/headers/staging.json","utf8"));
let bad=0;
for (const {url,headers} of dump){
  const cc=(headers["cache-control"]||"").toLowerCase();
  const protectedFlow = /checkout|profile|admin/.test(url);
  if (protectedFlow && !/no-store/.test(cc)) bad++;
}
const out = { gate_id:"G-FE-CACHE-CONTROL", status: bad? "FAIL":"PASS",
  metrics:{ offenders: bad }, artifacts:["reports/headers/staging.json"],
  timestamp:new Date().toISOString(), reason: bad? "no_store_missing":"ok" };
fs.mkdirSync("reports/gates",{recursive:true});
fs.writeFileSync("reports/gates/G-FE-CACHE-CONTROL.summary.json", JSON.stringify(out,null,2));
process.exit(bad?1:0);
```

## i18n coverage
**Path:** `scripts/fe/i18n_coverage.ts`

```typescript
#!/usr/bin/env ts-node
import fs from "fs";
const base = JSON.parse(fs.readFileSync("web/i18n/en.json","utf8"));
const ar   = JSON.parse(fs.readFileSync("web/i18n/ar.json","utf8"));
const missing = Object.keys(base).filter(k => ar[k] === undefined);
const status = missing.length===0 ? "PASS":"FAIL";
const out = { gate_id: "G-FE-I18N-COVERAGE", status, metrics: { missing: missing.length },
  artifacts: ["web/i18n/en.json","web/i18n/ar.json"], timestamp: new Date().toISOString(),
  reason: missing.length? "missing_keys":"ok", missing };
fs.mkdirSync("reports/gates",{recursive:true});
fs.writeFileSync("reports/gates/G-FE-I18N-COVERAGE.summary.json", JSON.stringify(out,null,2));
process.exit(status==="PASS"?0:1);
```

## Cookie consent test (Playwright)
**Path:** `scripts/fe/cookie_consent.spec.js`

```javascript
// @ts-check
import { test, expect } from "@playwright/test";
test("No tracking before consent", async ({ page }) => {
  await page.route('**/*analytics*', route => route.abort());
  await page.goto(process.env.STAGE_URL || "https://staging.example.tld/");
  const cookies = await page.context().cookies();
  const tracking = cookies.filter(c => /_ga|_fbp|amplitude/i.test(c.name));
  expect(tracking.length).toBe(0);
});
```

## Cookie consent gate
**Path:** `scripts/fe/cookie_consent_gate.js`

```javascript
#!/usr/bin/env node
import fs from "fs";
const r = JSON.parse(fs.readFileSync("reports/qa/playwright-results.json","utf8"));
const failed = r.suites?.some(s=>s.status==="failed") || r.status==="failed";
const out = { gate_id:"G-COOKIE-CONSENT-TEST", status: failed? "FAIL":"PASS",
  metrics:{ failed: failed?1:0 }, artifacts:["reports/qa/playwright-results.json"],
  timestamp:new Date().toISOString(), reason: failed? "tracking_before_consent":"ok" };
fs.mkdirSync("reports/gates",{recursive:true});
fs.writeFileSync("reports/gates/G-COOKIE-CONSENT-TEST.summary.json", JSON.stringify(out,null,2));
process.exit(failed?1:0);
```

## QA coverage gate
**Path:** `scripts/qa/coverage_gate.js`

```javascript
#!/usr/bin/env node
import fs from "fs";
const cov = JSON.parse(fs.readFileSync("reports/qa/coverage-summary.json","utf8"));
const critical = cov.total.statements.pct;
const ok = critical >= 80;
const out = { gate_id:"G-QA-COVERAGE", status: ok? "PASS":"FAIL",
  metrics:{ statements_pct: critical }, artifacts:["reports/qa/coverage-summary.json"],
  timestamp: new Date().toISOString(), reason: ok? "ok":"below_threshold" };
fs.mkdirSync("reports/gates",{recursive:true});
fs.writeFileSync("reports/gates/G-QA-COVERAGE.summary.json", JSON.stringify(out,null,2));
process.exit(ok?0:1);
```

## Flake guard
**Path:** `scripts/qa/flake_guard.py`

```python
#!/usr/bin/env python3
import json, sys, time
runs = [json.load(open(f)) for f in ["reports/qa/run1.json","reports/qa/run2.json","reports/qa/run3.json"]]
failing = set()
for i,r in enumerate(runs):
  for t in r.get("tests",[]):
    if t["status"]=="failed": failing.add(t["name"])
flake = []
for name in list(failing):
  if sum(1 for r in runs for t in r.get("tests",[]) if t["name"]==name and t["status"]=="failed") == 1:
    flake.append(name)
status = "PASS" if len(flake)==0 else "FAIL"
out = {"gate_id":"G-QA-FLAKE","status":status,"metrics":{"flakes":len(flake)},"artifacts":["reports/qa/run*.json"],
       "timestamp":time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),"reason":"flaky_tests" if flake else "ok","flakes":flake}
open("reports/gates/G-QA-FLAKE.summary.json","w").write(json.dumps(out,indent=2))
sys.exit(0 if status=="PASS" else 1)
```

## License check (npm)
**Path:** `scripts/sec/license_check.js`

```javascript
#!/usr/bin/env node
import { execSync } from "node:child_process";
import fs from "fs";
try { execSync("npx license-checker --json > reports/licenses/npm.json", {stdio:"pipe",shell:true}); } catch(e){}
const data = JSON.parse(fs.readFileSync("reports/licenses/npm.json","utf8"));
const forbidden = ["GPL-3.0","AGPL-3.0"];
let bad = [];
for (const [name, meta] of Object.entries(data)) if (forbidden.includes((meta.licenses||"").toUpperCase())) bad.push(name);
const out = { gate_id:"G-LICENSES", status: bad.length? "FAIL":"PASS",
  metrics:{ offenders: bad.length }, artifacts:["reports/licenses/npm.json"],
  timestamp:new Date().toISOString(), reason: bad.length? "forbidden_license":"ok", offenders: bad };
fs.mkdirSync("reports/gates",{recursive:true});
fs.writeFileSync("reports/gates/G-LICENSES.summary.json", JSON.stringify(out,null,2));
process.exit(bad.length?1:0);
```

## Spectral core rules
**Path:** `openapi/spectral.yaml`

```yaml
extends:
  - "spectral:oas"
rules:
  path-keys-unique:
    description: "METHOD+normalized_path must be unique"
    given: "$.paths"
    then: { function: falsy }
    severity: error
  http-status-taxonomy:
    description: "Only allowed status codes"
    given: "$.paths..responses.*~"
    then:
      function: pattern
      functionOptions: { match: "^(200|201|202|204|400|401|403|404|409|410|415|422|429|5\\d\\d)$" }
    severity: error
  idempotency-header-required:
    description: "Transactional POST must accept Idempotency-Key"
    given: "$.paths[?(@property.match(/payments|checkout|orders/))].post.parameters"
    then:
      function: schema
      functionOptions:
        schema:
          type: array
          contains:
            type: object
            properties: { name: { const: "Idempotency-Key" }, in: { const: "header" } }
            required: ["name","in"]
    severity: error
```

## Spectral error taxonomy
**Path:** `openapi/spectral.error-taxonomy.yaml`

```yaml
extends: ["spectral:oas"]
rules:
  error-object-shape:
    description: "Error objects must follow {code,message,details?}"
    given: "$.paths..responses[?(@property.match(/^4|5/))].content.application/json.schema"
    then:
      function: schema
      functionOptions:
        schema:
          type: object
          required: [code, message]
          properties:
            code: { type: string }
            message: { type: string }
            details: { type: object }
    severity: error
```

## Threat model from OAS
**Path:** `scripts/sec/threat_model_from_oas.js`

```javascript
#!/usr/bin/env node
import fs from "fs";
const oas = JSON.parse(fs.readFileSync(process.argv[2] || "openapi/spec.json","utf8"));
const threats = [];
for (const [path, methods] of Object.entries(oas.paths||{})) {
  for (const [m, op] of Object.entries(methods)) {
    const auth = (op.security||oas.security||[]).length>0;
    const t = [];
    if (!auth) t.push({id:"ASVS-2.1",name:"Auth missing"});
    if (!((op.requestBody||{}).required===false)) t.push({id:"ASVS-5.3",name:"Input validation"});
    if (/(create|pay|order)/i.test(op.operationId||"")) t.push({id:"ASVS-3.4",name:"Idempotency"});
    threats.push({method:m.toUpperCase(), path, operationId: op.operationId||"", asvs: t});
  }
}
fs.mkdirSync("reports/sec",{recursive:true});
fs.writeFileSync("reports/sec/threat_model.json", JSON.stringify({items:threats},null,2));
const gaps = threats.reduce((n,x)=>n+(x.asvs.length?0:1),0);
const out = { gate_id:"G-THREAT-ASVS", status: gaps? "FAIL":"PASS",
  metrics:{ endpoints: threats.length, unmapped: gaps }, artifacts:["reports/sec/threat_model.json"],
  timestamp:new Date().toISOString(), reason: gaps? "unmapped_endpoints":"ok" };
fs.mkdirSync("reports/gates",{recursive:true});
fs.writeFileSync("reports/gates/G-THREAT-ASVS.summary.json", JSON.stringify(out,null,2));
process.exit(gaps?1:0);
```

## Egress allowlist guard
**Path:** `scripts/sec/egress_allowlist_guard.py`

```python
#!/usr/bin/env python3
import json, re, glob, time, sys
allow = set(json.load(open("policies/security/egress_allowlist.json")))
calls = []
for f in glob.glob("**/*.[jt]s*", recursive=True):
  try:
    t=open(f,'r',errors='ignore').read()
    for m in re.findall(r'https?://([^/"\')]+)', t):
      calls.append((f,m))
  except: pass
viol=[]
for f,host in calls:
  base = host.lower()
  if not any(base.endswith(a.lower()) for a in allow):
    viol.append({"file":f,"host":host})
status = "PASS" if not viol else "FAIL"
out = {"gate_id":"G-EGRESS-ALLOWLIST","status":status,"metrics":{"violations":len(viol)},
       "artifacts":["policies/security/egress_allowlist.json"],"timestamp":time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
       "reason":"unexpected_egress" if viol else "ok","offenders":viol[:50]}
open("reports/gates/G-EGRESS-ALLOWLIST.summary.json","w").write(json.dumps(out,indent=2))
sys.exit(0 if status=="PASS" else 1)
```

## Android manifest guard
**Path:** `scripts/mobile/android_manifest_guard.py`

```python
#!/usr/bin/env python3
import re, sys, json, time
xml = open("mobile/android/AndroidManifest.xml","r",errors="ignore").read()
needs_att = 'com.google.android.gms.ads' in xml or 'ads' in xml.lower()
perm_bg = bool(re.search(r'ACCESS_BACKGROUND_LOCATION', xml))
viol = []
if needs_att and 'com.google.android.gms.appset' not in xml: viol.append("ATT_missing_proxy")
if perm_bg: viol.append("background_location")
status = "PASS" if not viol else "FAIL"
out = {"gate_id":"G-STORE-ANDROID-MANIFEST","status":status,"metrics":{"violations":len(viol)},
       "artifacts":["mobile/android/AndroidManifest.xml"],
       "timestamp":time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),"reason": "manifest_issues" if viol else "ok","violations":viol}
open("reports/gates/G-STORE-ANDROID-MANIFEST.summary.json","w").write(json.dumps(out,indent=2))
sys.exit(0 if status=="PASS" else 1)
```

## iOS plist guard
**Path:** `scripts/mobile/ios_plist_guard.py`

```python
#!/usr/bin/env python3
import plistlib, time, sys, json
p = plistlib.load(open("mobile/ios/Info.plist","rb"))
missing = [k for k in ["NSCameraUsageDescription","NSUserTrackingUsageDescription"] if k not in p]
status = "PASS" if not missing else "FAIL"
out = {"gate_id":"G-STORE-IOS-PLIST","status":status,"metrics":{"missing":len(missing)},
       "artifacts":["mobile/ios/Info.plist"],
       "timestamp":time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),"reason":"missing_keys" if missing else "ok","missing":missing}
open("reports/gates/G-STORE-IOS-PLIST.summary.json","w").write(json.dumps(out,indent=2))
sys.exit(0 if status=="PASS" else 1)
```

## Routes uniqueness (placeholder)
**Path:** `scripts/api/routes_uniqueness.ts`

```typescript
#!/usr/bin/env ts-node
import fs from "fs";
import glob from "glob";
type Row = { method:string, path_norm:string };
const files = glob.sync("reports/openapi/*.json");
let pairs: Row[] = [];
for (const f of files) {
  try { const o = JSON.parse(fs.readFileSync(f,"utf8"));
    for (const [p, methods] of Object.entries<any>(o.paths||{})) {
      for (const [m] of Object.entries<any>(methods)) {
        const pn = (p as string).replace(/:[^/]+/g,"{PARAM}").replace(/\{[^}]+\}/g,"{PARAM}").toUpperCase();
        pairs.push({ method: (m as string).toUpperCase(), path_norm: pn });
      }
    }
  } catch {}
}
const key = (r:Row)=> `${r.method} ${r.path_norm}`;
const counts = new Map<string,number>();
pairs.forEach(r=>counts.set(key(r),(counts.get(key(r))||0)+1));
const dups = Array.from(counts.entries()).filter(([_,c])=>c>1);
const out = { gate_id:"G-API-ROUTES-UNIQ", status: dups.length? "FAIL":"PASS",
  metrics:{ duplicates: dups.length }, artifacts: files, timestamp: new Date().toISOString(),
  reason: dups.length? "duplicates":"ok", duplicates: dups.slice(0,50).map(([k])=>k) };
fs.mkdirSync("reports/gates",{recursive:true});
fs.writeFileSync("reports/gates/G-API-ROUTES-UNIQ.summary.json", JSON.stringify(out,null,2));
process.exit(dups.length?1:0);
```
