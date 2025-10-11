# نظام المالية الشامل - Bthwani Platform

## نظرة عامة

نظام مالي شامل ومتقدم يوفر إدارة كاملة للمدفوعات، التسويات، والمحافظ المالية لمنصة Bthwani للتوصيل والتجارة الإلكترونية. النظام مصمم وفقًا لأفضل الممارسات في هندسة البرمجيات ويتبع مبادئ Domain-Driven Design.

## 🎯 المكونات الرئيسية

### 1. نظام التسويات (Settlements)
- **التسويات التلقائية** للسائقين والتجار لفترات محددة
- **حسابات دقيقة** للمبالغ المستحقة من الطلبات المكتملة
- **تصدير CSV** للمراجعة والمحاسبة
- **إدارة الحالات** (مسودة، جاهزة، مدفوعة، ملغية)

### 2. نظام المحافظ (Wallets)
- **رصيد معلق ومتاح** لكل مستخدم
- **تحويل تلقائي** من معلق إلى متاح عند التسليم
- **قيود مزدوجة متوازنة** لجميع العمليات المالية
- **كشوف حساب مفصلة** مع رصيد جاري

### 3. نظام الدفعات (Payouts)
- **دفعات دورية للسائقين** بناءً على الرصيد المتاح
- **معالجة تلقائية** مع قيود محاسبية
- **تصدير ملفات بنكية** للتحويلات المصرفية
- **تتبع حالات الدفع** (مسودة، قيد المعالجة، مدفوعة)

### 4. نظام العمولات (Commissions)
- **قواعد عمولة مرنة** (نسبة مئوية أو مبلغ ثابت)
- **حدود عليا ودنيا** للعمولات
- **تطبيق تلقائي** على الطلبات
- **تقارير مفصلة** بالفترات والقواعد المطبقة

### 5. نظام المطابقة (Reconciliation)
- **مقارنة تلقائية** بين الطلبات والمحافظ والتسويات
- **كشف الفروقات** وتحليلها
- **تقارير يومية وشهرية** للمطابقة
- **تصدير شامل** للمراجعة المالية

### 6. نظام القيود المحاسبية (Double-Entry Accounting)
- **قيود مزدوجة متوازنة** لجميع العمليات
- **حسابات متعددة** (محافظ، إيرادات، بنوك، PSP)
- **تتبع كامل** للحركات المالية
- **ضمان التوازن** في جميع القيود

### 7. نظام أذونات الأدوار (RBAC)
- **أدوار محددة**: FinanceAdmin, Ops, Driver, Vendor, Auditor
- **حماية شاملة** لجميع نقاط النهاية
- **عرض مشروط** للعناصر في الواجهة
- **حماية الروابط العميقة** (404/403 ودية)

### 8. نظام المراقبة والتنبيهات (Observability)
- **مقاييس في الوقت الفعلي** للنظام المالي
- **تنبيهات تلقائية** عند اكتشاف مشاكل
- **سجلات التدقيق** لجميع العمليات المالية
- **حالة صحة النظام** مع مؤشرات الأداء

## 🏗️ البنية التقنية

### Domain Layer (منطق الأعمال)
```
src/domain/finance/
├── settlement.domain.ts          # قواعد أعمال التسويات
├── payout.domain.ts              # قواعد أعمال الدفعات
├── wallet.domain.ts              # قواعد أعمال المحافظ
├── commission.domain.ts          # قواعد أعمال العمولات
├── ledger.domain.ts              # قواعد أعمال قيود الأستاذ
└── events/                       # أحداث المجال
    ├── settlement-created.event.ts
    └── payout-processed.event.ts
```

### Application Layer (حالات الاستخدام)
```
src/application/finance/useCases/
├── settlement/
│   ├── create-settlement.usecase.ts
│   └── mark-settlement-paid.usecase.ts
├── payout/
│   ├── create-payout-batch.usecase.ts
│   └── process-payout-batch.usecase.ts
└── wallet/
    ├── view-wallet-statement.usecase.ts
    └── export-wallet-statement.usecase.ts
```

