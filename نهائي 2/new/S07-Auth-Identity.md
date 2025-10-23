# S07 — الهوية والصلاحيات: TTL/MFA/Lockout/Access Review

> Generated: 2025-10-22 18:22:24Z UTC


## أهداف السياسة
- Access TTL ≤ 15m, Refresh ≤ 7d, Lockout بعد 5 محاولات.
- MFA 100% لمستخدمي الإدارة والشركاء.
- مراجعة ربع سنوية للصلاحيات.

## أوامر
```bash
python3 scripts/iam/mfa_coverage.py
python3 scripts/iam/access_review_q.py
```

### معايير القبول (DoD)
- كل الحُرّاس تحت `reports/gates/**` = **PASS**.
- لا عناصر [TBD] مفتوحة. الاستثناءات ضمن صلاحية زمنية ومُوثّقة.
- تحديث OAS/Runbooks/Policies متزامن مع التغييرات.
