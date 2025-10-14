# 🔄 Event Sourcing للعمليات المالية

## نظام Event Sourcing لمحفظة Bthwani

Event Sourcing هو نمط معماري يحفظ جميع التغييرات التي تحدث على البيانات كسلسلة من الأحداث (Events)، بدلاً من حفظ الحالة النهائية فقط.

## 🎯 لماذا Event Sourcing للعمليات المالية؟

### المزايا:
✅ **Audit Trail كامل** - سجل دائم لكل حدث مالي  
✅ **Time Travel** - إمكانية معرفة الحالة في أي وقت سابق  
✅ **Debugging** - سهولة تتبع المشاكل والأخطاء  
✅ **Compliance** - الامتثال للمتطلبات القانونية  
✅ **Data Recovery** - إمكانية إعادة بناء الحالة من الأحداث  
✅ **Analytics** - تحليلات عميقة لسلوك المستخدمين  

## 📊 البنية المعمارية

```
┌─────────────────────────────────────────────────┐
│           Wallet Operations                     │
│  (deposit, withdrawal, hold, release, etc.)     │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│         Event Creation & Storage                │
│     (WalletEventService.createEvent)            │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│            Event Store (MongoDB)                │
│         Collection: wallet_events               │
│  [Event1] → [Event2] → [Event3] → ...          │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│          State Calculation                      │
│   (calculateStateFromEvents)                    │
│   Current Balance = Sum of all events           │
└─────────────────────────────────────────────────┘
```

## 🏗️ هيكل الأحداث

### WalletEvent Entity

```typescript
{
  userId: ObjectId,              // المستخدم
  eventType: WalletEventType,    // نوع الحدث
  amount: number,                // المبلغ
  timestamp: Date,               // وقت الحدث
  sequence: number,              // الرقم التسلسلي
  aggregateId: string,           // معرف فريد
  metadata: {
    transactionId: string,
    orderId: string,
    description: string,
    previousBalance: number,
    newBalance: number,
    ...
  },
  correlationId: string,         // لربط الأحداث المرتبطة
  causationId: string,           // الحدث الذي سبب هذا الحدث
  isReplayed: boolean,           // هل تم إعادة التشغيل
  replayedAt: Date
}
```

### أنواع الأحداث (WalletEventType)

```typescript
enum WalletEventType {
  DEPOSIT = 'DEPOSIT',              // إيداع
  WITHDRAWAL = 'WITHDRAWAL',        // سحب
  HOLD = 'HOLD',                    // حجز مبلغ
  RELEASE = 'RELEASE',              // إطلاق المبلغ المحجوز
  REFUND = 'REFUND',                // استرجاع
  TRANSFER_OUT = 'TRANSFER_OUT',    // تحويل صادر
  TRANSFER_IN = 'TRANSFER_IN',      // تحويل وارد
  TOPUP = 'TOPUP',                  // شحن
  BILL_PAYMENT = 'BILL_PAYMENT',    // دفع فاتورة
  COMMISSION = 'COMMISSION',        // عمولة
}
```

## 💻 الاستخدام

### 1. إنشاء حدث جديد

```typescript
import { WalletEventService } from './services/wallet-event.service';

@Injectable()
export class WalletService {
  constructor(
    private readonly walletEventService: WalletEventService
  ) {}

  async deposit(userId: string, amount: number) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      // إنشاء الحدث
      await this.walletEventService.createEvent({
        userId,
        eventType: WalletEventType.DEPOSIT,
        amount,
        metadata: {
          description: 'شحن المحفظة',
          method: 'kuraimi',
          transactionId: 'TXN-123'
        }
      }, session);

      // تحديث الحالة
      await this.userModel.findByIdAndUpdate(
        userId,
        { $inc: { 'wallet.balance': amount } },
        { session }
      );

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
```

### 2. جلب سجل الأحداث

```typescript
// جلب جميع الأحداث لمستخدم
const events = await walletEventService.getUserEvents(userId);

// جلب الأحداث من sequence معين
const recentEvents = await walletEventService.getUserEvents(
  userId,
  fromSequence: 100,
  limit: 50
);
```

### 3. حساب الحالة من الأحداث

