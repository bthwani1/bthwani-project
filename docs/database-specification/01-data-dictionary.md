# قاموس البيانات الشامل لمنصة بثواني

## نظرة عامة
هذا القاموس يوثق جميع الكيانات والبيانات في نظام إدارة قاعدة البيانات لمنصة بثواني (bThwani). يشمل وصفاً مفصلاً لكل جدول/مجموعة، حقوله، أنواع البيانات، العلاقات، والفهارس.

## قاعدة البيانات الأساسية: MongoDB
- **نوع قاعدة البيانات**: NoSQL (MongoDB)
- **محرك التخزين**: WiredTiger
- **نسخة MongoDB**: 5.0+
- **استراتيجية النسخ الاحتياطي**: يومياً مع Point-in-Time Recovery

---

## الكيانات الأساسية

### 1. المستخدمين (Users)

**مجموعة**: `users`

| الحقل | النوع | مطلوب | فريد | وصف | مثال |
|--------|-------|--------|------|------|-------|
| `_id` | ObjectId | ✓ | ✓ | معرف فريد للمستخدم | `507f1f77bcf86cd799439011` |
| `fullName` | String | ✓ | ✗ | الاسم الكامل للمستخدم | "أحمد محمد علي" |
| `aliasName` | String | ✗ | ✗ | الاسم المستعار | "أحمد" |
| `email` | String | ✗ | ✓ | البريد الإلكتروني | "user@example.com" |
| `phone` | String | ✗ | ✓ | رقم الهاتف | "+967-1-234567" |
| `profileImage` | String | ✗ | ✗ | رابط صورة الملف الشخصي | "https://cdn.example.com/profile.jpg" |
| `emailVerified` | Boolean | ✗ | ✗ | حالة التحقق من البريد الإلكتروني | false |
| `classification` | String | ✗ | ✗ | تصنيف المستخدم | "regular", "bronze", "silver", "gold", "vip" |
| `role` | String | ✗ | ✗ | دور المستخدم | "user", "admin", "superadmin" |
| `negativeRatingCount` | Number | ✗ | ✗ | عدد التقييمات السلبية | 0 |
| `addresses` | Array | ✗ | ✗ | قائمة عناوين المستخدم | - |
| `defaultAddressId` | ObjectId | ✗ | ✗ | معرف العنوان الافتراضي | - |
| `isVerified` | Boolean | ✗ | ✗ | حالة التحقق من الهوية | false |
| `isBanned` | Boolean | ✗ | ✗ | حالة الحظر | false |
| `createdAt` | Date | ✓ | ✗ | تاريخ الإنشاء | ISO Date |
| `authProvider` | String | ✗ | ✗ | مزود المصادقة | "firebase", "local" |
| `firebaseUID` | String | ✗ | ✗ | معرف Firebase | "firebase_uid_123" |
| `loginHistory` | Array | ✗ | ✗ | سجل تسجيلات الدخول | - |
| `notificationsFeed` | Array | ✗ | ✗ | قائمة الإشعارات | - |
| `favorites` | Array[ObjectId] | ✗ | ✗ | قائمة المنتجات المفضلة | - |
| `language` | String | ✗ | ✗ | لغة التطبيق | "ar", "en" |
| `theme` | String | ✗ | ✗ | سمة التطبيق | "light", "dark" |
| `notifications` | Object | ✗ | ✗ | إعدادات الإشعارات | - |
| `isActive` | Boolean | ✗ | ✗ | حالة النشاط | true |
| `isBlacklisted` | Boolean | ✗ | ✗ | حالة القائمة السوداء | false |
| `pushToken` | String | ✗ | ✗ | رمز الإشعارات الفورية | - |
| `wallet` | Object | ✗ | ✗ | بيانات المحفظة | - |
| `security` | Object | ✗ | ✗ | إعدادات الأمان | - |
| `transactions` | Array | ✗ | ✗ | سجل المعاملات | - |
| `activityLog` | Array | ✗ | ✗ | سجل الأنشطة | - |

**الفهارس:**
```javascript
{
  "donationLocation": "2dsphere" // فهرس جغرافي (مُعلق حالياً)
},
{
  "createdAt": -1 // فهرس للترتيب الزمني
}
```

### 2. السائقين (Drivers)

**مجموعة**: `drivers`

