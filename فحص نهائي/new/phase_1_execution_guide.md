# دليل تنفيذ المرحلة الأولى - الأمان والأساسيات

## 🎯 نظرة عامة
المرحلة الأولى تركز على أكثر الإجراءات أهمية وحساسية:
- **BTW-SEC-003**: فحص الأسرار والأمان
- **BTW-AUD-002**: إزالة التكرارات في البيك

**المدة**: 3 أيام | **الأولوية**: P0 Critical | **المخاطر**: عالية

## 📋 المهام التفصيلية

### اليوم 1: فحص الأسرار (BTW-SEC-003)

#### المهام الفنية
```bash
# 1. تثبيت أدوات الفحص
pip install gitleaks trufflehog

# 2. فحص جميع المستودعات
gitleaks detect --config .gitleaks.toml --verbose --redact
trufflehog --regex --entropy=True filesystem .

# 3. فحص ملفات البيئة والإعدادات
find . -name "*.env*" -o -name "*config*" -o -name "*secret*" | xargs grep -r "password\|key\|token\|secret"

# 4. فحص Docker images
docker scan --file Dockerfile .
```

#### الخطوات التشغيلية
1. **تحليل النتائج**: تصنيف الأسرار المكتشفة حسب الخطورة
2. **إبطال المفاتيح**: تدوير أي مفاتيح أو أسرار مكشوفة
3. **تحديث المتغيرات**: استبدال القيم في ملفات البيئة

#### معايير القبول اليومية
- [ ] تشغيل gitleaks/trufflehog مكتمل
- [ ] تحليل أولي للنتائج
- [ ] بدء عملية إبطال المفاتيح الحساسة

### اليوم 2: إدارة الأسرار والـ SBOM

#### إنتاج SBOM
```bash
# تثبيت cyclonedx
npm install -g @cyclonedx/cyclonedx-npm

# إنتاج SBOM للـ dependencies
cyclonedx-npm --output-file sbom.json

# للـ Python
pip install cyclonedx-bom
cyclonedx-py -o sbom.json
```

#### توقيع الصور
```bash
# تثبيت cosign
cosign version

# تسجيل الدخول إلى registry
cosign login registry.example.com

# توقيع الصور
cosign sign --key cosign.key bthwani/backend:latest
cosign sign --key cosign.key bthwani/frontend:latest
```

#### معايير القبول
- [ ] SBOM مُنتج ومُخزن بأمان
- [ ] جميع الصور مُوقعة
- [ ] مفاتيح التوقيع آمنة

### اليوم 3: إزالة التكرارات (BTW-AUD-002)

#### تحليل التكرارات الحالية
```bash
# استخراج التكرارات من ملف التقرير
cat btw_cursor_action_pack.json | jq '.duplicates[]'

# فحص كل تكرار
# 1. DELIVERY/CART/{PARAM} - 2 occurrences
# 2. / - 2 occurrences
# 3. CATEGORIES - 2 occurrences
# إلخ...
```

#### خطوات الإصلاح
1. **تحديد المسارات المتكررة**:
   - `DELIVERY/CART/{PARAM}` - دمج controllers
   - `/` - root endpoint واحد
   - `CATEGORIES` - controller واحد

2. **إضافة CI Guard**:
```yaml
# في .github/workflows/ci.yml
- name: Check for duplicate routes
  run: |
    # script للتحقق من عدم وجود تكرارات
    npm run check-duplicates || exit 1
```

3. **إضافة اختبارات**:
```typescript
// test/api-duplicates.test.ts
describe('API Duplicates', () => {
  it('should have unique METHOD+path combinations', () => {
    const routes = getAllRoutes();
    const duplicates = findDuplicates(routes);
    expect(duplicates).toHaveLength(0);
  });
});
```

#### معايير القبول
- [ ] تحليل جميع التكرارات الـ 7
- [ ] خطة إصلاح محددة لكل تكرار
- [ ] CI guard مُضاف ويعمل

## 👥 توزيع المسؤوليات

### فريق الأمان (Security Team)
- **المسؤول الرئيسي**: فحص وإدارة الأسرار
- **المهام**: تشغيل الأدوات، تحليل النتائج، إبطال المفاتيح
- **الوقت المطلوب**: 100% (3 أيام كاملة)

### فريق DevOps
- **المسؤول الرئيسي**: SBOM وتوقيع الصور
- **المهام**: إنتاج SBOM، تكوين CI للتوقيع
- **الوقت المطلوب**: 100% (3 أيام)

### فريق Backend
- **المسؤول الرئيسي**: إزالة التكرارات
- **المهام**: تحليل التكرارات، توحيد المسارات، إضافة الاختبارات
- **الوقت المطلوب**: 50% (يومياً بعد الظهر)

## 📊 مؤشرات النجاح

### مؤشرات يومية
- **يوم 1**: عدد الأسرار المكتشفة والمُحلّة
- **يوم 2**: حالة إنتاج SBOM وتوقيع الصور
- **يوم 3**: عدد التكرارات المُحلّة

### معايير الانتقال للمرحلة التالية
- [ ] SecretsFound = 0
- [ ] AllArtifactsSigned = true
- [ ] SBOMGenerated = true
- [ ] duplicates_backend = 0
- [ ] CI guard يعمل ويمنع التكرارات

## 🚨 خطط الطوارئ

### اكتشاف أسرار حرجة
- **الإجراء**: إيقاف فوري لجميع العمليات
- **الإخطار**: فرق الأمان + الإدارة العليا
- **الوقت**: فوري

### فشل في إنتاج SBOM
- **الإجراء**: استخدام أدوات بديلة (Syft, Tern)
- **الوقت الإضافي**: 4 ساعات

### صعوبة في توحيد التكرارات
- **الإجراء**: اجتماع طوارئ مع architects
- **الوقت الإضافي**: يوم إضافي

## 📋 قائمة التحقق قبل النهاية

### الأمان
- [ ] فحص gitleaks مكتمل
- [ ] فحص trufflehog مكتمل
- [ ] جميع الأسرار المكتشفة مُحلّة
- [ ] مفاتيح جديدة مُنشأة ومُخزنة بأمان

### SBOM & Signing
- [ ] ملف SBOM مُنتج وصالح
- [ ] جميع الصور مُوقعة
- [ ] CI مُكوّن لتوقيع الصور تلقائياً

### التكرارات
- [ ] تحليل جميع التكرارات السبعة
- [ ] خطة إصلاح محددة لكل تكرار
- [ ] CI guard مُضاف ومختبر
- [ ] اختبارات مُضافة للتحقق من عدم التكرار

## 📞 نقاط الاتصال

- **قائد المرحلة**: [اسم المسؤول]
- **فريق الأمان**: security@bthwani.com
- **DevOps**: devops@bthwani.com
- **Backend**: backend@bthwani.com

## 📝 التسليمات المطلوبة

1. **تقرير الأمان**: ملخص شامل للأسرار المكتشفة والإجراءات المتخذة
2. **ملف SBOM**: sbom.json مع تاريخ الإنتاج
3. **سجل التوقيع**: قائمة بالصور المُوقعة
4. **خطة توحيد التكرارات**: تفاصيل كل تكرار وطريقة الحل
5. **اختبار CI**: proof أن CI يفشل عند وجود تكرارات

---

**تاريخ الإنشاء**: 22 أكتوبر 2025
**الحالة**: جاهز للتنفيذ
