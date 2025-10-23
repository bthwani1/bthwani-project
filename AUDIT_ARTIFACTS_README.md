# Audit Artifacts Branch

## نظرة عامة

فرع `audit-artifacts` مخصص لنشر وتوزيع نتائج الفحوصات والتحليلات فقط. هذا الفرع لا يحتوي على كود التطبيق، بل يحتوي فقط على:

- `backend-nest/reports/` - تقارير الفحوصات من الخادم الخلفي
- `reports/` - تقارير الفحوصات من المستوى الجذر
- `audit-summary.md` - ملخص تلقائي للحالة

## كيفية الاستخدام

### للمطورين والمحللين

1. **التبديل للفرع:**
   ```bash
   git checkout audit-artifacts
   ```

2. **تحديث التقارير:**
   ```bash
   # من الفرع الرئيسي
   git checkout main
   npm run generate:all  # توليد جميع التقارير
   npm run audit:all     # تشغيل جميع الفحوصات

   # التبديل للفرع
   git checkout audit-artifacts

   # نسخ التقارير الجديدة
   git checkout main -- backend-nest/reports/
   git checkout main -- reports/

   # رفع التغييرات
   git add .
   git commit -m "Update audit artifacts - $(date)"
   git push origin audit-artifacts
   ```

### للعملاء والمطورين

- **تحميل آخر التقارير:** استخدم GitHub Releases
- **مراجعة الحالة:** اقرأ `audit-summary.md`
- **تحليل مفصل:** راجع الملفات في `reports/`

## الملفات المهمة

### backend-nest/reports/
- `openapi.yaml` - مواصفات OpenAPI الكاملة
- `parity_report.json` - تقرير تطابق API بين BE و FE
- `compliance_index.json` - فهرس الامتثال الأمني
- `error_taxonomy_diff.md` - تحليل أخطاء النظام

### reports/
- `sdk-generation-report.json` - تقرير توليد SDKs
- `runtime-tap-24h.json` - تسجيل استدعاءات API لـ 24 ساعة
- `runtime-fe-comparison.json` - مقارنة runtime مع FE static

### audit-summary.md
ملخص تلقائي يحتوي على:
- عدد الملفات في كل مجلد
- حالة SDK generation
- حالة API parity
- تحذيرات وتوصيات

## CI/CD

يتم تشغيل workflow تلقائي عند دفع تغييرات للفرع:
- ✅ التحقق من سلامة التقارير
- ✅ رفع كـ artifacts في GitHub
- ✅ إنشاء release تلقائي
- ✅ تنظيف الـ artifacts القديمة (احتفاظ بآخر 10)

## الأمان

- **لا يحتوي على كود سري** - فقط تقارير
- **لا يحتوي على بيانات حساسة** - فقط إحصائيات وتحليلات
- **يمكن مشاركته مع العملاء** - معلومات غير سرية

## الدعم

للأسئلة حول:
- **التقارير:** راجع `audit-summary.md`
- **البيانات:** راجع الملفات المحددة في `reports/`
- **المشاكل:** أنشئ issue في repository الرئيسي

---

**آخر تحديث:** $(date)
**الفرع:** audit-artifacts