| الحقل | النوع | مطلوب | فريد | وصف | مثال |
|--------|-------|--------|------|------|-------|
| `_id` | ObjectId | ✓ | ✓ | معرف فريد للسائق | `507f1f77bcf86cd799439012` |
| `fullName` | String | ✓ | ✗ | الاسم الكامل للسائق | "محمد أحمد علي" |
| `email` | String | ✓ | ✓ | البريد الإلكتروني | "driver@example.com" |
| `password` | String | ✓ | ✗ | كلمة المرور (مشفرة) | "$2a$10$..." |
| `phone` | String | ✓ | ✓ | رقم الهاتف | "+967-1-234567" |
| `location` | GeoJSON | ✓ | ✗ | موقع السائق الحالي | Point([lng, lat]) |
| `role` | String | ✓ | ✗ | نوع السائق | "rider_driver", "light_driver", "women_driver" |
| `vehicleType` | String | ✓ | ✗ | نوع المركبة | "motor", "bike", "car" |
| `vehicleClass` | String | ✗ | ✗ | تصنيف المركبة | "light", "medium", "heavy" |
| `vehiclePower` | Number | ✗ | ✗ | قوة المركبة | 150 (cc أو kW) |
| `driverType` | String | ✓ | ✗ | نوع المندوب | "primary", "joker" |
| `isAvailable` | Boolean | ✗ | ✗ | حالة التوفر | true |
| `isFemaleDriver` | Boolean | ✗ | ✗ | سائقة أنثى | false |
| `isVerified` | Boolean | ✗ | ✗ | حالة التحقق | false |
| `isBanned` | Boolean | ✗ | ✗ | حالة الحظر | false |
| `currentLocation` | Object | ✗ | ✗ | الموقع الحالي | {lat, lng, updatedAt} |
| `residenceLocation` | Object | ✓ | ✗ | عنوان السكن | {lat, lng, address, governorate, city} |
| `otherLocations` | Array | ✗ | ✗ | مواقع إضافية | - |
| `wallet` | Object | ✗ | ✗ | بيانات المحفظة | {balance, earnings, lastUpdated} |
| `deliveryStats` | Object | ✗ | ✗ | إحصائيات التوصيل | {deliveredCount, canceledCount, totalDistanceKm} |
| `jokerFrom` | Date | ✗ | ✗ | بداية فترة الجوكر | - |
| `jokerTo` | Date | ✗ | ✗ | نهاية فترة الجوكر | - |
| `glReceivableAccount` | ObjectId | ✗ | ✗ | حساب القبض المالي | - |
| `glDepositAccount` | ObjectId | ✗ | ✗ | حساب الإيداع المالي | - |

**الفهارس:**
```javascript
{
  "location": "2dsphere" // فهرس جغرافي للبحث عن السائقين حسب الموقع
}
```

### 3. الطلبات (Orders)

**مجموعة**: `deliveryorders`

| الحقل | النوع | مطلوب | فريد | وصف | مثال |
|--------|-------|--------|------|------|-------|
| `_id` | ObjectId | ✓ | ✓ | معرف فريد للطلب | `507f1f77bcf86cd799439013` |
| `user` | ObjectId | ✓ | ✗ | معرف المستخدم صاحب الطلب | Ref: users |
| `driver` | ObjectId | ✗ | ✗ | معرف السائق المكلف | Ref: drivers |
| `coupon` | Object | ✗ | ✗ | بيانات الكوبون المستخدم | - |
| `items` | Array | ✓ | ✗ | قائمة المنتجات في الطلب | - |
| `subOrders` | Array | ✓ | ✗ | الطلبات الفرعية لكل متجر | - |
| `price` | Number | ✓ | ✗ | السعر الإجمالي للمنتجات | 1500.50 |
| `deliveryFee` | Number | ✓ | ✗ | رسوم التوصيل | 300.00 |
| `companyShare` | Number | ✓ | ✗ | حصة الشركة | 150.00 |
| `platformShare` | Number | ✓ | ✗ | حصة المنصة | 50.00 |
| `walletUsed` | Number | ✗ | ✗ | المبلغ المستخدم من المحفظة | 1000.00 |
| `cashDue` | Number | ✗ | ✗ | المبلغ المستحق نقداً | 800.50 |
| `address` | Object | ✓ | ✗ | عنوان التوصيل | {label, street, city, location} |
| `deliveryMode` | String | ✗ | ✗ | طريقة التوصيل | "unified", "split" |
| `paymentMethod` | String | ✓ | ✗ | طريقة الدفع | "wallet", "card", "cash", "mixed" |
| `paid` | Boolean | ✗ | ✗ | حالة الدفع | false |
| `status` | String | ✓ | ✗ | حالة الطلب | "pending_confirmation", "under_review", etc. |
| `statusHistory` | Array | ✓ | ✗ | سجل تغييرات الحالة | - |
| `returnReason` | String | ✗ | ✗ | سبب الإرجاع/الإلغاء | - |
| `returnBy` | String | ✗ | ✗ | من قام بالإرجاع | "admin", "customer", "driver", "store" |
| `scheduledFor` | Date | ✗ | ✗ | موعد التوصيل المجدول | - |
| `assignedAt` | Date | ✗ | ✗ | تاريخ التكليف | - |
| `deliveredAt` | Date | ✗ | ✗ | تاريخ التوصيل | - |
| `deliveryReceiptNumber` | String | ✗ | ✓ | رقم سند التوصيل | "REC-2024-001" |
| `orderType` | String | ✗ | ✗ | نوع الطلب | "marketplace", "errand", "utility" |
| `errand` | Object | ✗ | ✗ | تفاصيل المهمة (إن وجدت) | - |
| `utility` | Object | ✗ | ✗ | تفاصيل الخدمة (إن وجدت) | - |
| `notes` | Array | ✗ | ✗ | ملاحظات الطلب | - |
| `rating` | Object | ✗ | ✗ | تقييم الطلب | {company, order, driver, comments} |

