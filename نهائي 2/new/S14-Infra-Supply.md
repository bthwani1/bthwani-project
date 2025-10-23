# S14 — البنية التحتية والتوريد

> Generated: 2025-10-22 18:22:24Z UTC


## الأهداف
- NetPol ≥90%، Checkov/Kube-linter بدون Fail حرِج
- 0 CVE حرجة >48h، SBOM+Signing، SLSA L2
- لا رخص ممنوعة (AGPL/GPL-3)

## أوامر
```bash
python3 scripts/infra/netpol_coverage.py
checkov -d infra/ -o json > reports/infra/checkov.json || true
trivy fs --format json --output reports/containers/trivy.json .
node scripts/sec/license_check.js
```

### معايير القبول (DoD)
- كل الحُرّاس تحت `reports/gates/**` = **PASS**.
- لا عناصر [TBD] مفتوحة. الاستثناءات ضمن صلاحية زمنية ومُوثّقة.
- تحديث OAS/Runbooks/Policies متزامن مع التغييرات.
