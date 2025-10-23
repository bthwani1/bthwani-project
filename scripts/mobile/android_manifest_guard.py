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