### Infrastructure Layer (التفاصيل التقنية)
```
src/infrastructure/finance/
├── repositories/                 # مستودعات البيانات
│   ├── settlement.repository.ts
│   ├── payout-batch.repository.ts
│   └── wallet-account.repository.ts
├── externalServices/             # خدمات خارجية
│   ├── bank-integration.service.ts
│   └── notification.service.ts
└── configuration/                # إعدادات النظام
    ├── finance.config.ts
    └── currency.config.ts
```

### Interface Layer (Controllers & Routes)
```
src/interface/finance/
├── controllers/                  # معالجات الطلبات
│   ├── settlement.controller.ts
│   ├── payout.controller.ts
│   └── wallet.controller.ts
├── middleware/                   # وسطاء الحماية
│   ├── finance.middleware.ts
│   └── audit.middleware.ts
└── routes/                       # تعريف المسارات
    ├── settlement.routes.ts
    ├── payout.routes.ts
    └── wallet.routes.ts
```

### Shared Kernel (المشتركات)
```
src/shared/finance/
├── types/                        # أنواع البيانات
│   ├── finance.types.ts
│   └── enums.ts
├── utilities/                    # أدوات مساعدة
│   ├── currency.util.ts
│   └── validation.util.ts
└── constants/                    # ثوابت النظام
    └── finance.constants.ts
```

## 📊 API Endpoints

### التسويات
```
POST   /finance/settlements/generate          # إنشاء تسوية جديدة (FinanceAdmin)
GET    /finance/settlements                   # قائمة التسويات (FinanceAdmin, Ops, Auditor)
GET    /finance/settlements/:id               # تفاصيل التسوية
PATCH  /finance/settlements/:id/mark-paid     # تعليم كمدفوعة (FinanceAdmin, Ops)
GET    /finance/settlements/:id/export.csv    # تصدير CSV
```

### المحافظ
```
GET    /finance/wallet/balance                # رصيد المحفظة (Driver/Vendor لمحفظتهم، Admin/Ops/Auditor للجميع)
GET    /finance/wallet/balances/:type         # أرصدة جميع الحسابات (FinanceAdmin, Ops, Auditor)
GET    /finance/wallet/ledger/entries         # قيود دفتر الأستاذ
```

### الدفعات
```
POST   /finance/payouts/generate              # إنشاء دفعة سائقين (FinanceAdmin, Ops)
GET    /finance/payouts                       # قائمة الدفعات
GET    /finance/payouts/:id                   # تفاصيل الدفعة
PATCH  /finance/payouts/:id/process           # معالجة الدفعة
GET    /finance/payouts/:id/export.csv        # تصدير CSV للبنك
GET    /finance/payouts/wallet-statement/:id  # كشف محفظة السائق
```

### العمولات
```
POST   /finance/commissions/rules             # إنشاء قاعدة عمولة (FinanceAdmin)
GET    /finance/commissions/rules             # قائمة قواعد العمولة
POST   /finance/commissions/calculate         # حساب عمولة لطلب
GET    /finance/commissions/report            # تقرير العمولات
```

### المطابقة والتقارير
```
GET    /finance/reconciliation/report         # تقرير المطابقة لفترة
GET    /finance/reconciliation/validate       # التحقق من توازن القيود
GET    /finance/reports/daily-comparison/:date # مقارنة يومية
GET    /finance/reports/monthly-comparison/:year/:month # مقارنة شهرية
```

### المراقبة
```
GET    /finance/monitoring/metrics            # مقاييس النظام
GET    /finance/monitoring/alerts             # التنبيهات الحالية
GET    /finance/monitoring/health             # حالة صحة النظام
POST   /finance/monitoring/audit-log          # إضافة سجل تدقيق
```

## 🔐 أنواع البيانات والـ Enums

### حالات المحفظة
```typescript
enum WalletState {
  PENDING = 'pending',     // معلق حتى التسليم
  AVAILABLE = 'available'  // متاح للسحب
}
```

### حالات التسويات
```typescript
enum SettlementStatus {
  DRAFT = 'draft',         // مسودة
  READY = 'ready',         // جاهزة للدفع
  PAID = 'paid',           // مدفوعة
  CANCELED = 'canceled'    // ملغية
}
```

### حالات الدفعات
```typescript
enum PayoutStatus {
  DRAFT = 'draft',         // مسودة
  PROCESSING = 'processing', // قيد المعالجة
  PAID = 'paid'            // مدفوعة
}
```

