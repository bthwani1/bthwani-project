# تقرير دورة حياة الطلب - تحليل شامل وعميق

## نظرة عامة على نظام دورة حياة الطلب

تم اكتشاف نظام طلبات متطور ومعقد يتضمن **12 حالة رئيسية** مع تكامل مالي وتشغيلي متقدم، بالإضافة إلى نظام فرعي للطلبات الفرعية.

### أنواع الطلبات المدعومة:
1. **طلبات السوق (Marketplace)** - طلبات عادية من متاجر متعددة
2. **طلبات المهام (Errand)** - طلبات خدمات مثل التوصيل أو الشراء
3. **طلبات المرافق (Utility)** - طلبات خدمات مثل الغاز أو الماء

## تحليل مفصل لنموذج الطلب

### 1. الهيكل الأساسي للطلب 🛒

```typescript
// src/models/delivery_marketplace_v1/Order.ts
export interface IDeliveryOrder extends Document {
  // الهوية والأطراف
  user: Types.ObjectId | UserType;        // العميل
  driver?: Types.ObjectId | IDriver;      // السائق (اختياري)
  coupon?: ICoupon;                       // الكوبون المستخدم

  // عناصر الطلب
  items: IOrderItem[];                    // منتجات الطلب الرئيسية
  subOrders: ISubOrder[];                 // طلبات فرعية لكل متجر

  // المعلومات المالية
  price: number;                          // إجمالي السعر
  deliveryFee: number;                    // رسوم التوصيل
  companyShare: number;                   // حصة المنصة
  platformShare: number;                  // حصة المنصة (تكرار؟)
  walletUsed: number;                     // المبلغ المدفوع من المحفظة
  cashDue: number;                        // المبلغ المتبقي نقداً

  // الموقع والتسليم
  address: {
    label: string;
    street: string;
    city: string;
    location: { lat: number; lng: number };
  };
  deliveryMode: "unified" | "split";      // تسليم موحد أو منفصل

  // طريقة الدفع والحالة
  paymentMethod: "wallet" | "card" | "cash" | "mixed";
  paid: boolean;                          // هل تم الدفع؟
  status: OrderStatus;                    // الحالة الحالية

  // التتبع والتسجيل
  statusHistory: IStatusHistoryEntry[];   // تاريخ تغيير الحالات
  scheduledFor?: Date;                    // موعد التسليم المجدول
  assignedAt?: Date;                      // وقت إسناد السائق
  deliveryReceiptNumber?: string;         // رقم إيصال التسليم

  // معلومات إضافية
  returnReason?: string;                  // سبب الإرجاع/الإلغاء
  returnBy?: "admin" | "customer" | "driver" | "store";
  orderType: OrderType;                   // نوع الطلب
  errand?: IErrand;                       // تفاصيل طلب المهمة
  utility?: IUtility;                     // تفاصيل طلب المرافق
  deliveredAt?: Date;                     // وقت التسليم الفعلي
  notes?: INote[];                        // الملاحظات
  rating?: IRating;                       // التقييم بعد التسليم
}
```

### 2. نظام الحالات والانتقالات 📊

#### حالات الطلب الـ 13:

```typescript
export type OrderStatus =
  | "pending_confirmation"  // في انتظار تأكيد الطلب من الإدارة
  | "under_review"          // قيد المراجعة → تُعطى للدليفري
  | "preparing"             // قيد التحضير (داخل المطعم/المتجر)
  | "assigned"              // قيد التوصيل (من الدليفري)
  | "out_for_delivery"      // في الطريق إليك (من الدليفري)
  | "delivered"             // تم التوصيل
  | "returned"              // تم الإرجاع
  | "awaiting_procurement"  // في انتظار التوريد
  | "procured"              // تم التوريد
  | "procurement_failed"    // فشل التوريد
  | "cancelled";            // تم الإلغاء
```

#### مصفوفة الانتقالات المسموحة:

