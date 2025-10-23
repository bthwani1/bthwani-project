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
