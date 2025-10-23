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
