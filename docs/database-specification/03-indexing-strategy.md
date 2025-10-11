# استراتيجية الفهارس للأداء المثالي

## نظرة عامة
توثق هذه الوثيقة استراتيجية الفهارس المثالية لقاعدة بيانات MongoDB في منصة بثواني. تم تصميم هذه الاستراتيجية بناءً على تحليل أنماط الاستعلامات الشائعة ومتطلبات الأداء.

## أهداف استراتيجية الفهارس

### الأهداف الرئيسية
1. **تقليل زمن الاستجابة** للاستعلامات بنسبة 80%
2. **دعم الاستعلامات المعقدة** مع فلاتر متعددة
3. **تحسين الأداء الجغرافي** للبحث حسب الموقع
4. **دعم الترتيب والتصفح** بكفاءة عالية
5. **تقليل استخدام الذاكرة** والمساحة التخزينية

### مقاييس الأداء المستهدفة
- **زمن الاستجابة**: < 100ms لـ 95% من الاستعلامات
- **معدل الاستعلامات**: > 1000 استعلام/ثانية
- **استخدام CPU**: < 70%
- **استخدام الذاكرة**: < 80%

## تحليل أنماط الاستعلامات

### 1. استعلامات البحث والفلترة

#### أ. البحث عن المتاجر حسب الموقع والفئة
```javascript
// استعلام شائع
db.deliverystores.find({
  "address.city": "صنعاء",
  category: "restaurant",
  isActive: true,
  isOpen: true,
  "location": {
    $near: {
      $geometry: { type: "Point", coordinates: [lng, lat] },
      $maxDistance: 5000
    }
  }
}).limit(20)
```

#### ب. البحث عن المنتجات حسب الاسم والسعر
```javascript
// استعلام شائع
db.products.find({
  $text: { $search: "برجر" },
  "store.category": "restaurant",
  price: { $lte: 1000 },
  isAvailable: true
}).sort({ score: { $meta: "textScore" } })
```

#### ج. البحث عن السائقين حسب الموقع والحالة
```javascript
// استعلام شائع
db.drivers.find({
  location: {
    $near: {
      $geometry: { type: "Point", coordinates: [lng, lat] },
      $maxDistance: 2000
    }
  },
  isAvailable: true,
  vehicleType: "car"
}).limit(10)
```

### 2. استعلامات التقارير والإحصائيات

#### أ. تقرير الطلبات حسب الفترة الزمنية
```javascript
// استعلام شائع للتقارير
db.deliveryorders.aggregate([
  {
    $match: {
      createdAt: {
        $gte: ISODate("2024-01-01"),
        $lt: ISODate("2024-02-01")
      },
      status: { $in: ["delivered", "cancelled"] }
    }
  },
  {
    $group: {
      _id: {
        day: { $dayOfMonth: "$createdAt" },
        status: "$status"
      },
      count: { $sum: 1 },
      totalRevenue: { $sum: "$price" }
    }
  }
])
```

#### ب. إحصائيات السائقين حسب الأداء
```javascript
// استعلام معقد للتقييم
db.drivers.aggregate([
  {
    $lookup: {
      from: "deliveryorders",
      localField: "_id",
      foreignField: "driver",
      as: "orders"
    }
  },
  {
    $match: {
      "orders.createdAt": {
        $gte: ISODate("2024-10-01")
      }
    }
  },
  {
    $project: {
      name: "$fullName",
      totalOrders: { $size: "$orders" },
      avgRating: { $avg: "$orders.rating.driver" },
      totalEarnings: { $sum: "$wallet.earnings" }
    }
  }
])
```

## استراتيجية الفهارس المثالية

### 1. فهارس الموقع الجغرافي (2dsphere)

#### متاجر حسب الموقع
```javascript
// فهرس مركب للبحث الجغرافي والفلترة
db.deliverystores.createIndex({
  "location": "2dsphere",
  "isActive": 1,
  "isOpen": 1,
  "category": 1
}, {
  name: "location_active_open_category"
})

// فهرس للبحث النصي مع الموقع
db.deliverystores.createIndex({
  "name": "text",
  "description": "text",
  "location": "2dsphere"
}, {
  name: "text_search_with_location"
})
```

#### سائقين حسب الموقع
```javascript
// فهرس مركب للسائقين
db.drivers.createIndex({
  "location": "2dsphere",
  "isAvailable": 1,
  "vehicleType": 1,
  "isVerified": 1
}, {
  name: "driver_location_availability"
})

// فهرس منفصل للموقع الحالي
db.drivers.createIndex({
  "currentLocation": "2dsphere"
}, {
  name: "current_location_index",
  sparse: true
})
```

#### طلبات حسب موقع التوصيل
```javascript
// فهرس جغرافي للطلبات
db.deliveryorders.createIndex({
  "address.location": "2dsphere",
  "status": 1,
  "createdAt": -1
}, {
  name: "order_delivery_location"
})
```

