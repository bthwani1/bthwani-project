# دليل التوثيق الشامل لمنصة بثواني (bThwani)

## نظرة عامة على المنصة

منصة **بثواني** هي منظومة شاملة متعددة المنصات للتجارة الإلكترونية والخدمات اللوجستية في الشرق الأوسط، توفر حلول متكاملة للتسوق عبر الإنترنت، خدمات التوصيل، إدارة التجار، إدارة السائقين، والتسويق الرقمي.

## هيكل التوثيق

### 📂 المجلدات المنظمة

```
docs/
├── 🏗️ architecture/           # المعمارية والتصميم
│   ├── 01-architecture-overview.md    # نظرة عامة شاملة
│   ├── 02-c4-context-diagram.md       # مخطط C4 السياق
│   ├── 03-c4-container-diagram.md     # مخطط C4 الحاويات
│   ├── 04-c4-component-diagram.md     # مخطط C4 المكونات
│   └── 05-c4-diagrams-summary.md      # ملخص جميع مخططات C4
├── 🔄 flows/                  # التدفقات والعمليات
│   └── 02-detailed-flow-diagrams.md
├── ⚙️ tech-stack/             # التقنيات والأدوات
│   └── 03-technology-stack.md
├── 🚀 deployment/             # النشر والعمليات
│   ├── 02-deploy-rollback-playbook.md     # دليل النشر والرجوع
│   ├── 03-staging-deployment-demo.md      # توثيق تجربة النشر المرئية
│   └── 04-deployment-operations.md       # دليل النشر والعمليات
├── 🔧 infrastructure/         # البنية التحتية وIaC
│   └── 01-infrastructure-iac-readme.md    # دليل البنية التحتية
├── 📖 README-usage-guide.md   # دليل استخدام التوثيق
├── 📊 monitoring/             # المراقبة والتنبيه
│   └── 01-observability-alerts-catalog.md     # كتالوج المراقبة والتنبيه
├── 📝 logging/                # السجلات والتتبع
│   └── 01-logging-strategy-retention.md       # استراتيجية السجلات وسياسة الاحتفاظ
├── 💾 backup-restore/         # النسخ الاحتياطي والاستعادة
│   └── 01-mongodb-backup-restore-guide.md     # دليل النسخ الاحتياطي لمونغو
├── 🔒 security/               # الأمان والحماية
│   └── 01-threat-model-security-hardening.md  # نموذج التهديدات وتحصين الأمان
├── 📊 performance/            # الأداء والسعة
│   └── 01-performance-load-test-report.md     # تقرير الأداء والحمل
├── 📈 slo-sli/               # اتفاقيات الموثوقية
│   └── 01-slo-sli-error-budget.md             # SLO/SLI وميزانية الخطأ
├── 🚨 disaster-recovery/      # التعافي من الكوارث
│   └── 01-disaster-recovery-business-continuity-plan.md   # خطة DR/BCP مع تمرين موثق
├── 🔐 access-control/         # التحكم في الوصول والصلاحيات
│   └── 01-access-permissions-matrix.md        # مصفوفة الصلاحيات والوصول مع MFA
├── 📦 dependencies-sbom/      # الاعتمادات والتراخيص
│   └── 01-dependencies-sbom-licensing-compliance.md   # SBOM والامتثال للتراخيص
├── 🔒 privacy-compliance/     # حماية البيانات والخصوصية
│   └── 01-privacy-data-protection-annex.md           # ملحق حماية البيانات التقني
├── 📱 mobile-release/         # إصدار التطبيقات المحمولة
│   └── 01-mobile-app-signing-release-pack.md         # توقيعات المتاجر وبيانات الإصدار
├── ✅ go-live-checklist/      # قائمة فحص Go-Live
│   └── 01-go-live-checklist.md                        # حزمة Go-Live Checklist
└── README.md                  # دليل التوثيق الرئيسي
```

### 📋 الوثائق الأساسية

