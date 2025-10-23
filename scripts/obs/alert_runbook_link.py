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
