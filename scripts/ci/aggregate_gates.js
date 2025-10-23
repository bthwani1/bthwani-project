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
