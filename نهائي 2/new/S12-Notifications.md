# S12 — الإشعارات والويبهوكس

> Generated: 2025-10-22 18:22:24Z UTC


## الأهداف
- Delivery ≥95% على Stage
- توقيع كل Webhook والتحقق من الطابع الزمني
- DLQ للحالات الحرجة = 0، Suppression فعّال

## أوامر
```bash
node scripts/fe/cookie_consent_gate.js || true
# راقب DLQ وإحصاءات التسليم حسب المزود
```

### معايير القبول (DoD)
- كل الحُرّاس تحت `reports/gates/**` = **PASS**.
- لا عناصر [TBD] مفتوحة. الاستثناءات ضمن صلاحية زمنية ومُوثّقة.
- تحديث OAS/Runbooks/Policies متزامن مع التغييرات.