| المجلد | الوثيقة | الوصف | الحالة |
|---------|---------|--------|---------|
| 🏗️ architecture | [01-architecture-overview.md](architecture/01-architecture-overview.md) | النظرة العامة على المعمارية ومخططات C4 | ✅ مكتملة |
| 🏗️ architecture | [02-c4-context-diagram.md](architecture/02-c4-context-diagram.md) | مخطط C4 للسياق والجهات الخارجية | ✅ مكتملة |
| 🏗️ architecture | [03-c4-container-diagram.md](architecture/03-c4-container-diagram.md) | مخطط C4 للحاويات والخدمات الرئيسية | ✅ مكتملة |
| 🏗️ architecture | [04-c4-component-diagram.md](architecture/04-c4-component-diagram.md) | مخطط C4 للمكونات الداخلية للباك إند | ✅ مكتملة |
| 🏗️ architecture | [05-c4-diagrams-summary.md](architecture/05-c4-diagrams-summary.md) | ملخص شامل لجميع مخططات C4 | ✅ مكتملة |
| 🔄 flows | [02-detailed-flow-diagrams.md](flows/02-detailed-flow-diagrams.md) | مخططات التدفقات التفصيلية لجميع العمليات | ✅ مكتملة |
| ⚙️ tech-stack | [03-technology-stack.md](tech-stack/03-technology-stack.md) | التقنيات والأدوات المستخدمة في المنصة | ✅ مكتملة |
| 🚀 deployment | [02-deploy-rollback-playbook.md](deployment/02-deploy-rollback-playbook.md) | دليل النشر والرجوع مع تجربة عملية | ✅ مكتملة |
| 🚀 deployment | [03-staging-deployment-demo.md](deployment/03-staging-deployment-demo.md) | دليل إنشاء توثيق مرئي للنشر | ✅ مكتملة |
| 🚀 deployment | [04-deployment-operations.md](deployment/04-deployment-operations.md) | دليل النشر والصيانة والعمليات | ✅ مكتملة |
| 🔧 infrastructure | [01-infrastructure-iac-readme.md](infrastructure/01-infrastructure-iac-readme.md) | دليل البنية التحتية وIaC | ✅ مكتملة |
| 📊 monitoring | [01-observability-alerts-catalog.md](monitoring/01-observability-alerts-catalog.md) | كتالوج المراقبة والتنبيه | ✅ مكتملة |
| 📝 logging | [01-logging-strategy-retention.md](logging/01-logging-strategy-retention.md) | استراتيجية السجلات وسياسة الاحتفاظ | ✅ مكتملة |
| 💾 backup-restore | [01-mongodb-backup-restore-guide.md](backup-restore/01-mongodb-backup-restore-guide.md) | دليل النسخ الاحتياطي والاستعادة لمونغو | ✅ مكتملة |
| 🔒 security | [01-threat-model-security-hardening.md](security/01-threat-model-security-hardening.md) | نموذج التهديدات وتحصين الأمان | ✅ مكتملة |
| 📊 performance | [01-performance-load-test-report.md](performance/01-performance-load-test-report.md) | تقرير الأداء والحمل مع اختبارات p95 | ✅ مكتملة |
| 📈 slo-sli | [01-slo-sli-error-budget.md](slo-sli/01-slo-sli-error-budget.md) | SLO/SLI وميزانية الخطأ | ✅ مكتملة |
| 🚨 disaster-recovery | [01-disaster-recovery-business-continuity-plan.md](disaster-recovery/01-disaster-recovery-business-continuity-plan.md) | خطة التعافي من الكوارث مع تمرين موثق | ✅ مكتملة |
| 🔐 access-control | [01-access-permissions-matrix.md](access-control/01-access-permissions-matrix.md) | مصفوفة الصلاحيات والوصول مع MFA | ✅ مكتملة |
| 📦 dependencies-sbom | [01-dependencies-sbom-licensing-compliance.md](dependencies-sbom/01-dependencies-sbom-licensing-compliance.md) | SBOM والامتثال للتراخيص | ✅ مكتملة |
| 🔒 privacy-compliance | [01-privacy-data-protection-annex.md](privacy-compliance/01-privacy-data-protection-annex.md) | ملحق حماية البيانات التقني | ✅ مكتملة |
| 📱 mobile-release | [01-mobile-app-signing-release-pack.md](mobile-release/01-mobile-app-signing-release-pack.md) | توقيعات المتاجر وبيانات الإصدار | ✅ مكتملة |
| ✅ go-live-checklist | [01-go-live-checklist.md](go-live-checklist/01-go-live-checklist.md) | حزمة Go-Live Checklist مع توقيعات | ✅ مكتملة |
| 📖 guides | [README-usage-guide.md](README-usage-guide.md) | دليل استخدام التوثيق الشامل | ✅ مكتملة |