### 2. فهارس البحث النصي (Text Indexes)

#### منتجات حسب الاسم والوصف
```javascript
// فهرس نصي شامل للمنتجات
db.products.createIndex({
  "name": "text",
  "description": "text",
  "ingredients": "text",
  "tags": "text"
}, {
  name: "product_text_search",
  weights: {
    "name": 10,
    "description": 5,
    "ingredients": 3,
    "tags": 2
  }
})

// فهرس مركب للبحث المتقدم
db.products.createIndex({
  "store.category": 1,
  "isAvailable": 1,
  "price": 1,
  "$**": "text"
}, {
  name: "product_advanced_search"
})
```

### 3. فهارس الترتيب الزمني (Time-based)

#### طلبات حسب التاريخ والحالة
```javascript
// فهرس مركب للترتيب والفلترة
db.deliveryorders.createIndex({
  "status": 1,
  "createdAt": -1,
  "user": 1
}, {
  name: "order_status_date_user"
})

// فهرس للتقارير الشهرية
db.deliveryorders.createIndex({
  "createdAt": -1,
  "status": 1,
  "address.city": 1
}, {
  name: "order_monthly_reports"
})
```

#### إشعارات حسب التاريخ والمستلم
```javascript
// فهرس مركب للإشعارات
db.notifications.createIndex({
  "recipient": 1,
  "recipientType": 1,
  "isRead": 1,
  "createdAt": -1
}, {
  name: "notification_user_status"
})
```

### 4. فهارس المعاملات المالية

#### معاملات المحفظة
```javascript
// فهرس مركب للمعاملات
db.wallettransactions.createIndex({
  "wallet": 1,
  "user": 1,
  "status": 1,
  "createdAt": -1
}, {
  name: "wallet_transaction_composite"
})

// فهرس فريد للمرجع الخارجي
db.wallettransactions.createIndex({
  "reference": 1
}, {
  name: "wallet_transaction_reference",
  unique: true,
  sparse: true
})
```

#### القيود المالية حسب التاريخ
```javascript
// فهرس للقيود المالية
db.journalentries.createIndex({
  "date": -1,
  "status": 1,
  "type": 1
}, {
  name: "journal_entry_date_status"
})
```

### 5. فهارس الفهارس المؤقتة (TTL)

#### تنظيف السجلات التلقائي
```javascript
// إشعارات بعد 30 يوم
db.notifications.createIndex({
  "createdAt": 1
}, {
  name: "notification_ttl",
  expireAfterSeconds: 2592000 // 30 يوم
})

// سجلات التدقيق بعد 90 يوم
db.auditlogs.createIndex({
  "createdAt": 1
}, {
  name: "audit_log_ttl",
  expireAfterSeconds: 7776000 // 90 يوم
})

// رموز OTP بعد ساعة
db.otps.createIndex({
  "expiresAt": 1
}, {
  name: "otp_ttl",
  expireAfterSeconds: 3600 // ساعة واحدة
})
```

## استراتيجية الفهارس حسب الكيان

### جدول الفهارس لكل مجموعة

| المجموعة | اسم الفهرس | الحقول | نوع الفهرس | الغرض |
|-----------|-------------|---------|-------------|---------|
| **users** | `user_created_at` | `{createdAt: -1}` | فردي | ترتيب المستخدمين حسب تاريخ الإنشاء |
| **users** | `user_email_phone` | `{email: 1, phone: 1}` | فريد مركب | البحث السريع بالبريد أو الهاتف |
| **users** | `user_location_geo` | `{donationLocation: "2dsphere"}` | جغرافي | البحث حسب الموقع (مُعلق حالياً) |
| **drivers** | `driver_location_2dsphere` | `{location: "2dsphere"}` | جغرافي | البحث عن السائقين حسب الموقع |
| **drivers** | `driver_availability` | `{isAvailable: 1, vehicleType: 1}` | مركب | البحث عن السائقين المتاحين |
| **drivers** | `driver_current_location` | `{currentLocation: "2dsphere"}` | جغرافي | تتبع الموقع الحالي |
| **deliveryorders** | `order_status_date` | `{status: 1, createdAt: -1}` | مركب | ترتيب الطلبات حسب الحالة والتاريخ |
| **deliveryorders** | `order_user_date` | `{user: 1, createdAt: -1}` | مركب | طلبات المستخدم مرتبة زمنياً |
| **deliveryorders** | `order_driver_date` | `{driver: 1, createdAt: -1}` | مركب | طلبات السائق مرتبة زمنياً |
| **deliveryorders** | `order_location_geo` | `{address.location: "2dsphere"}` | جغرافي | البحث حسب موقع التوصيل |
| **products** | `product_text_search` | `{name: "text", description: "text"}` | نصي | البحث في النصوص |
| **products** | `product_store_category` | `{store: 1, category: 1, isAvailable: 1}` | مركب | منتجات المتجر مرتبة بالفئة |
| **wallets** | `wallet_user_balance` | `{user: 1, balance: -1}` | مركب | رصيد المستخدمين مرتب تنازلياً |
| **wallettransactions** | `wallet_tx_wallet_status` | `{wallet: 1, status: 1, createdAt: -1}` | مركب | معاملات المحفظة مرتبة زمنياً |
| **notifications** | `notification_recipient` | `{recipient: 1, recipientType: 1, isRead: 1}` | مركب | إشعارات المستلم مرتبة بالقراءة |
| **auditlogs** | `audit_log_user_action` | `{user: 1, action: 1, createdAt: -1}` | مركب | سجلات المستخدم مرتبة بالإجراء |

