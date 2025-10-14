# Database Indexes - الفهارس المطلوبة للأداء الأمثل

## 🎯 الغرض
هذا الملف يوثق الفهارس المركبة المطلوبة لتحسين أداء قاعدة البيانات.

---

## 📊 Wallet & Transactions

### WalletTransaction Collection
```javascript
// فهرس مركب للمستخدم + التاريخ (للصفحات المتعددة)
db.wallettransactions.createIndex({ userId: 1, createdAt: -1 });

// فهرس مركب للمستخدم + النوع (للفلترة)
db.wallettransactions.createIndex({ userId: 1, type: 1, createdAt: -1 });

// فهرس مركب للمستخدم + الطريقة (للتقارير)
db.wallettransactions.createIndex({ userId: 1, method: 1 });

// فهرس للمعاملات المعلقة مع الطلب
db.wallettransactions.createIndex({ status: 1, 'meta.orderId': 1 });

// فهرس للحالة + التاريخ (للإدارة)
db.wallettransactions.createIndex({ status: 1, createdAt: -1 });
```

### User Collection (Wallet Fields)
```javascript
// فهرس للرصيد والمبلغ المحجوز
db.users.createIndex({ 'wallet.balance': 1, 'wallet.onHold': 1 });

// فهرس للمحفظة + آخر تحديث
db.users.createIndex({ 'wallet.lastUpdated': -1 });
```

---

## 💰 Finance & Settlements

### Settlement Collection
```javascript
// فهرس مركب للكيان + الحالة
db.settlements.createIndex({ entity: 1, entityModel: 1, status: 1 });

// فهرس مركب للكيان + التاريخ
db.settlements.createIndex({ entity: 1, periodStart: -1, periodEnd: -1 });

// فهرس لرقم التسوية (فريد)
db.settlements.createIndex({ settlementNumber: 1 }, { unique: true });

// فهرس للحالة + التاريخ
db.settlements.createIndex({ status: 1, createdAt: -1 });

// فهرس للموافق عليه
db.settlements.createIndex({ approvedBy: 1, approvedAt: -1 });

// فهرس لدفعة الدفع
db.settlements.createIndex({ payoutBatch: 1 });
```

### PayoutBatch Collection
```javascript
// فهرس لرقم الدفعة (فريد)
db.payoutbatches.createIndex({ batchNumber: 1 }, { unique: true });

// فهرس للحالة + التاريخ
db.payoutbatches.createIndex({ status: 1, createdAt: -1 });

// فهرس للمعتمد
db.payoutbatches.createIndex({ processedBy: 1, processedAt: -1 });
```

### Commission Collection
```javascript
// فهرس مركب للمرجع + النوع
db.commissions.createIndex({ referenceId: 1, referenceModel: 1 });

// فهرس مركب للمسوق + التاريخ
db.commissions.createIndex({ marketerId: 1, createdAt: -1 });

// فهرس للحالة + التاريخ
db.commissions.createIndex({ status: 1, paidAt: -1 });
```

---

## 📦 Orders

### Order Collection
```javascript
// فهرس مركب للمستخدم + الحالة + التاريخ
db.orders.createIndex({ user: 1, status: 1, createdAt: -1 });

// فهرس مركب للسائق + الحالة
db.orders.createIndex({ driver: 1, status: 1, createdAt: -1 });

// فهرس مركب للتاجر + الحالة
db.orders.createIndex({ vendor: 1, status: 1, createdAt: -1 });

// فهرس للحالة + التاريخ (للتقارير)
db.orders.createIndex({ status: 1, createdAt: -1 });

// فهرس للطلبات النشطة فقط
db.orders.createIndex(
  { status: 1, createdAt: -1 },
  { partialFilterExpression: { status: { $in: ['pending', 'processing', 'assigned'] } } }
);

// فهرس مركب للتسليم المكتمل في فترة (للتسويات)
db.orders.createIndex({ status: 1, vendor: 1, createdAt: -1 });
db.orders.createIndex({ status: 1, driver: 1, createdAt: -1 });
```

---

## 🔔 Notifications

### Notification Collection
```javascript
// فهرس مركب للمستخدم + حالة القراءة + التاريخ
db.notifications.createIndex({ user: 1, isRead: 1, createdAt: -1 });

// فهرس للإشعارات غير المقروءة
db.notifications.createIndex(
  { user: 1, createdAt: -1 },
  { partialFilterExpression: { isRead: false } }
);

// فهرس للنوع + التاريخ
db.notifications.createIndex({ type: 1, createdAt: -1 });
```