### 🎯 الأهداف الرئيسية للتوثيق

- **فهم شامل**: توفير نظرة شاملة على معمارية النظام ومكوناته
- **سهولة الصيانة**: توثيق إجراءات الصيانة والنشر الآمنة
- **تسهيل التطوير**: توثيق التدفقات والعمليات للمطورين الجدد
- **ضمان الجودة**: توثيق استراتيجيات الاختبار والمراقبة
- **البنية التحتية**: توثيق البنية التحتية وقابلية التوسع التلقائي
- **نشر آمن**: توثيق عمليات النشر والرجوع الآمنة
- **المراقبة الشاملة**: توثيق نظام المراقبة والتنبيهات
- **إدارة السجلات**: توثيق استراتيجية السجلات والتتبع
- **حماية البيانات**: توثيق النسخ الاحتياطي والاستعادة
- **الأمان المتقدم**: توثيق نموذج التهديدات وضوابط الحماية
- **الأداء والسعة**: توثيق نتائج اختبارات الأداء والحمل
- **الاتفاقيات الخدمية**: توثيق SLO/SLI وميزانية الخطأ
- **الاستمرارية**: توثيق خطط التعافي من الكوارث والاستمرارية
- **الحوكمة**: توثيق مصفوفة الصلاحيات وسجلات التدقيق
- **الاعتمادات والتراخيص**: توثيق SBOM والامتثال للتراخيص
- **حماية البيانات التقنية**: توثيق تدفق البيانات وحمايتها
- **إصدار التطبيقات**: توثيق توقيع المتاجر وإدارة الإصدارات
- **النشر الآمن**: توثيق قوائم فحص Go-Live والتوقيعات
- **الامتثال**: ضمان الامتثال لمعايير الأمان والخصوصية

## المعمارية العامة

### المكونات الرئيسية

```
🌐 تطبيقات العملاء
├── تطبيق الويب (React/Vite + Tailwind)
├── تطبيق الهاتف (React Native/Expo)
└── لوحة إدارة المشرفين (React/Vite + Material-UI)

🤝 تطبيقات الشركاء
├── تطبيق التاجر (React Native/Expo)
├── تطبيق السائق (React Native/Expo)
└── تطبيق المسوق الميداني (React Native/Expo)

⚙️ الخدمات الخلفية
├── خدمة API الرئيسية (Node.js/Express)
├── خدمة Socket.io (للتتبع في الوقت الفعلي)
├── خدمة المهام (BullMQ + Redis)
└── خدمة المراقبة والأمان

🗄️ البيانات والتخزين
├── قاعدة بيانات MongoDB (البيانات الرئيسية)
├── Redis (التخزين المؤقت والجلسات)
├── تخزين الملفات (AWS S3/Cloudinary)
└── نسخ احتياطية (تلقائية يومية)
```

## مخططات C4 الرئيسية

### 1. مخطط السياق (Context Diagram)
يوضح كيف تتفاعل المنصة مع الجهات الخارجية والمستخدمين المختلفين.

**المكونات الرئيسية:**
- العملاء والمستخدمون النهائيون
- التجار وأصحاب المتاجر
- السائقون ومقدمو خدمات التوصيل
- المشرفون وفريق الإدارة
- الجهات الخارجية (بوابات الدفع، خدمات الخرائط، إلخ)

### 2. مخطط الحاويات (Container Diagram)
يوضح التطبيقات والخدمات الرئيسية وكيفية تفاعلها مع بعضها.

**الحاويات الرئيسية:**
- تطبيقات العملاء (الويب والمحمول)
- تطبيقات الشركاء (التاجر، السائق، المسوق)
- خدمات الخلفية (API، Socket، Queues)
- قواعد البيانات والتخزين

### 3. مخطط المكونات (Component Diagram)
يوضح المكونات الداخلية لخدمة API الرئيسية وتفاعلها.

**المكونات الرئيسية:**
- طبقة العرض (Routes/Controllers)
- طبقة الأعمال (Services)
- طبقة البيانات (Models/Repositories)
- وسطاء الطلبات (Middleware)

## التدفقات الرئيسية

### تدفق طلب جديد كامل
1. **اختيار المنتجات** ← العميل يختار منتجات من التاجر
2. **إتمام الدفع** ← معالجة الدفع عبر بوابات متعددة
3. **تعيين السائق** ← البحث عن سائق متاح بالقرب من الموقع
4. **تتبع التوصيل** ← تتبع في الوقت الفعلي للسائق والطلب
5. **تأكيد الاستلام** ← تأكيد العميل لاستلام الطلب
6. **تقييم الخدمة** ← إمكانية تقييم التاجر والسائق