**الفهارس:**
```javascript
{
  "orderType": 1,
  "createdAt": -1 // فهرس مركب للبحث حسب النوع والتاريخ
},
{
  "errand.pickup.geo": "2dsphere", // فهرس جغرافي للمهام (مُعلق)
  sparse: true
},
{
  "errand.dropoff.geo": "2dsphere", // فهرس جغرافي للمهام (مُعلق)
  sparse: true
},
{
  "status": 1,
  "createdAt": -1 // فهرس لحالات الطلبات والتاريخ
},
{
  "address.city": 1 // فهرس حسب المدينة
},
{
  "subOrders.store": 1 // فهرس حسب المتجر
},
{
  "subOrders.driver": 1 // فهرس حسب السائق
},
{
  "items.store": 1 // فهرس حسب المتجر في العناصر
},
{
  "createdAt": -1 // فهرس للترتيب الزمني
},
{
  "user": 1,
  "createdAt": -1 // فهرس للطلبات حسب المستخدم
}
```

### 4. المتاجر (Delivery Stores)

**مجموعة**: `deliverystores`

| الحقل | النوع | مطلوب | فريد | وصف | مثال |
|--------|-------|--------|------|------|-------|
| `_id` | ObjectId | ✓ | ✓ | معرف فريد للمتجر | `507f1f77bcf86cd799439014` |
| `name` | String | ✓ | ✗ | اسم المتجر | "مطعم الرياض" |
| `description` | String | ✗ | ✗ | وصف المتجر | "مطعم متخصص في المأكولات العربية" |
| `logo` | String | ✗ | ✗ | شعار المتجر | "https://cdn.example.com/logo.jpg" |
| `coverImage` | String | ✗ | ✗ | صورة الغلاف | "https://cdn.example.com/cover.jpg" |
| `phone` | String | ✓ | ✗ | رقم هاتف المتجر | "+967-1-234567" |
| `email` | String | ✗ | ✗ | البريد الإلكتروني | "store@example.com" |
| `category` | String | ✓ | ✗ | فئة المتجر | "restaurant", "supermarket", "pharmacy" |
| `subcategory` | String | ✗ | ✗ | فئة فرعية | "fast_food", "organic" |
| `location` | GeoJSON | ✓ | ✗ | موقع المتجر | Point([lng, lat]) |
| `address` | Object | ✓ | ✗ | عنوان المتجر | {street, city, country, location} |
| `deliveryRadius` | Number | ✗ | ✗ | نصف قطر التوصيل (كم) | 5.0 |
| `minimumOrder` | Number | ✗ | ✗ | الحد الأدنى للطلب | 100.00 |
| `deliveryFee` | Number | ✗ | ✗ | رسوم التوصيل الأساسية | 50.00 |
| `isActive` | Boolean | ✗ | ✗ | حالة النشاط | true |
| `isVerified` | Boolean | ✗ | ✗ | حالة التحقق | false |
| `isOpen` | Boolean | ✗ | ✗ | حالة الافتتاح | true |
| `openingHours` | Array | ✗ | ✗ | ساعات العمل | - |
| `rating` | Object | ✗ | ✗ | تقييم المتجر | {average, count} |
| `wallet` | Object | ✗ | ✗ | بيانات المحفظة | {balance, totalEarnings} |
| `bankAccount` | Object | ✗ | ✗ | بيانات الحساب البنكي | - |
| `documents` | Array | ✗ | ✗ | المستندات المطلوبة | - |
| `createdBy` | ObjectId | ✓ | ✗ | معرف المدير المسؤول | Ref: users |

