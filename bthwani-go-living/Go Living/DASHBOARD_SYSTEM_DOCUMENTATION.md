# نظام لوحة التحكم - Bthwani Platform

## هيكل النظام والعمليات الأساسية

### 1. لوحة الإدارة العامة (Admin Overview Dashboard)

#### **الموقع**: `/admin/overview`
#### **الملف الرئيسي**: `admin-dashboard/src/pages/admin/OverviewPage.tsx`

#### **العمليات الرئيسية**:

**🔹 مؤشرات الأداء الرئيسية (KPIs):**
- `عدد الطلبات`: إجمالي الطلبات في الفترة المحددة
- `GMV`: إجمالي قيمة البضائع المباعة (سعر المنتجات + رسوم التوصيل)
- `إيراد المنصة`: عمولة المنصة من الطلبات
- `معدل الإلغاء`: نسبة الطلبات الملغاة
- `زمن التوصيل`: متوسط وقت التوصيل (متوسط/90%)

**🔹 عوامل التصفية:**
- **المنطقة الزمنية**: `Asia/Aden`, `Asia/Riyadh`, `UTC`
- **نطاق التاريخ**: `from` - `to` (YYYY-MM-DD)
- **تحديث فوري**: زر إعادة تحميل البيانات

**🔹 الرسوم البيانية التفاعلية:**
```typescript
// السلسلة الزمنية
metric: "orders" | "gmv" | "revenue"
interval: "day" | "hour"
// رسم منطقة مع تدرج لوني
```

**🔹 جدول أفضل الأداء:**
```typescript
by: "stores" | "cities" | "categories"
limit: 10
// مقاييس: الطلبات، GMV، الإيراد
```

**🔹 التنبيهات السريعة:**
- `طلبات بانتظار الشراء`
- `طلبات بانتظار الإسناد لكابتن`
- `طلبات متأخرة في التوصيل (>90 دقيقة)`

### 2. لوحة التسويق (Marketing Dashboard)

#### **الموقع**: `/marketing/dashboard`
#### **الملف الرئيسي**: `admin-dashboard/src/pages/marketing/Dashboard.tsx`

#### **العمليات الرئيسية**:

**🔹 مؤشرات عائد الإنفاق الإعلاني (ROAS):**
```typescript
interface RoasPoint {
  day: string;
  revenue: number;
  cost: number;
  conversions: number;
  roas: number;
  cpa: number;
}
```

**🔹 عوامل التصفية:**
- **نطاق التاريخ**: `from` - `to`
- **التجميع**: `source` | `campaign` | `none`

**🔹 الحسابات:**
```typescript
const totals = {
  rev: sum(revenue),
  cost: sum(cost),
  conv: sum(conversions)
};
const roas = cost > 0 ? rev / cost : Infinity;
```

### 3. لوحة عمليات السائقين (Ops Drivers Dashboard)

#### **الموقع**: `/admin/ops/drivers`
#### **الملف الرئيسي**: `admin-dashboard/src/pages/admin/ops/OpsDriversDashboard.tsx`

#### **العمليات الرئيسية**:

