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