**الفهارس:**
```javascript
{
  "location": "2dsphere" // فهرس جغرافي للبحث عن المتاجر حسب الموقع
},
{
  "category": 1, // فهرس حسب الفئة
  "isActive": 1,
  "isOpen": 1
},
{
  "name": "text" // فهرس نصي للبحث في الأسماء
}
```

### 5. المنتجات (Products)

**مجموعة**: `products`

| الحقل | النوع | مطلوب | فريد | وصف | مثال |
|--------|-------|--------|------|------|-------|
| `_id` | ObjectId | ✓ | ✓ | معرف فريد للمنتج | `507f1f77bcf86cd799439015` |
| `name` | String | ✓ | ✗ | اسم المنتج | "برجر لحم بقري" |
| `description` | String | ✗ | ✗ | وصف المنتج | "برجر طازج مع الخضروات" |
| `images` | Array | ✗ | ✗ | صور المنتج | ["url1.jpg", "url2.jpg"] |
| `price` | Number | ✓ | ✗ | سعر المنتج | 150.00 |
| `discountPrice` | Number | ✗ | ✗ | سعر بعد الخصم | 120.00 |
| `category` | String | ✓ | ✗ | فئة المنتج | "food", "beverages", "desserts" |
| `subcategory` | String | ✗ | ✗ | فئة فرعية | "burgers", "pizza" |
| `store` | ObjectId | ✓ | ✗ | معرف المتجر المالك | Ref: deliverystores |
| `isAvailable` | Boolean | ✗ | ✗ | توفر المنتج | true |
| `isVegetarian` | Boolean | ✗ | ✗ | منتج نباتي | false |
| `isVegan` | Boolean | ✗ | ✗ | منتج نباتي صارم | false |
| `spicyLevel` | Number | ✗ | ✗ | مستوى الحرارة (1-5) | 3 |
| `calories` | Number | ✗ | ✗ | السعرات الحرارية | 450 |
| `ingredients` | Array | ✗ | ✗ | قائمة المكونات | ["لحم بقري", "خس", "طماطم"] |
| `allergens` | Array | ✗ | ✗ | قائمة المواد المسببة للحساسية | ["gluten", "dairy"] |
| `nutritionalInfo` | Object | ✗ | ✗ | المعلومات الغذائية | {protein, carbs, fat} |
| `preparationTime` | Number | ✗ | ✗ | وقت التحضير (دقائق) | 15 |
| `tags` | Array | ✗ | ✗ | وسوم البحث | ["حار", "سريع", "شعبي"] |
| `rating` | Object | ✗ | ✗ | تقييم المنتج | {average, count} |
| `stock` | Object | ✗ | ✗ | إدارة المخزون | {quantity, trackStock} |

**الفهارس:**
```javascript
{
  "store": 1, // فهرس حسب المتجر
  "category": 1
},
{
  "price": 1 // فهرس حسب السعر
},
{
  "name": "text", // فهرس نصي للبحث
  "description": "text"
},
{
  "tags": 1 // فهرس للوسوم
}
```

### 6. المحفظة الرقمية (Wallet)

**مجموعة**: `wallets`

| الحقل | النوع | مطلوب | فريد | وصف | مثال |
|--------|-------|--------|------|------|-------|
| `_id` | ObjectId | ✓ | ✓ | معرف فريد للمحفظة | `507f1f77bcf86cd799439016` |
| `user` | ObjectId | ✓ | ✗ | معرف صاحب المحفظة | Ref: users |
| `balance` | Number | ✓ | ✗ | الرصيد الحالي | 1500.00 |
| `currency` | String | ✗ | ✗ | العملة | "YER" |
| `isActive` | Boolean | ✗ | ✗ | حالة التفعيل | true |
| `isLocked` | Boolean | ✗ | ✗ | حالة القفل | false |
| `transactions` | Array | ✗ | ✗ | سجل المعاملات | - |
| `createdAt` | Date | ✓ | ✗ | تاريخ الإنشاء | ISO Date |