---

## 🚗 Drivers

### Driver Collection
```javascript
// فهرس جغرافي للموقع
db.drivers.createIndex({ currentLocation: '2dsphere' });

// فهرس للحالة + التوفر
db.drivers.createIndex({ status: 1, isAvailable: 1 });

// فهرس مركب للحالة + المدينة
db.drivers.createIndex({ status: 1, city: 1 });
```

---

## 🏪 Vendors & Products

### Product Collection
```javascript
// فهرس مركب للمتجر + الحالة
db.products.createIndex({ store: 1, isActive: 1 });

// فهرس مركب للفئة + الحالة
db.products.createIndex({ category: 1, isActive: 1 });

// فهرس نصي للبحث
db.products.createIndex({ name: 'text', description: 'text', nameAr: 'text', descriptionAr: 'text' });
```

---

## 🎯 Marketers

### Marketer Collection
```javascript
// فهرس لرمز الإحالة (فريد)
db.marketers.createIndex({ referralCode: 1 }, { unique: true });

// فهرس للحالة + التاريخ
db.marketers.createIndex({ status: 1, createdAt: -1 });
```

### ReferralEvent Collection
```javascript
// فهرس مركب للمسوق + التاريخ
db.referralevents.createIndex({ marketerId: 1, createdAt: -1 });

// فهرس للمستخدم المحال
db.referralevents.createIndex({ referredUserId: 1 });

// فهرس للعمولة
db.referralevents.createIndex({ commissionId: 1 });
```

---

## 📈 Analytics

### MarketingEvent Collection
```javascript
// فهرس مركب للنوع + التاريخ
db.marketingevents.createIndex({ eventType: 1, eventDate: -1 });

// فهرس للمصدر + التاريخ
db.marketingevents.createIndex({ source: 1, eventDate: -1 });

// فهرس للحملة + التاريخ
db.marketingevents.createIndex({ campaign: 1, eventDate: -1 });
```

---

## 🔧 تطبيق الفهارس

### طريقة التطبيق (MongoDB Shell)
```bash
# الاتصال بقاعدة البيانات
mongosh "mongodb://localhost:27017/bthwani"

# تطبيق جميع الفهارس
# نسخ والصق الأوامر أعلاه
```

### طريقة التطبيق (NestJS Migration)
يمكن إنشاء migration script في NestJS:

```typescript
// src/database/migrations/add-indexes.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class AddIndexesMigration implements OnModuleInit {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async onModuleInit() {
    if (process.env.RUN_MIGRATIONS === 'true') {
      await this.createIndexes();
    }
  }

  private async createIndexes() {
    // WalletTransaction indexes
    await this.connection.collection('wallettransactions').createIndex(
      { userId: 1, createdAt: -1 },
    );
    // ... المزيد من الفهارس
  }
}
```

---

## 📊 مراقبة الأداء

### التحقق من استخدام الفهارس
```javascript
// في MongoDB Shell
db.wallettransactions.find({ userId: ObjectId("...") }).explain("executionStats");

// التحقق من جميع الفهارس
db.wallettransactions.getIndexes();
```

### إحصائيات الفهارس
```javascript
db.wallettransactions.aggregate([
  { $indexStats: {} }
]);
```

---

## ⚠️ ملاحظات مهمة

1. **Performance**: الفهارس تحسن السرعة لكن تبطئ الكتابة قليلاً
2. **Storage**: الفهارس تستهلك مساحة تخزين إضافية
3. **Compound Indexes**: ترتيب الحقول مهم جداً
4. **Partial Indexes**: استخدمها للاستعلامات المحددة
5. **Text Indexes**: واحد فقط لكل collection
6. **2dsphere**: للبحث الجغرافي

---

## ✅ الأولويات

### Priority 1 - حرج (Critical)
- WalletTransaction: userId + createdAt
- Order: user + status + createdAt
- Settlement: entity + status

### Priority 2 - مهم (Important)
- Driver: currentLocation (geospatial)
- Product: store + isActive
- Notification: user + isRead + createdAt

### Priority 3 - تحسين (Optimization)
- Analytics indexes
- Text search indexes
- Partial indexes للاستعلامات المحددة