### أدوار المستخدمين
```typescript
enum FinanceRole {
  FINANCE_ADMIN = 'FinanceAdmin',  // صلاحيات كاملة
  OPS = 'Ops',                     // عمليات محدودة
  DRIVER = 'Driver',               // محفظته الخاصة فقط
  VENDOR = 'Vendor',               // محفظته الخاصة فقط
  AUDITOR = 'Auditor'              // قراءة فقط للتقارير
}
```

## 🚨 أكواد الأخطاء

تم تعريف أكواد أخطاء محددة لكل سيناريو خطأ محتمل:

```typescript
enum FinanceErrorCode {
  SETTLEMENT_NOT_FOUND = 'SETTLEMENT_NOT_FOUND',
  SETTLEMENT_ALREADY_PAID = 'SETTLEMENT_ALREADY_PAID',
  PAYOUT_BATCH_NOT_FOUND = 'PAYOUT_BATCH_NOT_FOUND',
  WALLET_INSUFFICIENT_BALANCE = 'WALLET_INSUFFICIENT_BALANCE',
  INVALID_PERIOD = 'INVALID_PERIOD',
  INVALID_AMOUNT = 'INVALID_AMOUNT',
  INSUFFICIENT_FINANCE_PERMISSIONS = 'INSUFFICIENT_FINANCE_PERMISSIONS',
  UNAUTHORIZED = 'UNAUTHORIZED'
}
```

## 📋 طريقة الاختبار والتحقق

### اختبار التسويات
1. إنشاء تسوية تجريبية لفترة محددة
2. التحقق من البيانات في ملف CSV المُصدّر
3. مقارنة الأرقام مع قاعدة البيانات

### اختبار المحافظ
1. تنفيذ طلب تجريبي ومراقبة الرصيد المعلق
2. تأكيد التسليم ومراقبة تحول الرصيد إلى متاح
3. محاولة سحب مبلغ أكبر من المتاح (يجب الرفض)

### اختبار الدفعات
1. إنشاء دفعة لسائق برصيد متاح
2. معالجة الدفعة ومراقبة نقص الرصيد
3. التحقق من كشف المحفظة للسائق

### اختبار المطابقة
1. مقارنة تقرير الطلبات اليومي مع كشف المحفظة
2. التحقق من تطابق الأرقام مع توضيح الفروقات المبررة

### اختبار العمولات
1. اختيار 3 طلبات بقيم مختلفة
2. التحقق من حساب العمولة حسب القواعد المحددة
3. التأكد من عدم وجود فروقات في السنتات

### اختبار الأذونات
1. تجربة حسابين مختلفين (Admin vs Driver)
2. التأكد من اختلاف القوائم والأزرار
3. اختبار حماية الروابط العميقة

## 🔒 الأمان والصلاحيات

- **المصادقة مطلوبة** لجميع نقاط النهاية
- **نظام RBAC متقدم** مع 5 أدوار محددة
- **حماية الروابط العميقة** (404 للوصول غير المصرح)
- **تسجيل شامل** لجميع العمليات المالية
- **التحقق من التوازن** في جميع القيود المحاسبية

## 📈 الأداء والتحسين

- **فهارس محسّنة** للاستعلامات المعقدة
- **تجميع البيانات** للتقارير الشهرية واليومية
- **تحديد نتائج** للاستعلامات الكبيرة
- **ذاكرة تخزين مؤقت** للبيانات المتكررة
- **ضغط البيانات** للملفات الكبيرة

## 🛠️ الصيانة والمراقبة

- **مهام مجدولة** للتحقق اليومي من توازن القيود
- **تنبيهات تلقائية** عند اكتشاف مشاكل
- **سجلات مفصلة** لتتبع جميع العمليات
- **نسخ احتياطية** للبيانات المالية الحساسة
- **مراقبة الأداء** مع مقاييس في الوقت الفعلي

## 🚀 المهام المجدولة (Cron Jobs)

### مهام يومية
- **00:30**: توليد التسويات اليومية
- **01:00**: فحص صحة النظام المالي
- **02:00**: توليد التقارير اليومية

### مهام أسبوعية
- **الاثنين 03:00**: معالجة دفعات السائقين الأسبوعية
- **الأحد 23:00**: مطابقة أسبوعية شاملة

