# 🛠️ Admin Scripts

مجموعة من الـ scripts الإدارية للعمليات الحرجة والصيانة.

## ⚠️ تحذير

هذه الـ scripts **خطيرة جداً** ويجب استخدامها بحذر شديد. تتطلب:
- صلاحيات Superadmin
- تأكيد مزدوج
- Backup قبل التنفيذ
- تسجيل في Audit Log

---

## 📜 Scripts المتاحة

### 1. emergency-pause-system.ts
**الوصف**: إيقاف النظام بالكامل للطوارئ

**الاستخدام**:
```bash
npm run script:pause-system -- --reason="Emergency maintenance"
```

**ما يفعله**:
- يضع النظام في وضع الصيانة
- يمنع جميع العمليات الجديدة
- يحتفظ بالعمليات النشطة

**متى تستخدمه**:
- مشكلة أمنية حرجة
- خلل في قاعدة البيانات
- صيانة طارئة

---

### 2. emergency-resume-system.ts
**الوصف**: استئناف النظام بعد الصيانة

**الاستخدام**:
```bash
npm run script:resume-system
```

**ما يفعله**:
- يزيل وضع الصيانة
- يستأنف جميع العمليات
- يسجل في Audit Log

---

### 3. export-data.ts
**الوصف**: تصدير بيانات معينة

**الاستخدام**:
```bash
# Export specific collections
npm run script:export-data -- --collections=users,orders --output=./exports

# Export all data
npm run script:export-data -- --output=./full-export
```

**الأمان**:
- ✅ تشفير البيانات الحساسة
- ✅ تسجيل من قام بالتصدير
- ✅ حذف تلقائي بعد 7 أيام

---

## 🔒 Security Checklist

قبل تشغيل أي script:

- [ ] ✅ لديك صلاحيات Superadmin
- [ ] ✅ تم عمل backup حديث
- [ ] ✅ تم إبلاغ الفريق
- [ ] ✅ تم توثيق السبب
- [ ] ✅ تم الاختبار في staging أولاً
- [ ] ✅ جاهز للـ rollback إذا لزم الأمر

---

## 📝 Adding to package.json

```json
{
  "scripts": {
    "script:pause-system": "ts-node scripts/admin/emergency-pause-system.ts",
    "script:resume-system": "ts-node scripts/admin/emergency-resume-system.ts",
    "script:export-data": "ts-node scripts/admin/export-data.ts"
  }
}
```

---

**آخر تحديث**: 2025-10-15  
**الحالة**: جاهز للاستخدام في الحالات الطارئة فقط

