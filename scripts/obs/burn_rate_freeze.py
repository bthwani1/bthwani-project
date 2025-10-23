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