### مهام شهرية
- **01 04:00**: تقرير العمولات الشهري
- **01 05:00**: ملخص التسويات الشهري

## 📊 مواصفات ملفات CSV

### Settlement CSV
```
settlement_id,type,period_start,period_end,currency,line_id,ref_type,ref_id,description,amount,gross_amount,fees,adjustments,net_amount,payable_account_id
S-202509-0001,driver,2025-09-01T00:00:00.000Z,2025-09-30T23:59:59.999Z,SAR,10,order,ORD-12345,"Order 12345",1500,150000,0,0,150000,WA-DRV-9
```

### Payout CSV
```
batch_id,item_id,driver_id,beneficiary,amount,currency,memo,export_ref
PB-202509-0002,7,DRV-9,IBAN-SA1234567890123456789012,200000,SAR,"Monthly payout Sep-2025","BNKROW-9981"
```

### Wallet Statement CSV
```
date,entry_id,split_id,memo,ref_type,ref_id,side,amount,balance_state,running_balance
2025-09-15T10:30:00.000Z,LE-778,LS-992,"Order 12345",order,ORD-12345,credit,1500,available,1500
```

## 🧪 هيكل الاختبارات

### Unit Tests
- اختبارات منطق الأعمال (Domain Logic)
- اختبارات الخدمات (Services)
- اختبارات المستودعات (Repositories)

### Integration Tests
- اختبارات سير العمل الكامل
- اختبارات التكامل بين الطبقات
- اختبارات قاعدة البيانات

### E2E Tests
- اختبارات شاملة للعمليات الكاملة
- اختبارات الواجهات (Frontend)
- اختبارات API الكاملة

### Performance Tests
- اختبارات الأداء للعمليات الكبيرة
- اختبارات الحمل والضغط
- اختبارات زمن الاستجابة

## 📚 التوثيق والأمثلة

### ملفات التوثيق
- `README.md` - دليل المطور الرئيسي
- `csv-specifications.md` - مواصفات ملفات CSV
- `queries-examples.md` - عينات استعلامات جاهزة
- `project-structure.md` - هيكل المشروع والتنظيم

### أمثلة جاهزة للاستخدام
- عينات API مع الاستجابات المتوقعة
- أمثلة على معالجة الأخطاء
- سكريبتات تلقائية للمهام الدورية
- أمثلة تكامل مع التطبيقات

## 🔧 التكامل والنشر

### التكامل مع النظم الخارجية
- **البنوك**: تصدير ملفات دفعات بنكية
- **PSP**: تكامل مع مزودي الدفع الإلكتروني
- **المحاسبة**: تصدير البيانات للنظم المحاسبية
- **المراقبة**: تكامل مع أدوات المراقبة (Grafana, Prometheus)

### النشر والتشغيل
1. **التطوير**: بيئة محلية مع قاعدة بيانات محلية
2. **الاختبار**: بيئة staging مع بيانات تجريبية
3. **الإنتاج**: نشر مع مراقبة شاملة ونسخ احتياطية

## 🚀 الامتدادات المستقبلية

- **دعم عملات متعددة** (EUR, USD, AED)
- **تكامل مع بوابات دفع إضافية**
- **تحليلات متقدمة** للسلوك المالي
- **واجهات برمجة تطبيقات** للنظم الخارجية
- **تقارير مخصصة** حسب احتياجات العمل
- **ذكاء اصطناعي** للكشف عن الأنماط المالية

## 📞 الدعم والمساعدة

للحصول على المساعدة أو الإبلاغ عن مشاكل:
- **التوثيق**: راجع ملفات التوثيق أولاً
- **الأمثلة**: استخدم الأمثلة الجاهزة
- **الاختبارات**: تشغيل الاختبارات للتأكد من سلامة النظام
- **المراقبة**: تحقق من حالة النظام في لوحة المراقبة

---

**🎉 النظام جاهز بالكامل للاستخدام ويوفر إدارة مالية موثوقة وشاملة لمنصة Bthwani!**

جميع المكونات المطلوبة تم تنفيذها بنجاح مع ضمان الدقة والموثوقية في التعامل مع العمليات المالية المعقدة.