**🔹 الاتصال الفوري:**
```typescript
// WebSocket مع Fallback إلى Polling
const wsUrl = `ws://${location.host}/ws/admin/ops/drivers`;
const pollInterval = 4000; // 4 ثوانٍ
```

**🔹 هيكل بيانات السائق:**
```typescript
interface DriverRT {
  id: string;
  name: string;
  phone?: string;
  status: "online" | "busy" | "idle" | "offline";
  lat: number;
  lng: number;
  speed?: number;
  lastSeen: string;
  orderId?: string | null;
  city?: string;
  slaBreached?: boolean;
}
```

**🔹 الإجراءات التشغيلية:**
```typescript
action: "lock" | "ping" | "notify"
```

**🔹 التنبيهات التشغيلية:**
- `كباتن غير متصلين`: مراقبة فقدان الاتصال
- `خرق SLA`: طلبات متأخرة في التوصيل
- `كثافة طلبات عالية`: عندما تكون >70% من السائقين مشغولين

### 4. لوحة التقارير (Reports Dashboard)

#### **الموقع**: `/admin/reports`
#### **الملف الرئيسي**: `admin-dashboard/src/pages/admin/ReportsDashboardPage.tsx`

#### **العمليات الرئيسية**:

**🔹 المقاييس اللحظية:**
```typescript
interface RealtimeMetrics {
  activeUsers: number;
  currentOrders: number;
  revenueToday: number;
  systemHealth: "healthy" | "warning" | "critical";
}
```

**🔹 عوامل التصفية المتقدمة:**
- **نطاق التاريخ**: محدد بدقة باستخدام `DatePicker`
- **الفترة**: `daily` | `weekly` | `monthly` | `quarterly` | `yearly`
- **التصدير**: إمكانية تصدير التقارير الشاملة

## واجهات برمجة التطبيقات (APIs)

### 1. لوحة الإدارة العامة

#### `GET /admin/dashboard/summary`
**المعطيات**:
```typescript
{
  from: string;    // YYYY-MM-DD
  to: string;      // YYYY-MM-DD
  tz: string;      // Asia/Aden | Asia/Riyadh | UTC
}
```

**الاستجابة**:
```typescript
{
  range: { from: string, to: string },
  users: number,
  drivers: number,
  stores: number,
  orders: number,
  gmv: number,
  revenue: number,
  cancelRate: number,
  deliveryTime: {
    avgMin: number | null,
    p90Min: number | null
  },
  byStatus: Array<{status: string, count: number}>
}
```

#### `GET /admin/dashboard/timeseries`
**المعطيات**:
```typescript
{
  from: string,
  to: string,
  tz: string,
  metric: "orders" | "gmv" | "revenue",
  interval: "day" | "hour"
}
```

#### `GET /admin/dashboard/top`
**المعطيات**:
```typescript
{
  from: string,
  to: string,
  tz: string,
  by: "stores" | "cities" | "categories",
  limit: number // افتراضي 10
}
```

### 2. عمليات السائقين

#### `GET /admin/ops/drivers/realtime`
**الاستجابة**:
```typescript
{
  drivers: Array<{
    id: string,
    name: string,
    status: "online" | "busy" | "idle" | "offline",
    lat: number,
    lng: number,
    lastSeen: string,
    slaBreached?: boolean
  }>
}
```

#### `POST /admin/ops/drivers/{id}/actions`
**المعطيات**:
```typescript
{
  action: "lock" | "ping" | "notify",
  reason?: string
}
```

## نماذج قاعدة البيانات الأساسية

### نموذج الطلبات (Order)
```typescript
{
  _id: ObjectId,
  user: ObjectId,
  store: ObjectId,
  driver?: ObjectId,
  status: "placed" | "awaiting_procurement" | "procured" | "out_for_delivery" | "delivered" | "cancelled",
  items: Array<{
    product: ObjectId,
    quantity: number,
    price: number
  }>,
  price: number,
  deliveryFee: number,
  platformShare: number,
  address: {
    city: string,
    coordinates: [number, number]
  },
  createdAt: Date,
  deliveredAt?: Date
}
```

### نموذج السائقين (Driver)
```typescript
{
  _id: ObjectId,
  user: ObjectId,
  status: "online" | "busy" | "idle" | "offline",
  currentLocation: {
    lat: number,
    lng: number,
    lastUpdated: Date
  },
  documents: Array<{
    type: "license" | "vehicle" | "insurance",
    expiryDate: Date,
    status: "valid" | "expiring" | "expired"
  }>,
  totalDeliveries: number
}
```

## آليات العمل الأساسية

### 1. مراقبة الأداء
**حساب GMV:**
```javascript
const gmvExpr = { $add: ["$price", { $ifNull: ["$deliveryFee", 0] }] };
```

**حساب زمن التوصيل:**
```javascript
{
  $project: {
    deliveryMin: {
      $divide: [
        { $subtract: ["$deliveredAt", "$createdAt"] },
        1000 * 60
      ]
    }
  }
}
```

### 2. نظام التنبيهات
**الطلبات المتأخرة:**
```javascript
{
  status: "out_for_delivery",
  createdAt: { $lt: new Date(now.getTime() - 1000 * 60 * 90) }
}
```

### 3. الاتصال الفوري
**WebSocket مع Fallback:**
```javascript
const ws = new WebSocket(wsUrl);
ws.onmessage = (evt) => {
  const payload = JSON.parse(evt.data);
  if (Array.isArray(payload?.drivers)) {
    updateDrivers(payload.drivers);
  }
};
```

## هيكل المشروع المركز

```
admin-dashboard/src/pages/
├── admin/
│   └── OverviewPage.tsx          # لوحة الإدارة العامة
├── marketing/
│   └── Dashboard.tsx             # لوحة التسويق
├── drivers/
│   └── Dashboard.tsx             # لوحة السائقين
├── admin/ops/
│   └── OpsDriversDashboard.tsx   # عمليات السائقين
└── admin/
    └── ReportsDashboardPage.tsx  # لوحة التقارير