**الفهارس:**
```javascript
{
  "user": 1, // فهرس حسب المستخدم
  unique: true
},
{
  "balance": 1 // فهرس حسب الرصيد
}
```

### 7. معاملات المحفظة (Wallet Transactions)

**مجموعة**: `wallettransactions`

| الحقل | النوع | مطلوب | فريد | وصف | مثال |
|--------|-------|--------|------|------|-------|
| `_id` | ObjectId | ✓ | ✓ | معرف فريد للمعاملة | `507f1f77bcf86cd799439017` |
| `wallet` | ObjectId | ✓ | ✗ | معرف المحفظة | Ref: wallets |
| `user` | ObjectId | ✓ | ✗ | معرف المستخدم | Ref: users |
| `amount` | Number | ✓ | ✗ | المبلغ | 500.00 |
| `type` | String | ✓ | ✗ | نوع المعاملة | "credit", "debit" |
| `method` | String | ✓ | ✗ | طريقة المعاملة | "card", "transfer", "payment", "escrow" |
| `description` | String | ✗ | ✗ | وصف المعاملة | "شحن المحفظة عبر بطاقة ائتمان" |
| `reference` | String | ✗ | ✓ | مرجع خارجي فريد | "TXN_20240101_001" |
| `status` | String | ✓ | ✗ | حالة المعاملة | "pending", "completed", "failed", "cancelled" |
| `metadata` | Object | ✗ | ✗ | بيانات إضافية | {paymentGateway, transactionId} |
| `processedAt` | Date | ✗ | ✗ | تاريخ المعالجة | ISO Date |
| `createdAt` | Date | ✓ | ✗ | تاريخ الإنشاء | ISO Date |

**الفهارس:**
```javascript
{
  "wallet": 1, // فهرس حسب المحفظة
  "createdAt": -1
},
{
  "user": 1, // فهرس حسب المستخدم
  "createdAt": -1
},
{
  "reference": 1, // فهرس فريد للمرجع الخارجي
  unique: true,
  sparse: true
},
{
  "status": 1, // فهرس حسب الحالة
  "createdAt": -1
}
```

### 8. بوابات الدفع (Payment Gateways)

**مجموعة**: `paymentgateways`

| الحقل | النوع | مطلوب | فريد | وصف | مثال |
|--------|-------|--------|------|------|-------|
| `_id` | ObjectId | ✓ | ✓ | معرف فريد لبوابة الدفع | `507f1f77bcf86cd799439018` |
| `name` | String | ✓ | ✗ | اسم البوابة | "Stripe" |
| `provider` | String | ✓ | ✓ | مزود الخدمة | "stripe", "paypal", "local" |
| `isActive` | Boolean | ✗ | ✗ | حالة التفعيل | true |
| `isSandbox` | Boolean | ✗ | ✗ | وضع الاختبار | false |
| `credentials` | Object | ✓ | ✗ | بيانات الاعتماد (مشفرة) | {secretKey, publicKey} |
| `supportedCurrencies` | Array | ✓ | ✗ | العملات المدعومة | ["USD", "YER", "SAR"] |
| `webhookUrl` | String | ✗ | ✗ | رابط الـ Webhook | "https://api.example.com/webhooks/stripe" |
| `webhookSecret` | String | ✗ | ✗ | سر الـ Webhook | "whsec_..." |
| `feeStructure` | Object | ✗ | ✗ | هيكل الرسوم | {percentage, fixed} |
| `createdAt` | Date | ✓ | ✗ | تاريخ الإنشاء | ISO Date |

**الفهارس:**
```javascript
{
  "provider": 1, // فهرس حسب المزود
  unique: true
},
{
  "isActive": 1 // فهرس لحالات التفعيل
}
```

### 9. الإشعارات (Notifications)

**مجموعة**: `notifications`

