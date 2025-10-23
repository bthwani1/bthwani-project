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