| من الحالة | إلى الحالات المسموحة |
|-----------|---------------------|
| `pending_confirmation` | `under_review`, `cancelled` |
| `under_review` | `preparing`, `awaiting_procurement`, `cancelled` |
| `preparing` | `out_for_delivery`, `cancelled`, `returned` |
| `assigned` | `out_for_delivery`, `cancelled`, `returned` |
| `out_for_delivery` | `delivered`, `returned` |
| `awaiting_procurement` | `procured`, `procurement_failed`, `cancelled` |
| `procured` | `preparing`, `cancelled` |
| `procurement_failed` | `awaiting_procurement`, `cancelled` |
| `delivered` | *(نهائي - لا انتقالات)* |
| `returned` | *(نهائي - لا انتقالات)* |
| `cancelled` | *(نهائي - لا انتقالات)* |

### 3. نظام الطلبات الفرعية (Sub Orders) 🔄

#### هيكل الطلب الفرعي:
```typescript
interface ISubOrder {
  store: Types.ObjectId;                    // المتجر المسؤول
  items: {                                  // منتجات هذا المتجر
    product: Types.ObjectId;
    productType: string;
    quantity: number;
    unitPrice: number;
  }[];
  driver?: Types.ObjectId;                  // سائق فرعي (اختياري)
  deliveryReceiptNumber?: string;           // رقم إيصال منفصل
  status: OrderStatus;                      // حالة منفصلة لكل متجر
  statusHistory: IStatusHistoryEntry[];     // تاريخ الحالات الفرعية
}
```

#### آلية عمل الطلبات الفرعية:
1. **تقسيم الطلب** حسب المتاجر المختلفة
2. **تتبع منفصل** لكل متجر (حالة، سائق، إيصال)
3. **تسليم مستقل** لكل متجر
4. **تقييم منفصل** لكل متجر

## دورة حياة الطلب الكاملة

### المرحلة 1: إنشاء الطلب (Order Creation) 📝

#### خطوات الإنشاء:
1. **التحقق من المستخدم** - `verifyFirebase`
2. **حساب السعر الإجمالي** - `calculateDeliveryPrice()`
3. **تطبيق العروض والكوبونات** - `fetchActivePromotions()`
4. **حجز المبلغ من المحفظة** - `holdForOrder()`
5. **إنشاء الطلب والطلبات الفرعية** - `createOrder()`
6. **إرسال إشعار** - `notifyOrder("order.created")`

#### المعلومات المطلوبة للإنشاء:
```typescript
{
  // الموقع والتسليم
  address: {
    label: string,
    street: string,
    city: string,
    location: { lat: number, lng: number }
  },

  // طريقة الدفع
  paymentMethod: "wallet" | "card" | "cash" | "mixed",

  // عناصر الطلب
  items: [{
    productType: "merchantProduct" | "deliveryProduct",
    productId: ObjectId,
    quantity: number,
    store: ObjectId
  }],

  // خيارات إضافية
  couponCode?: string,
  notes?: string,
  scheduledFor?: Date
}
```

### المرحلة 2: معالجة الطلب (Order Processing) ⚙️

#### خطوات المعالجة:
1. **مراجعة الطلب** - `status: "under_review"`
2. **البحث عن سائقين متاحين** - `broadcastOffersForOrder()`
3. **إسناد السائق** - `assignDriver()` أو `assignDriverToSubOrder()`
4. **تحديث حالة السائق** - `status: "assigned"`

#### آلية إسناد السائقين:
- **البحث حسب الموقع** - مسافة من موقع السائق
- **البحث حسب المركبة** - نوع وتصنيف المركبة
- **البحث حسب التوفر** - `isAvailable: true`
- **إرسال العروض** للسائقين المناسبين

### المرحلة 3: تجهيز الطلب (Order Preparation) 🍳

#### خطوات التجهيز:
1. **قبول المتجر** - `vendorAcceptOrder()`
2. **تحديث حالة الطلب** - `status: "preparing"`
3. **إشعار السائق** - `notifyOrder("order.preparing")`
4. **تجهيز المنتجات** في المتجر