Backend/src/
├── controllers/admin/
│   └── dashboard.controller.ts   # منطق لوحة الإدارة
├── routes/admin/
│   └── dashboardOverview.routes.ts # مسارات لوحة الإدارة
└── models/
    ├── Order.ts                  # نموذج الطلبات
    ├── Driver.ts                 # نموذج السائقين
    └── DeliveryStore.ts          # نموذج المتاجر
```

هذا التوثيق يركز على العناصر الأساسية والعمليات الفعلية التي يقوم بها كل مكون في النظام.

## لوحات التحكم والواجهات

### 1. لوحة الإدارة العامة (Admin Overview Dashboard)

#### الموقع والوصول
- **المسار**: `/admin/overview`
- **الملف**: `admin-dashboard/src/pages/admin/OverviewPage.tsx`
- **الأذونات المطلوبة**: مسؤول النظام

#### الوظائف الرئيسية

##### مؤشرات الأداء الرئيسية (KPIs)
- **عدد الطلبات**: إجمالي الطلبات في الفترة المحددة
- **GMV (Gross Merchandise Value)**: إجمالي قيمة البضائع المباعة
- **إيراد المنصة**: عمولة المنصة من الطلبات
- **معدل الإلغاء**: نسبة الطلبات الملغاة
- **زمن التوصيل**: متوسط وقت التوصيل (متوسط/90%)

##### عوامل التصفية والتخصيص
- **المنطقة الزمنية**: Asia/Aden, Asia/Riyadh, UTC
- **نطاق التاريخ**: من تاريخ - إلى تاريخ
- **تحديث فوري**: زر لتحديث البيانات

##### الرسوم البيانية التفاعلية
- **السلسلة الزمنية**: رسم بياني للأداء حسب الفترة
- **نوع المقياس**: الطلبات، GMV، الإيراد
- **الفاصل الزمني**: يومي، ساعي
- **نوع الرسم**: منطقة مع تدرج لوني

##### جدول أفضل الأداء
- **تصنيف حسب**: المتاجر، المدن، التصنيفات
- **المقاييس**: الطلبات، GMV، الإيراد
- **الحد الأقصى**: 10 عناصر

##### التنبيهات السريعة
- **طلبات بانتظار الشراء**
- **طلبات بانتظار الإسناد لكابتن**
- **طلبات متأخرة في التوصيل (>90 دقيقة)**

##### توزيع الحالات
- جدول يوضح توزيع حالات الطلبات في الفترة المحددة

### 2. لوحة التسويق (Marketing Dashboard)

#### الموقع والوصول
- **المسار**: `/marketing/dashboard`
- **الملف**: `admin-dashboard/src/pages/marketing/Dashboard.tsx`
- **الأذونات المطلوبة**: فريق التسويق

#### الوظائف الرئيسية

##### مؤشرات عائد الإنفاق الإعلاني (ROAS)
- **الإيرادات**: إجمالي الإيرادات من الحملات
- **إنفاق الإعلانات**: التكلفة الإجمالية للإعلانات
- **التحويلات**: عدد التحويلات الناتجة
- **عائد الإنفاق الإعلاني**: ROAS = الإيرادات ÷ التكلفة

##### عوامل التصفية
- **نطاق التاريخ**: من تاريخ - إلى تاريخ
- **التجميع**: حسب المصدر، الحملة، بدون تجميع

##### الرسوم البيانية
- **الإيرادات مقابل الإنفاق**: رسم بياني خطي مقارن
- **البيانات**: نقاط ROAS مع التفاصيل اليومية

### 3. لوحة السائقين (Drivers Dashboard)

#### الموقع والوصول
- **المسار**: `/drivers/dashboard`
- **الملف**: `admin-dashboard/src/pages/drivers/Dashboard.tsx`
- **الأذونات المطلوبة**: فريق العمليات

#### الوظائف الرئيسية

##### مراقبة الامتثال
- **وثائق تنتهي خلال 30 يوم**: عدد الوثائق المقبلة على الانتهاء
- **آخر تجميع حضور**: تاريخ آخر تحديث للحضور
- **آخر وسم شفت**: تاريخ آخر تحديث للورديات

##### عوامل التصفية
- **البحث**: بالاسم أو رقم الهاتف
- **الحالة**: متصل، مشغول، خامل، غير متصل
- **المدينة**: تصفية حسب المدينة

### 4. لوحة التقارير والتحليلات (Reports Dashboard)

#### الموقع والوصول
- **المسار**: `/admin/reports`
- **الملف**: `admin-dashboard/src/pages/admin/ReportsDashboardPage.tsx`
- **الأذونات المطلوبة**: مسؤول النظام، محلل البيانات

#### الوظائف الرئيسية

##### المقاييس اللحظية
- **المستخدمين النشطين**: العدد الحالي للمستخدمين النشطين
- **الطلبات الحالية**: عدد الطلبات قيد التنفيذ
- **الإيرادات اليوم**: إجمالي الإيرادات لهذا اليوم
- **حالة النظام**: سليم، تحذير، حرج

##### عوامل التصفية المتقدمة
- **نطاق التاريخ**: محدد بدقة باستخدام منتقي التاريخ
- **الفترة**: يومي، أسبوعي، شهري، ربع سنوي، سنوي
- **التصدير**: إمكانية تصدير التقارير الشاملة

##### التحليلات المالية
- **إجمالي الإيرادات**: الإيرادات الإجمالية في الفترة
- **صافي الربح**: الأرباح بعد خصم التكاليف
- **المستوطنات المعلقة**: المدفوعات المعلقة للتجار

##### إحصائيات الطلبات
- **إجمالي الطلبات**: عدد جميع الطلبات
- **متوسط قيمة الطلب**: AOV
- **الطلبات المكتملة**: نسبة النجاح

##### تحليلات المستخدمين
- **إجمالي المستخدمين**: قاعدة المستخدمين الكاملة
- **المستخدمين النشطين**: المستخدمين النشطين حالياً
- **المستخدمين الجدد**: المستخدمين المسجلين حديثاً

##### تحليلات التجار
- **إجمالي التجار**: عدد التجار المسجلين
- **التجار النشطين**: التجار ذوي النشاط الحالي
- **متوسط التقييم**: رضا العملاء عن التجار

##### تحليلات السائقين
- **إجمالي السائقين**: عدد السائقين المسجلين
- **السائقين النشطين**: السائقين المتاحين للعمل
- **التوصيلات المكتملة**: إنجازات السائقين

##### نظرة عامة على النظام
- **إجمالي المستخدمين**
- **إجمالي الطلبات**
- **إجمالي الإيرادات**
- **النمو الشهري**

##### أفضل الأداء
- **أفضل المتاجر أداءً**: حسب الطلبات والإيرادات
- **أفضل العملاء**: حسب الطلبات والإنفاق

### 5. لوحة عمليات السائقين (Ops Drivers Dashboard)

#### الموقع والوصول
- **المسار**: `/admin/ops/drivers`
- **الملف**: `admin-dashboard/src/pages/admin/ops/OpsDriversDashboard.tsx`
- **الأذونات المطلوبة**: فريق العمليات، المشرفون

#### الوظائف الرئيسية

##### الاتصال الفوري
- **WebSocket مع Fallback**: اتصال فوري مع Polling احتياطي
- **تحديث تلقائي**: تحديث كل 4 ثوانٍ
- **حالة الاتصال**: مؤشر لحالة الاتصال بالمصدر اللحظي

##### عوامل التصفية والمراقبة
- **البحث**: بالاسم أو رقم الهاتف
- **الحالة**: متصل، مشغول، خامل، غير متصل
- **المدينة**: تصفية جغرافية
- **خريطة الحرارة**: إظهار النشاط في آخر ساعة

##### التنبيهات التشغيلية
- **كباتن غير متصلين**: مراقبة فقدان الاتصال
- **خرق SLA**: طلبات متأخرة في التوصيل
- **كثافة طلبات عالية**: عندما تكون >70% من السائقين مشغولين

##### الخريطة التفاعلية
- **خريطة OpenStreetMap**: عرض مواقع السائقين
- **علامات ملونة**: حسب حالة السائق
- **نوافذ معلومات**: تفاصيل السائق والطلب الحالي
- **عناصر تحكم**: أزرار للإجراءات (قفل، إشعار، إرسال تنبيه)

##### الإجراءات التشغيلية
- **قفل مؤقت**: تعطيل السائق مؤقتاً
- **إرسال إشارة**: Ping للتأكد من الاستجابة
- **إرسال تنبيه**: إشعار للسائق

## واجهات برمجة التطبيقات (APIs)

### 1. واجهات لوحة الإدارة العامة

#### `/admin/dashboard/summary`
**الطريقة**: GET
**الوصف**: جلب ملخص شامل للأداء
**المعطيات**:
- `from`: تاريخ البداية (YYYY-MM-DD)
- `to`: تاريخ النهاية (YYYY-MM-DD)
- `tz`: المنطقة الزمنية

**الاستجابة**:
```typescript
{
  range: { from: string, to: string },
  users: number,
  drivers: number,
  stores: number,
  orders: number,
  gmv: number,
  revenue: number,
  deliveryFees: number,
  cancelRate: number,
  deliveryTime: {
    avgMin: number | null,
    p90Min: number | null
  },
  byStatus: Array<{status: string, count: number}>
}
```

#### `/admin/dashboard/timeseries`
**الطريقة**: GET
**الوصف**: جلب البيانات الزمنية للرسوم البيانية
**المعطيات**:
- `from`, `to`, `tz`: نفس المعطيات السابقة
- `metric`: orders | gmv | revenue
- `interval`: day | hour

#### `/admin/dashboard/top`
**الطريقة**: GET
**الوصف**: جلب أفضل العناصر أداءً
**المعطيات**:
- `from`, `to`, `tz`: نفس المعطيات
- `by`: stores | cities | categories
- `limit`: عدد العناصر (افتراضي 10)

#### `/admin/dashboard/alerts`
**الطريقة**: GET
**الوصف**: جلب التنبيهات العاجلة
**الاستجابة**:
```typescript
{
  todayFrom: string,
  awaitingProcurement: number,
  awaitingAssign: number,
  overdueDeliveries: number
}
```

### 2. واجهات التسويق

#### `/marketing/roas`
**الطريقة**: GET
**الوصف**: جلب بيانات عائد الإنفاق الإعلاني
**المعطيات**:
- `from`, `to`: نطاق التاريخ
- `groupBy`: source | campaign | none

### 3. واجهات السائقين

#### `/drivers/health`
**الطريقة**: GET
**الوصف**: جلب حالة صحة نظام السائقين

#### `/admin/drivers/docs/expiring`
**الطريقة**: GET
**الوصف**: جلب الوثائق المقبلة على الانتهاء
**المعطيات**:
- `days`: عدد الأيام (افتراضي 30)

### 4. واجهات التقارير

#### `/admin/reports/system-overview`
**الطريقة**: GET
**الوصف**: جلب نظرة عامة على النظام

#### `/admin/reports/financial-summary`
**الطريقة**: GET
**الوصف**: جلب الملخص المالي

#### `/admin/reports/order-analytics`
**الطريقة**: GET
**الوصف**: جلب تحليلات الطلبات

#### `/admin/reports/user-analytics`
**الطريقة**: GET
**الوصف**: جلب تحليلات المستخدمين

#### `/admin/reports/vendor-analytics`
**الطريقة**: GET
**الوصف**: جلب تحليلات التجار

#### `/admin/reports/driver-analytics`
**الطريقة**: GET
**الوصف**: جلب تحليلات السائقين

#### `/admin/reports/realtime-metrics`
**الطريقة**: GET
**الوصف**: جلب المقاييس اللحظية

### 5. واجهات عمليات السائقين

#### `/admin/ops/drivers/realtime`
**الطريقة**: GET
**الوصف**: جلب بيانات السائقين الفورية
**المعطيات**:
- `city`: تصفية حسب المدينة (اختياري)

**الاستجابة**:
```typescript
{
  drivers: Array<{
    id: string,
    name: string,
    phone?: string,
    status: "online" | "busy" | "idle" | "offline",
    lat: number,
    lng: number,
    speed?: number,
    lastSeen: string,
    orderId?: string | null,
    city?: string,
    slaBreached?: boolean
  }>
}
```

#### `/admin/ops/heatmap`
**الطريقة**: GET
**الوصف**: جلب بيانات خريطة الحرارة
**المعطيات**:
- `from`, `to`: نطاق زمني للبيانات

#### `/admin/ops/drivers/{id}/actions`
**الطريقة**: POST
**الوصف**: تنفيذ إجراء على سائق محدد
**المعطيات**:
```typescript
{
  action: "lock" | "ping" | "notify",
  reason?: string
}
```

## قاعدة البيانات والنماذج

### النماذج الرئيسية

#### نموذج الطلبات (Order)
```typescript
{
  _id: ObjectId,
  user: ObjectId, // مرجع للمستخدم
  store: ObjectId, // مرجع للمتجر
  driver?: ObjectId, // مرجع للسائق (اختياري)
  status: "placed" | "awaiting_procurement" | "procured" | "out_for_delivery" | "delivered" | "cancelled",
  items: Array<{
    product: ObjectId,
    quantity: number,
    price: number
  }>,
  price: number, // سعر المنتجات
  deliveryFee: number, // رسوم التوصيل
  platformShare: number, // عمولة المنصة
  address: {
    city: string,
    district: string,
    street: string,
    coordinates: [number, number]
  },
  createdAt: Date,
  updatedAt: Date,
  deliveredAt?: Date,
  rating?: {
    company: number,
    order: number,
    driver: number
  }
}
```

#### نموذج السائقين (Driver)
```typescript
{
  _id: ObjectId,
  user: ObjectId, // مرجع للمستخدم
  status: "online" | "busy" | "idle" | "offline",
  currentLocation: {
    lat: number,
    lng: number,
    lastUpdated: Date
  },
  documents: Array<{
    type: "license" | "vehicle" | "insurance",
    number: string,
    expiryDate: Date,
    status: "valid" | "expiring" | "expired"
  }>,
  ratings: Array<{
    order: ObjectId,
    rating: number,
    comment?: string
  }>,
  totalDeliveries: number,
  createdAt: Date,
  updatedAt: Date
}
```

#### نموذج المتاجر (DeliveryStore)
```typescript
{
  _id: ObjectId,
  name: string,
  description?: string,
  owner: ObjectId,
  address: {
    city: string,
    district: string,
    street: string,
    coordinates: [number, number]
  },
  category: string,
  rating: number,
  totalOrders: number,
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### نموذج نقاط الدعم (SupportTicket)
```typescript
{
  _id: ObjectId,
  number: string, // رقم التذكرة
  subject: string,
  description: string,
  status: "new" | "open" | "pending" | "resolved" | "closed",
  priority: "low" | "medium" | "high" | "urgent",
  assignee?: string,
  group: string,
  channel: "web" | "mobile" | "phone" | "email",
  source: "customer" | "driver" | "vendor" | "internal",
  requester: {
    userId: string,
    phone?: string,
    email?: string
  },
  links: {
    orderId?: ObjectId,
    store?: ObjectId,
    driver?: ObjectId
  },
  tags: string[],
  firstResponseAt?: Date,
  resolvedAt?: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## الأمان والحماية

### آليات المصادقة
- **JWT Tokens**: للمصادقة عديمة الحالة
- **Refresh Tokens**: لتجديد الجلسات
- **Password Hashing**: bcrypt لتشفير كلمات المرور
- **Rate Limiting**: حماية من الهجمات المفرطة

### آليات الترخيص
- **Role-Based Access Control (RBAC)**: نظام أذونات مبني على الأدوار
- **Middleware**: فحص الأذونات في كل طلب
- **API Keys**: مفاتيح آمنة للوصول الخارجي

### مراقبة الأمان
- **Sentry Integration**: مراقبة الأخطاء والأداء
- **Audit Logging**: تسجيل جميع العمليات الحساسة
- **Data Validation**: التحقق من صحة البيانات
- **Input Sanitization**: تنظيف المدخلات

## مراقبة الأداء والأخطاء

### Sentry Configuration
```typescript
// bthwani-web/src/lib/sentry.ts
import { init, captureException, captureMessage } from '@sentry/react';
import { Replay } from '@sentry/replay';

init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [new Replay()],
});
```

### مراقبة الأداء
- **Performance Monitoring**: مراقبة سرعة الاستجابة
- **Error Tracking**: تتبع وتصنيف الأخطاء
- **User Session Replay**: إعادة تشغيل جلسات المستخدمين
- **Custom Metrics**: مقاييس مخصصة للأعمال

## هيكل المشروع

```
Bthwani Platform/
├── admin-dashboard/          # لوحة إدارة المشرفين
│   ├── src/
│   │   ├── components/       # المكونات المشتركة
│   │   ├── pages/           # صفحات لوحة التحكم
│   │   │   ├── admin/       # لوحة الإدارة العامة
│   │   │   ├── marketing/   # لوحة التسويق
│   │   │   ├── drivers/     # لوحة السائقين
│   │   │   ├── support/     # نظام الدعم الفني
│   │   │   └── ops/         # لوحة العمليات
│   │   ├── utils/           # الأدوات المساعدة
│   │   └── api/             # طبقة الـ API
│   ├── package.json
│   └── Dockerfile
├── Backend/                 # الخادم الخلفي
│   ├── src/
│   │   ├── controllers/     # منطق معالجة الطلبات
│   │   ├── models/          # نماذج قاعدة البيانات
│   │   ├── routes/          # تعريف المسارات
│   │   ├── middleware/      # الوسائط البرمجية
│   │   ├── utils/           # الأدوات المساعدة
│   │   └── services/        # الخدمات الخارجية
│   ├── package.json
│   └── Dockerfile
├── bthwani-web/            # التطبيق الرئيسي للعملاء
├── field-marketers/        # تطبيق المسوقين الميدانيين
├── rider-app/             # تطبيق السائقين
├── vendor-app/            # تطبيق التجار
└── docs/                  # التوثيق
    ├── api/               # توثيق API
    ├── deployment/        # دليل النشر
    ├── security/          # دليل الأمان
    └── monitoring/        # دليل المراقبة
```

## الاستنتاجات والتوصيات

### نقاط القوة
1. **تصميم شامل**: يغطي جميع جوانب العمليات التشغيلية
2. **أداء عالي**: استخدام تقنيات حديثة وفعالة
3. **مرونة عالية**: سهولة التخصيص والتطوير
4. **أمان متقدم**: حماية متعددة الطبقات
5. **تجربة مستخدم ممتازة**: واجهات بديهية وسهلة الاستخدام

### مجالات التطوير المقترحة
1. **التوسع الجغرافي**: دعم المزيد من الدول والعملات
2. **التكاملات الإضافية**: ربط مع خدمات خارجية أكثر
3. **الذكاء الاصطناعي**: استخدام ML للتنبؤ والتحسين
4. **تطبيق محمول**: تطوير تطبيقات native للهواتف
5. **اختبارات آلية**: زيادة تغطية الاختبارات

هذا النظام يمثل حلاً شاملاً ومتطوراً لإدارة منصات التجارة الإلكترونية والتوصيل، ويوفر أساساً قوياً للنمو والتوسع المستقبلي.
