# S13 — البيانات والخصوصية

> Generated: 2025-10-22 18:22:24Z UTC


## الأهداف
- عقود أحداث events/schemas مع $id وversion وpii flags
- سياسات احتفاظ وسياسات تصنيف بيانات
- عدم وجود PII في logs/**

## أوامر
```bash
python3 scripts/data/validate_event_schemas.py
python3 scripts/privacy/pii_logs_scan.py
```

### معايير القبول (DoD)
- كل الحُرّاس تحت `reports/gates/**` = **PASS**.
- لا عناصر [TBD] مفتوحة. الاستثناءات ضمن صلاحية زمنية ومُوثّقة.
- تحديث OAS/Runbooks/Policies متزامن مع التغييرات.
