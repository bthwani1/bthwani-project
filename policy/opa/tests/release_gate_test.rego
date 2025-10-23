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