```typescript
// حساب حالة المحفظة من جميع الأحداث
const state = await walletEventService.calculateStateFromEvents(userId);

console.log(state);
// {
//   balance: 1000,
//   onHold: 50,
//   totalEarned: 1500,
//   totalSpent: 500
// }
```

### 4. تدقيق المحفظة (Audit)

```typescript
// التحقق من صحة حالة المحفظة
const audit = await walletEventService.auditUserWallet(userId);

if (!audit.isValid) {
  console.error('تناقض في البيانات!', {
    currentBalance: audit.currentBalance,
    calculatedBalance: audit.calculatedBalance,
    difference: audit.difference
  });
}
```

### 5. إعادة بناء الحالة (Event Replay)

```typescript
// إعادة بناء حالة المحفظة من الأحداث
const result = await walletEventService.replayEvents(userId);

console.log(result);
// {
//   success: true,
//   eventsReplayed: 150,
//   finalBalance: 1000,
//   finalOnHold: 50
// }
```

## 📊 API Endpoints

### GET /api/v2/wallet/events
جلب سجل الأحداث المالية

**Query Parameters:**
- `fromSequence` (optional): الرقم التسلسلي للبدء منه
- `limit` (optional): عدد الأحداث (default: 1000)

**Response:**
```json
[
  {
    "_id": "65abc...",
    "userId": "123",
    "eventType": "DEPOSIT",
    "amount": 100,
    "timestamp": "2025-10-14T10:00:00Z",
    "sequence": 1,
    "metadata": {
      "description": "شحن المحفظة",
      "method": "kuraimi"
    }
  }
]
```

### GET /api/v2/wallet/audit
تدقيق حالة المحفظة

**Response:**
```json
{
  "isValid": true,
  "currentBalance": 1000,
  "calculatedBalance": 1000,
  "difference": 0,
  "details": "Wallet state matches event history"
}
```

### POST /api/v2/wallet/replay (Admin Only)
إعادة بناء حالة المحفظة من الأحداث

**Body:**
```json
{
  "userId": "65abc..."
}
```

**Response:**
```json
{
  "success": true,
  "eventsReplayed": 150,
  "finalBalance": 1000,
  "finalOnHold": 50
}
```

### GET /api/v2/wallet/statistics
إحصائيات الأحداث المالية

**Response:**
```json
{
  "totalEvents": 150,
  "byType": {
    "DEPOSIT": 50,
    "WITHDRAWAL": 30,
    "HOLD": 20,
    "RELEASE": 20,
    "TRANSFER_IN": 15,
    "TRANSFER_OUT": 15
  },
  "totalAmount": {
    "deposited": 5000,
    "withdrawn": 2000,
    "held": 500,
    "released": 450
  },
  "firstEvent": "2025-01-01T00:00:00Z",
  "lastEvent": "2025-10-14T10:00:00Z"
}
```

## 🔍 حالات الاستخدام

### 1. Time Travel - معرفة الرصيد في وقت سابق

```typescript
async getBalanceAtTime(userId: string, targetDate: Date) {
  const events = await this.walletEventModel
    .find({
      userId,
      timestamp: { $lte: targetDate }
    })
    .sort({ sequence: 1 });

  let balance = 0;
  events.forEach(event => {
    if (event.eventType === 'DEPOSIT') balance += event.amount;
    if (event.eventType === 'WITHDRAWAL') balance -= event.amount;
    // ... etc
  });

  return balance;
}

// الاستخدام
const balanceYesterday = await getBalanceAtTime(
  userId,
  new Date('2025-10-13')
);
```

### 2. تتبع معاملة معينة

```typescript
// جلب جميع الأحداث المرتبطة بمعاملة
const events = await walletEventService.getCorrelatedEvents(
  correlationId: 'TXN-123'
);

// مثال: تحويل بين مستخدمين
// Event 1: TRANSFER_OUT (User A)
// Event 2: TRANSFER_IN (User B)
// نفس correlationId لربطهما
```

### 3. اكتشاف التناقضات

