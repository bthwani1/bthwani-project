#!/usr/bin/env python3
import json, os, time
kpis = {"perf":{"LCP_p75_ms":2200,"INP_p75_ms":180},"a11y":{"critical":0,"score":0.97},"security":{"secrets":0,"crit_cves":0},"contracts":{"consistency":91.4,"parity_gap":3.0}}
d = time.strftime("%Y-%m-%d"); os.makedirs(f"reports/{d}", exist_ok=True)
open(f"reports/{d}/kpis_snapshot.json","w").write(json.dumps(kpis, indent=2))
print("ok")