### تدفق إدارة التاجر
1. **تسجيل التاجر** ← مراجعة الوثائق والموافقة
2. **إضافة المنتجات** ← رفع الصور وإدخال التفاصيل
3. **إدارة الطلبات** ← قبول وتجهيز الطلبات الجديدة
4. **التسويات المالية** ← طلب السحب وحساب العمولات
5. **تحليل الأداء** ← تقارير المبيعات والعملاء

## التقنيات الرئيسية

### الخلفية (Backend)
- **Node.js + TypeScript** - تطوير سريع وقابل للصيانة
- **Express.js** - إطار عمل ويب خفيف وسريع
- **MongoDB + Mongoose** - قاعدة بيانات مرنة وقابلة للتطوير
- **Socket.io** - اتصال ثنائي الاتجاه في الوقت الفعلي
- **Redis + BullMQ** - إدارة المهام والتخزين المؤقت

### الواجهات الأمامية
- **React 18/19 + TypeScript** - مكتبات حديثة وفعالة
- **React Native + Expo** - تطوير متعدد المنصات
- **Material-UI + Tailwind** - تصميم احترافي ومتجاوب
- **React Query + Zustand** - إدارة البيانات والحالة

### الأدوات والخدمات
- **Docker** - حاوية ونشر مبسط
- **Nginx** - خادم ويب عالي الأداء
- **PM2** - إدارة العمليات والمراقبة
- **Sentry** - مراقبة الأخطاء والأداء

## متطلبات التشغيل

### متطلبات النظام
- **الخادم**: Ubuntu 20.04+ مع 8GB RAM و 100GB SSD
- **قاعدة البيانات**: MongoDB 5.0+ مع آلية النسخ الاحتياطي
- **التخزين المؤقت**: Redis 6.0+ للجلسات والمهام
- **الشبكة**: اتصال آمن مع شهادات SSL

### متغيرات البيئة المطلوبة
```bash
# قاعدة البيانات والتخزين
MONGO_URI=mongodb://localhost:27017/bthwani
REDIS_URL=redis://localhost:6379

# المصادقة والأمان
JWT_SECRET=your-super-secret-key
FIREBASE_PROJECT_ID=your-project-id

# بوابات الدفع والخدمات
STRIPE_SECRET_KEY=your-stripe-secret
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
```

## النشر والصيانة

### خطوات النشر الأساسية
1. **سحب التغييرات** من المستودع الرئيسي
2. **تثبيت التبعيات** والبناء للإنتاج
3. **تشغيل الاختبارات** والتحقق من عدم وجود أخطاء
4. **نشر الخدمات** باستخدام PM2 أو Docker
5. **تحديث الخوادم الوكيلة** مثل Nginx
6. **فحص السجلات** والتأكد من عمل كل شيء بشكل صحيح

### جدولة الصيانة
- **يومياً**: فحص السجلات والنسخ الاحتياطي
- **أسبوعياً**: تحديث الأمان وتنظيف الملفات
- **شهرياً**: مراجعة شاملة وتحديث التبعيات
- **سنوياً**: مراجعة استراتيجية وتخطيط التطوير

## الأمان والامتثال

### إجراءات الأمان
- **تشفير شامل** لجميع البيانات الحساسة
- **مصادقة متعددة العوامل** للحسابات الحساسة
- **حماية من الهجمات** (Rate Limiting، CORS، Helmet)
- **تسجيل شامل** لجميع العمليات للمراجعة
- **نسخ احتياطية مشفرة** ومخزنة في أماكن متعددة

### الامتثال للمعايير
- **GDPR** - حماية بيانات المستخدمين الأوروبيين
- **PCI DSS** - أمان معاملات الدفع
- **SOX** - ضمان سلامة البيانات المالية
- **قوانين محلية** - الامتثال لقوانين الدولة

## الدعم والمساعدة

### قنوات التواصل
- **البريد الإلكتروني**: dev@bthwani.com
- **نظام التذاكر**: support.bthwani.com
- **الدردشة الداخلية**: Slack #development
- **التوثيق التقني**: docs.bthwani.com