```typescript
// تشغيل دوري (Cron Job) للتدقيق
@Cron('0 0 * * *') // كل يوم عند منتصف الليل
async auditAllWallets() {
  const users = await this.userModel.find();
  
  for (const user of users) {
    const audit = await this.walletEventService.auditUserWallet(
      user._id.toString()
    );
    
    if (!audit.isValid) {
      this.logger.error(
        `Discrepancy found for user ${user._id}`,
        { audit }
      );
      
      // إرسال تنبيه للإدارة
      await this.notifyAdmin(audit);
      
      // إعادة بناء الحالة تلقائياً
      await this.walletEventService.replayEvents(
        user._id.toString()
      );
    }
  }
}
```

### 4. تحليلات متقدمة

```typescript
// تحليل أنماط الإنفاق
async analyzeSpendingPattern(userId: string) {
  const events = await this.walletEventService.getUserEvents(userId);
  
  const spending = events
    .filter(e => e.eventType === 'WITHDRAWAL')
    .reduce((acc, e) => {
      const date = e.timestamp.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + e.amount;
      return acc;
    }, {});
  
  return spending;
}

// النتيجة:
// {
//   "2025-10-01": 200,
//   "2025-10-02": 150,
//   "2025-10-03": 300,
//   ...
// }
```

## 🎯 Best Practices

### ✅ افعل:
1. **استخدم Transactions** - دائماً استخدم MongoDB transactions
2. **رقم تسلسلي** - احفظ sequence number لكل حدث
3. **Correlation ID** - اربط الأحداث المرتبطة
4. **Metadata كاملة** - احفظ جميع التفاصيل المهمة
5. **Immutable Events** - لا تُعدّل أو تحذف الأحداث أبداً

### ❌ لا تفعل:
1. **لا تحذف الأحداث** - الأحداث دائمة وغير قابلة للتعديل
2. **لا تخطي أرقام التسلسل** - يجب أن تكون متتالية
3. **لا تحفظ معلومات حساسة** - مثل كلمات المرور في metadata
4. **لا تعتمد فقط على الحالة** - استخدم الأحداث للتدقيق

## 📈 الأداء (Performance)

### Snapshots للأداء

```typescript
// إنشاء snapshot كل 100 حدث
async createSnapshotIfNeeded(userId: string) {
  const lastEvent = await this.walletEventModel
    .findOne({ userId })
    .sort({ sequence: -1 });

  // إنشاء snapshot كل 100 حدث
  if (lastEvent.sequence % 100 === 0) {
    await this.walletEventService.createSnapshot(userId);
  }
}

// حساب الحالة من آخر snapshot + الأحداث الجديدة
async calculateStateOptimized(userId: string) {
  const snapshot = await this.getLatestSnapshot(userId);
  
  const newEvents = await this.walletEventService.getUserEvents(
    userId,
    fromSequence: snapshot.lastEventSequence + 1
  );

  let balance = snapshot.balance;
  // حساب التغييرات من الأحداث الجديدة فقط
  newEvents.forEach(event => {
    // ...
  });

  return balance;
}
```

### Indexing

```typescript
// في wallet-event.entity.ts
WalletEventSchema.index({ userId: 1, sequence: 1 });
WalletEventSchema.index({ aggregateId: 1, sequence: 1 }, { unique: true });
WalletEventSchema.index({ timestamp: 1 });
WalletEventSchema.index({ eventType: 1, timestamp: -1 });
WalletEventSchema.index({ correlationId: 1 });
```

## 🔐 الأمان

### Audit Logging
كل حدث يُسجّل بشكل دائم ولا يمكن تعديله:
```typescript
// كل عملية تُسجّل
DEPOSIT → Event #1
HOLD → Event #2
RELEASE → Event #3
// لا يمكن حذف أو تعديل Event #2
```

### Compliance
```typescript
// يمكن إثبات كل معاملة مالية
const proof = await walletEventService.getUserEvents(userId);

// تقرير للمراجعة
const report = {
  user: userId,
  period: '2025-01-01 to 2025-12-31',
  totalDeposits: 10000,
  totalWithdrawals: 5000,
  events: proof.length,
  verified: true
};
```

## 🚀 المستقبل

### مميزات قادمة:
- ✅ CQRS (Command Query Responsibility Segregation)
- ✅ Event Projections للتقارير
- ✅ Temporal Queries (الاستعلامات الزمنية)
- ✅ Event Versioning (إدارة إصدارات الأحداث)

---

**تاريخ التحديث:** 2025-10-14  
**النسخة:** 1.0  
**الحالة:** ✅ تم التطبيق