## استراتيجية الصيانة والمراقبة

### جدولة الصيانة

#### الصيانة اليومية (Daily)
- **إعادة بناء الفهارس**: 2:00 صباحاً
- **تحديث إحصائيات المجموعات**: 3:00 صباحاً
- **تنظيف الفهارس غير المستخدمة**: 4:00 صباحاً

#### الصيانة الأسبوعية (Weekly)
- **تحليل أداء الاستعلامات**: كل أحد 1:00 صباحاً
- **إعادة تنظيم البيانات**: كل أحد 2:00 صباحاً
- **تحديث مخطط الفهارس**: حسب الحاجة

#### الصيانة الشهرية (Monthly)
- **مراجعة استراتيجية الفهارس**: اليوم الأول من الشهر
- **تحسين التخزين**: منتصف الشهر
- **تقرير الأداء**: نهاية الشهر

### أدوات المراقبة

#### مؤشرات الأداء الرئيسية (KPIs)
```javascript
// مراقبة استخدام الفهارس
db.deliverystores.aggregate([
  {
    $indexStats: {}
  },
  {
    $project: {
      name: "$name",
      usageCount: "$accesses.ops",
      since: "$accesses.since"
    }
  }
])

// مراقبة الأداء العام
db.adminCommand({
  serverStatus: 1,
  indexStats: 1
})
```

#### تنبيهات الأداء
- **تحذير**: إذا زاد زمن الاستعلام عن 500ms
- **خطأ**: إذا زاد زمن الاستعلام عن 2000ms
- **حرج**: إذا فشل في الاستعلام لأكثر من 5 ثوانِ

### استراتيجية النسخ الاحتياطي للاستعادة

#### خطة الاستعادة من الفشل
1. **الكشف عن الفشل**: مراقبة تلقائية كل دقيقة
2. **التبديل التلقائي**: خلال 30 ثانية من الكشف
3. **استعادة الفهارس**: خلال 5 دقائق من التبديل
4. **التحقق من التكامل**: خلال 10 دقائق من الاستعادة

#### اختبار الاستعادة
- **تكرار الاختبار**: شهرياً
- **نطاق الاختبار**: جميع المجموعات الرئيسية
- **وقت الاستعادة المستهدف**: < 15 دقيقة

## تحسينات مستقبلية

### فهارس مقترحة للتطوير المستقبلي

#### 1. فهارس الذكاء الاصطناعي
```javascript
// فهرس للتوصيات الذكية
db.products.createIndex({
  "category": 1,
  "rating.average": -1,
  "price": 1,
  "isAvailable": 1
}, {
  name: "product_ai_recommendations"
})
```

#### 2. فهارس التحليلات المتقدمة
```javascript
// فهرس للتحليلات الزمنية
db.deliveryorders.createIndex({
  "createdAt": -1,
  "address.city": 1,
  "status": 1,
  "deliveryFee": 1
}, {
  name: "order_analytics_composite"
})
```

#### 3. فهارس البحث الدلالي
```javascript
// فهرس للبحث الدلالي (semantic search)
db.products.createIndex({
  "semanticVector": "2dsphere", // استخدام vector search
  "category": 1
}, {
  name: "product_semantic_search"
})
```

## ملخص الاستراتيجية

### إجمالي الفهارس المخططة
- **فهارس فردية**: 15 فهرس
- **فهارس مركبة**: 25 فهرس
- **فهارس جغرافية**: 5 فهارس
- **فهارس نصية**: 3 فهارس
- **فهارس TTL**: 3 فهارس

### تقدير المساحة التخزينية
- **حجم الفهارس**: 20-30% من حجم البيانات الأساسية
- **نمو متوقع**: 15-25% سنوياً مع نمو البيانات

### تكلفة الأداء المتوقعة
- **تحسين الأداء**: 60-80% في زمن الاستجابة
- **توفير في التكلفة**: 40-50% في استخدام الموارد

---

*آخر تحديث: أكتوبر 2025*
*الإصدار: 1.0.0*