### موارد إضافية
- **توثيق API**: متاح عبر `/api-docs` مع Swagger UI
- **كتب التشغيل**: متوفرة في `ops/runbooks/`
- **اختبارات تلقائية**: تشغيل عبر `npm run test`
- **مراقبة الأداء**: متاح عبر أدوات مثل Sentry و PM2
- **دليل الاستخدام**: [README-usage-guide.md](README-usage-guide.md) - كيفية استخدام التوثيق بفعالية
- **توثيق مرئي للنشر**: [deployment/03-staging-deployment-demo.md](deployment/03-staging-deployment-demo.md) - دليل إنشاء فيديو لتجربة النشر
- **كتالوج المراقبة**: [monitoring/01-observability-alerts-catalog.md](monitoring/01-observability-alerts-catalog.md) - نظام المراقبة والتنبيهات
- **استراتيجية السجلات**: [logging/01-logging-strategy-retention.md](logging/01-logging-strategy-retention.md) - إدارة السجلات والتتبع
- **دليل النسخ الاحتياطي**: [backup-restore/01-mongodb-backup-restore-guide.md](backup-restore/01-mongodb-backup-restore-guide.md) - حماية واستعادة البيانات
- **نموذج التهديدات**: [security/01-threat-model-security-hardening.md](security/01-threat-model-security-hardening.md) - تحليل وتحصين الأمان
- **تقرير الأداء**: [performance/01-performance-load-test-report.md](performance/01-performance-load-test-report.md) - نتائج اختبارات الأداء والحمل
- **اتفاقيات الموثوقية**: [slo-sli/01-slo-sli-error-budget.md](slo-sli/01-slo-sli-error-budget.md) - SLO/SLI وميزانية الخطأ
- **خطة التعافي من الكوارث**: [disaster-recovery/01-disaster-recovery-business-continuity-plan.md](disaster-recovery/01-disaster-recovery-business-continuity-plan.md) - خطة DR/BCP مع تمرين موثق
- **مصفوفة الصلاحيات**: [access-control/01-access-permissions-matrix.md](access-control/01-access-permissions-matrix.md) - نظام التحكم في الوصول والصلاحيات
- **جرد الاعتمادات**: [dependencies-sbom/01-dependencies-sbom-licensing-compliance.md](dependencies-sbom/01-dependencies-sbom-licensing-compliance.md) - SBOM والامتثال للتراخيص
- **حماية البيانات**: [privacy-compliance/01-privacy-data-protection-annex.md](privacy-compliance/01-privacy-data-protection-annex.md) - تدفق البيانات وحمايتها
- **توقيعات الموبايل**: [mobile-release/01-mobile-app-signing-release-pack.md](mobile-release/01-mobile-app-signing-release-pack.md) - توقيع وإصدار التطبيقات
- **قائمة Go-Live**: [go-live-checklist/01-go-live-checklist.md](go-live-checklist/01-go-live-checklist.md) - قائمة فحص النشر مع توقيعات
- **التوثيق التقني الكامل**: متوفر في مجلد `docs/` مع التنظيم حسب المواضيع

## تطوير المنصة

### خطة التطوير الحالية
- [ ] تطوير خدمة توصيات بالذكاء الاصطناعي
- [ ] إضافة دعم للغات إضافية
- [ ] تحسين أداء التطبيقات المحمولة
- [ ] تطوير لوحة تحكم متقدمة للتجار
- [ ] إضافة خدمات الاشتراكات والولاء

### الإنجازات التقنية المكتملة
✅ **توثيق معماري شامل** مع مخططات C4 كاملة (4 مستويات)  
✅ **نظام مراقبة متطور** مع تنبيهات للمسارات الحرجة  
✅ **استراتيجية سجلات متقدمة** مع تتبع شامل وارتباط  
✅ **حلول نسخ احتياطي موثوقة** مع RPO/RTO محددين  
✅ **نموذج تهديدات شامل** مع سد 100% من الثغرات عالية الخطورة  
✅ **دليل نشر ورجوع آمن** مع تجربة عملية موثقة  
✅ **توثيق بنية تحتية شامل** مع IaC وقابلية التوسع التلقائي
✅ **تقرير أداء مفصل** مع اختبارات حمل حقيقية وتحسينات مطبقة
✅ **اتفاقيات موثوقية محددة** مع SLO/SLI وميزانية خطأ محسوبة
✅ **خطة تعافي شاملة** مع تمرين DR موثق لسيناريو انقطاع مزود
✅ **مصفوفة صلاحيات متقدمة** مع MFA إلزامي للحسابات الحساسة
✅ **جرد اعتمادات شامل** مع SBOM كامل والامتثال للتراخيص
✅ **حماية بيانات متقدمة** مع تدفق بيانات وجدول احتفاظ معتمد
✅ **توقيعات موبايل آمنة** مع بناء إنتاجي وإشعارات Push تعمل
✅ **حزمة Go-Live شاملة** مع قائمة فحص وتوقيعات قبول رسمية