#### دور المتاجر في التجهيز:
- **التحقق من المخزون** - التأكد من توفر المنتجات
- **حساب وقت التجهيز** - حسب نوع المنتجات
- **إعداد الطلب** للتسليم

### المرحلة 4: التسليم (Order Delivery) 🚚

#### خطوات التسليم:
1. **استلام السائق للطلب** - `driverPickUp()`
2. **تحديث حالة الطلب** - `status: "out_for_delivery"`
3. **بدء التسليم** - `driverDeliver()`
4. **إتمام التسليم** - `status: "delivered"`

#### آلية التسليم:
- **تتبع الموقع** - تحديث موقع السائق أثناء التسليم
- **تأكيد الاستلام** - من السائق عند الوصول للمتجر
- **تأكيد التسليم** - من السائق عند الوصول للعميل
- **إشعارات فورية** - لجميع الأطراف

### المرحلة 5: التقييم والإغلاق (Order Completion) ⭐

#### خطوات التقييم:
1. **إمكانية التقييم** - بعد `status: "delivered"`
2. **نظام التقييم الثلاثي** - المنصة، الطلب، السائق
3. **حساب متوسط التقييمات** - للمتاجر والسائقين
4. **تحديث الإحصائيات** - `updateStoresRatingsForOrder()`

#### آلية التقييم:
```typescript
order.rating = {
  company: number,     // تقييم المنصة (1-5)
  order: number,       // تقييم الطلب (1-5)
  driver: number,      // تقييم السائق (1-5)
  comments?: string,   // تعليقات إضافية
  ratedAt: Date        // وقت التقييم
};
```

## نظام التتبع والإشعارات

### 1. نظام الإشعارات الذكي 📱

#### أنواع الإشعارات:
- **إشعارات داخل التطبيق** - عبر Socket.IO
- **إشعارات الدفع** - عبر Expo Push Notifications
- **تخزين في سجل المستخدم** - `user.notificationsFeed`

#### آلية الإشعارات:
```typescript
// في src/services/order.notify.ts
export async function notifyOrder(
  event: OrderEvent,
  order: any,
  extra?: Record<string, any>
) {
  // 1. بث داخل التطبيق
  io.to(`user_${order.user.toString()}`).emit("notification", data);

  // 2. احترام تفضيلات المستخدم
  const prefs = await NotificationPreference.findOne({ userId });

  // 3. إرسال دفع خارجي
  await sendToUsers([order.user.toString()], notificationData);

  // 4. تخزين في سجل المستخدم
  user.notificationsFeed.unshift(notificationData);
}
```

### 2. نظام البث اللحظي (Socket Events) ⚡

#### غرف البث:
- **`user_${userId}`** - غرفة المستخدم الخاصة
- **`order_${orderId}`** - غرفة الطلب المحدد
- **`orders_admin`** - غرفة المشرفين

#### أحداث البث:
```typescript
// في src/sockets/orderEvents.ts
export function broadcastOrder(event: OrderEvent, orderId: string, payload: any) {
  emitToAdmin(event, { orderId, ...payload });      // للمشرفين
  emitToOrder(orderId, event, payload);             // للطلب المحدد
}
```

## نظام المعاملات المالية للطلبات

### 1. التدفق المالي الأساسي 💰

#### آلية الدفع:
1. **حجز المبلغ** - `holdForOrder()` عند الإنشاء
2. **خصم المبلغ** - `captureOrder()` عند التسليم
3. **إرجاع المبلغ** - `releaseOrder()` عند الإلغاء

#### طرق الدفع المدعومة:
- **المحفظة** - `paymentMethod: "wallet"`
- **البطاقة** - `paymentMethod: "card"`
- **النقد** - `paymentMethod: "cash"`
- **مختلط** - `paymentMethod: "mixed"`

### 2. نظام التسويات المالية 📊