| الحقل | النوع | مطلوب | فريد | وصف | مثال |
|--------|-------|--------|------|------|-------|
| `_id` | ObjectId | ✓ | ✓ | معرف فريد للإشعار | `507f1f77bcf86cd799439019` |
| `recipient` | ObjectId | ✓ | ✗ | معرف المستلم | Ref: users, drivers, stores |
| `recipientType` | String | ✓ | ✗ | نوع المستلم | "user", "driver", "store", "admin" |
| `title` | String | ✓ | ✗ | عنوان الإشعار | "طلب جديد" |
| `body` | String | ✓ | ✗ | نص الإشعار | "لديك طلب توصيل جديد" |
| `type` | String | ✓ | ✗ | نوع الإشعار | "order", "promotion", "system", "payment" |
| `priority` | String | ✗ | ✗ | الأولوية | "low", "normal", "high", "urgent" |
| `data` | Object | ✗ | ✗ | بيانات إضافية | {orderId, driverId} |
| `isRead` | Boolean | ✗ | ✗ | حالة القراءة | false |
| `readAt` | Date | ✗ | ✗ | تاريخ القراءة | ISO Date |
| `scheduledFor` | Date | ✗ | ✗ | موعد الإرسال المجدول | - |
| `sentAt` | Date | ✗ | ✗ | تاريخ الإرسال | ISO Date |
| `deliveredAt` | Date | ✗ | ✗ | تاريخ التسليم | ISO Date |
| `failedAt` | Date | ✗ | ✗ | تاريخ الفشل | ISO Date |
| `failureReason` | String | ✗ | ✗ | سبب الفشل | "Invalid push token" |
| `channels` | Array | ✓ | ✗ | قنوات الإرسال | ["push", "sms", "email"] |

**الفهارس:**
```javascript
{
  "recipient": 1, // فهرس حسب المستلم
  "createdAt": -1
},
{
  "recipientType": 1, // فهرس حسب نوع المستلم
  "isRead": 1,
  "createdAt": -1
},
{
  "type": 1, // فهرس حسب نوع الإشعار
  "createdAt": -1
},
{
  "scheduledFor": 1, // فهرس للإشعارات المجدولة
  sparse: true
}
```

### 10. تقييمات الخدمة (Ratings)

**مجموعة**: `ratings`

| الحقل | النوع | مطلوب | فريد | وصف | مثال |
|--------|-------|--------|------|------|-------|
| `_id` | ObjectId | ✓ | ✓ | معرف فريد للتقييم | `507f1f77bcf86cd799439020` |
| `order` | ObjectId | ✓ | ✗ | معرف الطلب | Ref: deliveryorders |
| `user` | ObjectId | ✓ | ✗ | معرف المستخدم المقيم | Ref: users |
| `driver` | ObjectId | ✓ | ✗ | معرف السائق المقيم | Ref: drivers |
| `store` | ObjectId | ✓ | ✗ | معرف المتجر المقيم | Ref: deliverystores |
| `company` | Number | ✓ | ✗ | تقييم الشركة (1-5) | 5 |
| `order` | Number | ✓ | ✗ | تقييم الطلب (1-5) | 4 |
| `driver` | Number | ✓ | ✗ | تقييم السائق (1-5) | 5 |
| `comments` | String | ✗ | ✗ | تعليقات إضافية | "خدمة ممتازة وسريعة" |
| `isAnonymous` | Boolean | ✗ | ✗ | تقييم مجهول | false |
| `createdAt` | Date | ✓ | ✗ | تاريخ التقييم | ISO Date |

**الفهارس:**
```javascript
{
  "order": 1, // فهرس فريد للطلب (لا يمكن تقييم نفس الطلب مرتين)
  unique: true
},
{
  "user": 1, // فهرس حسب المستخدم
  "createdAt": -1
},
{
  "driver": 1, // فهرس حسب السائق
  "createdAt": -1
},
{
  "store": 1, // فهرس حسب المتجر
  "createdAt": -1
}
```

---

## الكيانات الإدارية والنظام

### 11. المدراء (Admins)

**مجموعة**: `admins`

| الحقل | النوع | مطلوب | فريد | وصف | مثال |
|--------|-------|--------|------|------|-------|
| `_id` | ObjectId | ✓ | ✓ | معرف فريد للمدير | `507f1f77bcf86cd799439021` |
| `user` | ObjectId | ✓ | ✗ | معرف المستخدم | Ref: users |
| `role` | String | ✓ | ✗ | دور المدير | "super_admin", "admin", "moderator" |
| `permissions` | Array | ✓ | ✗ | قائمة الصلاحيات | ["orders.manage", "users.view"] |
| `isActive` | Boolean | ✗ | ✗ | حالة التفعيل | true |
| `lastLogin` | Date | ✗ | ✗ | آخر تسجيل دخول | ISO Date |
| `createdAt` | Date | ✓ | ✗ | تاريخ الإنشاء | ISO Date |

