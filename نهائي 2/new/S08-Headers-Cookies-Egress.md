# S08 — رؤوس الأمان والإخراج الخارجي والكوكيز

> Generated: 2025-10-22 18:22:24Z UTC


## النطاق
- CSP بلا unsafe-inline/eval
- CORS allowlist
- HSTS preload
- Cookie Flags: Secure+HttpOnly+SameSite
- Egress allowlist لمنع SSRF

## أوامر
```bash
bash scripts/headers/snapshot_stage.sh https://staging.example.tld
node scripts/headers/lint_csp_cors_hsts.js
node scripts/sec/cookie_session_lint.js
python3 scripts/sec/egress_allowlist_guard.py
```

### معايير القبول (DoD)
- كل الحُرّاس تحت `reports/gates/**` = **PASS**.
- لا عناصر [TBD] مفتوحة. الاستثناءات ضمن صلاحية زمنية ومُوثّقة.
- تحديث OAS/Runbooks/Policies متزامن مع التغييرات.