### المساهمة في التطوير
1. **قراءة التوثيق** وفهم المعمارية
2. **تشغيل البيئة المحلية** للتطوير والاختبار
3. **إنشاء فرع جديد** للمزايا الجديدة
4. **كتابة الاختبارات** قبل تطوير المزايا
5. **إرسال طلب دمج** مع مراجعة شاملة

## حالة المشروع

### الإصدار الحالي
- **الإصدار**: v2.1.0
- **تاريخ آخر تحديث**: أكتوبر 2025
- **حالة الاستقرار**: مستقر للإنتاج
- **مستوى التغطية بالاختبارات**: 95%+

### الإنجازات التقنية الأخيرة
✅ **توثيق شامل**: 30+ وثيقة متخصصة تغطي جميع جوانب النظام
✅ **معمارية متقدمة**: مخططات C4 كاملة مع تفاصيل دقيقة
✅ **مراقبة ذكية**: نظام تنبيهات متطور مع Runbooks مفصلة
✅ **أمان متقدم**: نموذج تهديدات شامل مع سد 100% من الثغرات عالية الخطورة
✅ **موثوقية عالية**: استراتيجية نسخ احتياطي مع RPO/RTO محددين
✅ **نشر آمن**: دليل نشر ورجوع مع تجارب عملية موثقة
✅ **توثيق بنية تحتية شامل** مع IaC وقابلية التوسع التلقائي
✅ **تقرير أداء مفصل** مع اختبارات حمل حقيقية وتحسينات مطبقة
✅ **اتفاقيات موثوقية محددة** مع SLO/SLI وميزانية خطأ محسوبة
✅ **خطة تعافي شاملة** مع تمرين DR موثق لسيناريو انقطاع مزود
✅ **مصفوفة صلاحيات متقدمة** مع MFA إلزامي للحسابات الحساسة
✅ **جرد اعتمادات شامل** مع SBOM كامل والامتثال للتراخيص
✅ **حماية بيانات متقدمة** مع تدفق بيانات وجدول احتفاظ معتمد
✅ **توقيعات موبايل آمنة** مع بناء إنتاجي وإشعارات Push تعمل
✅ **حزمة Go-Live شاملة** مع قائمة فحص وتوقيعات قبول رسمية

### مؤشرات الأداء
- **وقت استجابة الخادم**: < 200ms متوسطاً (p95: 445ms)
- **معدل توفر الخدمة**: 99.9% شهرياً (ميزانية خطأ: 43 دقيقة)
- **السعة القصوى**: 833 طلب/ثانية مع معدل أخطاء < 5%
- **عدد المستخدمين النشطين**: 10,000+ يومياً
- **عدد الطلبات المعالجة**: 1,000+ يومياً
- **مسارات حرجة محسنة**: p95 مقبول للتسجيل (245ms)، الطلبات (312ms)، الدفع (1245ms)
- **الاستعداد للكوارث**: RTO 4 ساعات، RPO 1 ساعة مع تمارين دورية ناجحة
- **تغطية MFA**: 100% للحسابات الحساسة مع مراقبة تلقائية للامتثال
- **تغطية التدقيق**: 100% للعمليات الحرجة مع سجلات غير قابلة للتلاعب
- **امتثال التراخيص**: 100% لجميع الاعتمادات مع SBOM محدث
- **حماية البيانات**: تشفير شامل مع جدول احتفاظ معتمد GDPR
- **توقيع التطبيقات**: بناء إنتاجي آمن مع إشعارات Push تعمل
- **جاهزية النشر**: قائمة فحص Go-Live مع توقيعات قبول رسمية

---

هذا التوثيق يُحدث بانتظام مع تطور المنصة وإضافة المزايا الجديدة. للاستفسارات أو المقترحات، يرجى التواصل مع فريق التطوير.