**الفهارس:**
```javascript
{
  "user": 1, // فهرس فريد للمستخدم
  unique: true
},
{
  "role": 1 // فهرس حسب الدور
}
```

### 12. سجل التدقيق (Audit Log)

**مجموعة**: `auditlogs`

| الحقل | النوع | مطلوب | فريد | وصف | مثال |
|--------|-------|--------|------|------|-------|
| `_id` | ObjectId | ✓ | ✓ | معرف فريد للسجل | `507f1f77bcf86cd799439022` |
| `user` | ObjectId | ✗ | ✗ | معرف المستخدم | Ref: users |
| `admin` | ObjectId | ✗ | ✗ | معرف المدير | Ref: admins |
| `action` | String | ✓ | ✗ | الإجراء المنفذ | "user.created", "order.updated" |
| `resource` | String | ✓ | ✗ | المورد المتأثر | "users", "orders", "products" |
| `resourceId` | String | ✗ | ✗ | معرف المورد | "507f1f77bcf86cd799439011" |
| `oldValues` | Object | ✗ | ✗ | القيم القديمة | - |
| `newValues` | Object | ✗ | ✗ | القيم الجديدة | - |
| `ipAddress` | String | ✗ | ✗ | عنوان IP | "192.168.1.1" |
| `userAgent` | String | ✗ | ✗ | بيانات المتصفح | "Mozilla/5.0..." |
| `metadata` | Object | ✗ | ✗ | بيانات إضافية | {sessionId, requestId} |
| `createdAt` | Date | ✓ | ✗ | تاريخ السجل | ISO Date |

**الفهارس:**
```javascript
{
  "user": 1, // فهرس حسب المستخدم
  "createdAt": -1
},
{
  "admin": 1, // فهرس حسب المدير
  "createdAt": -1
},
{
  "action": 1, // فهرس حسب الإجراء
  "createdAt": -1
},
{
  "resource": 1, // فهرس حسب المورد
  "resourceId": 1,
  "createdAt": -1
},
{
  "createdAt": -1 // فهرس زمني للتنظيف التلقائي
}
```

### 13. إعدادات النظام (System Settings)

**مجموعة**: `systemsettings`

| الحقل | النوع | مطلوب | فريد | وصف | مثال |
|--------|-------|--------|------|------|-------|
| `_id` | String | ✓ | ✓ | مفتاح الإعداد | "app.name" |
| `value` | Mixed | ✓ | ✗ | قيمة الإعداد | "بثواني" أو 1500 أو true |
| `type` | String | ✓ | ✗ | نوع القيمة | "string", "number", "boolean", "object", "array" |
| `category` | String | ✓ | ✗ | فئة الإعداد | "general", "payment", "notification" |
| `description` | String | ✗ | ✗ | وصف الإعداد | "اسم التطبيق المعروض للمستخدمين" |
| `isPublic` | Boolean | ✗ | ✗ | إعداد عام | false |
| `isEditable` | Boolean | ✗ | ✗ | قابل للتعديل | true |
| `validation` | Object | ✗ | ✗ | قواعد التحقق | {min, max, pattern} |
| `updatedBy` | ObjectId | ✗ | ✗ | معرف آخر من قام بالتعديل | Ref: admins |
| `updatedAt` | Date | ✓ | ✗ | تاريخ آخر تعديل | ISO Date |
| `createdAt` | Date | ✓ | ✗ | تاريخ الإنشاء | ISO Date |

**الفهارس:**
```javascript
{
  "_id": 1, // فهرس فريد للمفتاح
  unique: true
},
{
  "category": 1 // فهرس حسب الفئة
}
```

---

## الكيانات المالية

### 14. الحسابات المالية (Chart of Accounts)

**مجموعة**: `chartaccounts`