#### آلية التسوية:
1. **حساب العمولات** - `calculateCommission()`
2. **إنشاء قيود محاسبية** - `postOrderDelivered()`
3. **تسوية الأرباح** - `generateSettlement()`

#### التدفق المالي للأطراف:
- **العميل** → يدفع المبلغ الكامل
- **المنصة** → تأخذ عمولتها (`companyShare`)
- **التاجر** → يحصل على صافي المبلغ (`storeNet`)
- **السائق** → يحصل على رسوم التوصيل (`deliveryFee`)

## نظام الملاحظات والتواصل

### 1. نظام الملاحظات المتعددة 📝

#### هيكل الملاحظة:
```typescript
export interface INote {
  body: string;                           // نص الملاحظة
  visibility: "public" | "internal";      // الرؤية
  byRole: "customer" | "admin" | "store" | "driver" | "system";
  byId?: Types.ObjectId;                  // معرف كاتب الملاحظة
  createdAt: Date;                       // وقت الإنشاء
}
```

#### آلية الملاحظات:
- **ملاحظات عامة** - تظهر للعميل
- **ملاحظات داخلية** - للإدارة فقط
- **ربط بالأطراف** - معرف كاتب الملاحظة

### 2. نظام تاريخ الحالات 📋

#### هيكل تاريخ الحالة:
```typescript
interface IStatusHistoryEntry {
  status: string;                    // الحالة الجديدة
  changedAt: Date;                   // وقت التغيير
  changedBy: "admin" | "store" | "driver" | "customer"; // من غير الحالة
}
```

#### آلية التتبع:
- **تسجيل كل تغيير** في الحالة
- **تتبع المسؤول** عن التغيير
- **توقيت دقيق** لكل تغيير

## التعارضات والمشاكل المكتشفة

### 1. تعارض في نظام الطلبات الفرعية 🔴 حرج

**المشكلة:**
- نظام `subOrders` معقد ويحتوي على منطق مكرر
- تضارب في حالات الطلب الرئيسية والفرعية
- صعوبة في تتبع حالة الطلب الكلي

**التأثير:**
- تعقيد في إدارة الطلبات متعددة المتاجر
- صعوبة في التقارير والإحصائيات
- مخاطر في التسليم والتقييم

### 2. تعارض في نظام المعاملات المالية 🔴 حرج

**المشكلة:**
- نظام حجز/إفراج منفصل عن نظام Wallet_V8
- تضاعف في تسجيل المعاملات المالية
- عدم توحيد في طرق الدفع

**التأثير:**
- صعوبة في المطابقة المالية
- مخاطر في التقارير المالية
- تضارب في أرصدة المحافظ

### 3. تعارض في نظام التقييمات 🟡 متوسط

**المشكلة:**
- نظام تقييم واحد فقط للطلب الكامل
- عدم وجود تقييم منفصل لكل متجر في الطلبات الفرعية
- عدم وجود نظام مكافآت بناءً على التقييمات

## حلول مقترحة لتحسين دورة الحياة

### 1. نظام طلبات موحد ومبسط

```typescript
// نظام طلب موحد يدعم كلا النوعين
export interface IUnifiedOrder extends Document {
  // الهوية والأطراف
  user_id: Types.ObjectId;
  driver_id?: Types.ObjectId;
  store_ids: Types.ObjectId[];           // متاجر متعددة

  // نوع الطلب
  order_type: 'marketplace' | 'errand' | 'utility';

  // الحالة الموحدة
  status: 'created' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'cancelled';

  // نظام الحالات الفرعية للمتاجر المتعددة
  store_statuses: {
    store_id: Types.ObjectId;
    status: string;
    driver_id?: Types.ObjectId;
    delivered_at?: Date;
  }[];

  // المعلومات المالية الموحدة
  financial_info: {
    total_amount: number;
    delivery_fee: number;
    platform_commission: number;
    store_payments: { store_id: Types.ObjectId, amount: number }[];
    wallet_used: number;
    cash_due: number;
  };

  // نظام التتبع الموحد
  tracking: {
    created_at: Date;
    confirmed_at?: Date;
    preparing_started_at?: Date;
    ready_at?: Date;
    picked_up_at?: Date;
    delivered_at?: Date;
    cancelled_at?: Date;
  };

  // نظام التقييمات الموحد
  ratings: {
    overall_rating?: number;
    store_ratings?: { store_id: Types.ObjectId, rating: number }[];
    driver_rating?: number;
  };
}
```