| الحقل | النوع | مطلوب | فريد | وصف | مثال |
|--------|-------|--------|------|------|-------|
| `_id` | ObjectId | ✓ | ✓ | معرف فريد للحساب | `507f1f77bcf86cd799439023` |
| `code` | String | ✓ | ✓ | رمز الحساب | "1101", "5101" |
| `name` | String | ✓ | ✗ | اسم الحساب | "النقدية في الصندوق" |
| `nameAr` | String | ✓ | ✗ | اسم الحساب بالعربية | "النقدية في الصندوق" |
| `type` | String | ✓ | ✗ | نوع الحساب | "asset", "liability", "equity", "revenue", "expense" |
| `category` | String | ✓ | ✗ | فئة الحساب | "current_assets", "fixed_assets", etc. |
| `subcategory` | String | ✗ | ✗ | فئة فرعية | "cash", "bank", "receivable" |
| `parent` | ObjectId | ✗ | ✗ | الحساب الأب | Ref: self |
| `level` | Number | ✓ | ✗ | مستوى الحساب | 1, 2, 3, 4 |
| `isActive` | Boolean | ✗ | ✗ | حالة التفعيل | true |
| `balance` | Number | ✗ | ✗ | الرصيد الحالي | 0.00 |
| `currency` | String | ✗ | ✗ | العملة | "YER" |
| `description` | String | ✗ | ✗ | وصف الحساب | "حساب النقدية في الصناديق الرئيسية" |
| `createdAt` | Date | ✓ | ✗ | تاريخ الإنشاء | ISO Date |

**الفهارس:**
```javascript
{
  "code": 1, // فهرس فريد لرمز الحساب
  unique: true
},
{
  "parent": 1, // فهرس حسب الحساب الأب
  sparse: true
},
{
  "type": 1, // فهرس حسب نوع الحساب
  "category": 1
}
```

### 15. القيود المالية (Journal Entries)

**مجموعة**: `journalentries`

| الحقل | النوع | مطلوب | فريد | وصف | مثال |
|--------|-------|--------|------|------|-------|
| `_id` | ObjectId | ✓ | ✓ | معرف فريد للقيد | `507f1f77bcf86cd799439024` |
| `date` | Date | ✓ | ✗ | تاريخ القيد | ISO Date |
| `reference` | String | ✓ | ✓ | مرجع القيد | "JE-2024-001" |
| `description` | String | ✓ | ✗ | وصف القيد | "إيرادات توصيل طلب رقم ORD-001" |
| `type` | String | ✓ | ✗ | نوع القيد | "general", "adjustment", "reversing" |
| `status` | String | ✓ | ✗ | حالة القيد | "draft", "posted", "cancelled" |
| `lines` | Array | ✓ | ✗ | سطور القيد | - |
| `totalDebit` | Number | ✓ | ✗ | إجمالي المدين | 1500.00 |
| `totalCredit` | Number | ✓ | ✗ | إجمالي الدائن | 1500.00 |
| `createdBy` | ObjectId | ✓ | ✗ | معرف صانع القيد | Ref: admins |
| `approvedBy` | ObjectId | ✗ | ✗ | معرف الموافق | Ref: admins |
| `approvedAt` | Date | ✗ | ✗ | تاريخ الموافقة | ISO Date |
| `metadata` | Object | ✗ | ✗ | بيانات إضافية | {source, relatedOrder} |

**الفهارس:**
```javascript
{
  "reference": 1, // فهرس فريد للمرجع
  unique: true
},
{
  "date": -1 // فهرس زمني
},
{
  "status": 1, // فهرس حسب الحالة
  "date": -1
},
{
  "createdBy": 1, // فهرس حسب صانع القيد
  "date": -1
}
```

---

## إحصائيات الفهارس والأداء

### إحصائيات عامة لقاعدة البيانات
- **إجمالي المجموعات**: 15 مجموعة رئيسية
- **إجمالي الفهارس**: 45 فهرس تقريباً
- **حجم البيانات المتوقع**: ينمو بنسبة 20-30% شهرياً
- **متوسط عدد الوثائق لكل مجموعة**:
  - `users`: 50,000 - 100,000
  - `drivers`: 5,000 - 10,000
  - `deliveryorders`: 100,000 - 200,000 شهرياً
  - `products`: 10,000 - 50,000
  - `notifications`: 500,000 - 1,000,000

### استراتيجية النسخ الاحتياطي
- **نوع النسخة**: MongoDB Backup (mongodump)
- **التكرار**: يومياً في منتصف الليل
- **الاحتفاظ**: 30 يوم للنسخ اليومية، 12 شهر للنسخ الشهرية
- **مكان التخزين**: محلي + سحابي (AWS S3)

### استراتيجية الصيانة
- **إعادة بناء الفهارس**: أسبوعياً
- **تنظيف السجلات القديمة**: شهرياً (سجلات أكثر من 6 أشهر)
- **تحسين التخزين**: شهرياً (compact)

---

*آخر تحديث: أكتوبر 2025*
*الإصدار: 1.0.0*