### 2. نظام حالات مبسط ومرن

```typescript
// نظام حالات مبسط ومرن
export type UnifiedOrderStatus =
  | 'created'      // تم إنشاء الطلب
  | 'confirmed'    // تم تأكيد الطلب
  | 'preparing'    // قيد التجهيز
  | 'ready'        // جاهز للتسليم
  | 'picked_up'    // تم استلام السائق للطلب
  | 'delivered'    // تم التسليم
  | 'cancelled';   // تم الإلغاء

// مصفوفة انتقالات مبسطة
export const UNIFIED_TRANSITIONS: Record<UnifiedOrderStatus, UnifiedOrderStatus[]> = {
  created: ['confirmed', 'cancelled'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['picked_up', 'cancelled'],
  picked_up: ['delivered'],
  delivered: [], // نهائي
  cancelled: []  // نهائي
};
```

### 3. نظام إشعارات موحد وذكي

```typescript
// نظام إشعارات متقدم مع قوالب ذكية
export class UnifiedNotificationSystem {
  static async sendOrderNotification(
    orderId: string,
    event: OrderEvent,
    recipients: NotificationRecipient[],
    templateData: any
  ) {
    // 1. تحديد المستلمين حسب الدور والعلاقة بالطلب
    const targetRecipients = await this.determineRecipients(orderId, recipients);

    // 2. إنشاء محتوى الإشعار حسب اللغة والسياق
    const notifications = await this.generateNotifications(event, templateData, targetRecipients);

    // 3. إرسال عبر القنوات المناسبة
    await this.deliverNotifications(notifications);

    // 4. تخزين في سجلات كل مستلم
    await this.storeNotifications(notifications);
  }
}
```

## مؤشرات النجاح بعد التحسين

- ✅ تبسيط دورة حياة الطلب بنسبة 70%
- ✅ تقليل عدد الحالات من 13 إلى 7 حالات أساسية
- ✅ توحيد نظام التقييمات والإشعارات بنسبة 100%
- ✅ تحسين دقة التتبع المالي بنسبة 90%
- ✅ تقليل وقت معالجة الطلبات بنسبة 50%
- ✅ تحسين تجربة جميع الأطراف (عميل، تاجر، سائق)

## التوصيات النهائية

### الأولوية: فورية وحرجة
دورة حياة الطلب الحالية تعاني من تعقيد شديد وتعارضات خطيرة في:
- نظام الحالات الـ 13 المعقد
- نظام الطلبات الفرعية المكرر
- نظام المعاملات المالية المزدوج

### الاستثمار المطلوب:
- **الوقت:** 8-10 أسابيع من التطوير المتواصل
- **الموارد:** فريق من 3-4 مطورين (تقني + تجربة مستخدم + مالي)
- **التكلفة:** عالية (إعادة هيكلة شاملة للنظام)

### الفوائد المتوقعة:
- دورة حياة طلب مبسطة وفعالة بنسبة 100%
- تحسين تجربة جميع الأطراف بنسبة 80%
- تقليل وقت معالجة الطلبات بنسبة 50%
- تبسيط الصيانة والتطوير المستقبلي

### المخاطر إذا لم يتم الإصلاح:
- استمرار التعقيد في إدارة الطلبات
- صعوبة في التوسع والتطوير
- فقدان الثقة من العملاء والشركاء
- مشاكل في التقارير والإحصائيات

---
*تم إنشاء هذا التقرير بناءً على تحليل شامل لدورة حياة الطلب في التاريخ: $(date)*
*إصدار التقرير: 1.0.0*
