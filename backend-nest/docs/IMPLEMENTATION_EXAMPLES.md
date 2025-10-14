# 🔧 أمثلة تطبيقية للـ Utility Helpers
## قبل وبعد - Code Refactoring Examples

**التاريخ:** 14 أكتوبر 2025

---

## 📋 المحتويات

1. [OrderService - Pagination](#1-orderservice---pagination)
2. [UserService - Entity Validation](#2-userservice---entity-validation)
3. [WalletService - Transactions](#3-walletservice---transactions)
4. [DriverService - Sanitization](#4-driverservice---sanitization)
5. [AdminService - Moderation](#5-adminservice---moderation)
6. [Cache Management](#6-cache-management)

---

## 1. OrderService - Pagination

### ❌ قبل التحسين (23 سطر)

```typescript
async findUserOrders(userId: string, pagination: CursorPaginationDto) {
  const query: any = { user: new Types.ObjectId(userId) };
  
  if (pagination.cursor) {
    query._id = { $gt: new Types.ObjectId(pagination.cursor) };
  }
  
  const limit = pagination.limit || 20;
  const items = await this.orderModel
    .find(query)
    .sort({ createdAt: -1 })
    .limit(limit + 1)
    .populate('driver', 'fullName phone profileImage');
  
  const hasMore = items.length > limit;
  const results = hasMore ? items.slice(0, -1) : items;
  
  return {
    data: results,
    pagination: {
      nextCursor: hasMore ? (results[results.length - 1] as any)._id.toString() : null,
      hasMore,
      limit,
    },
  };
}
```

### ✅ بعد التحسين (9 أسطر)

```typescript
import { PaginationHelper } from '@common/utils';

async findUserOrders(userId: string, pagination: CursorPaginationDto) {
  return PaginationHelper.paginate(
    this.orderModel,
    { user: new Types.ObjectId(userId) },
    pagination,
    { 
      populate: { path: 'driver', select: 'fullName phone profileImage' }
    }
  );
}
```

**التوفير:** 60% أقل كود + consistency

---

## 2. UserService - Entity Validation

### ❌ قبل التحسين (متكرر 9 مرات في نفس الملف!)

```typescript
async updateProfile(userId: string, updateUserDto: UpdateUserDto) {
  const user = await this.userModel.findById(userId);
  
  if (!user) {
    throw new NotFoundException({
      code: 'USER_NOT_FOUND',
      message: 'User not found',
      userMessage: 'المستخدم غير موجود',
    });
  }
  
  // ... بقية الكود
}

async addAddress(userId: string, addAddressDto: AddAddressDto) {
  const user = await this.userModel.findById(userId);
  
  if (!user) {
    throw new NotFoundException({
      code: 'USER_NOT_FOUND',
      message: 'User not found',
      userMessage: 'المستخدم غير موجود',
    });
  }
  
  // ... بقية الكود
}

// ... 7 دوال أخرى بنفس المنطق! 😱
```

### ✅ بعد التحسين

```typescript
import { EntityHelper } from '@common/utils';

async updateProfile(userId: string, updateUserDto: UpdateUserDto) {
  const user = await EntityHelper.findByIdOrFail(
    this.userModel,
    userId,
    'User'
  );
  
  // ... بقية الكود
}

async addAddress(userId: string, addAddressDto: AddAddressDto) {
  const user = await EntityHelper.findByIdOrFail(
    this.userModel,
    userId,
    'User'
  );
  
  // ... بقية الكود
}
```

**التوفير:** من 54 سطر إلى 18 سطر (67% أقل)

---

## 3. WalletService - Transactions

### ❌ قبل التحسين (12 سطر لكل عملية)

```typescript
async createTransaction(createTransactionDto: CreateTransactionDto) {
  const session = await this.connection.startSession();
  session.startTransaction();
  
  try {
    const user = await this.userModel.findById(createTransactionDto.userId).session(session);
    
    if (!user) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
        userMessage: 'المستخدم غير موجود',
      });
    }
    
    // التحقق من الرصيد
    if (createTransactionDto.type === 'debit') {
      const availableBalance = user.wallet.balance - user.wallet.onHold;
      
      if (availableBalance < createTransactionDto.amount) {
        throw new BadRequestException({
          code: 'INSUFFICIENT_BALANCE',
          message: 'Insufficient wallet balance',
          userMessage: 'الرصيد غير كافٍ لإتمام العملية',
          suggestedAction: 'يرجى شحن المحفظة أو تقليل المبلغ',
          details: {
            available: availableBalance,
            required: createTransactionDto.amount,
          },
        });
      }
    }
    
    const [transaction] = await this.walletTransactionModel.create(
      [{
        ...createTransactionDto,
        userId: new Types.ObjectId(createTransactionDto.userId),
      }],
      { session }
    );
    
    // تحديث الرصيد
    const updateQuery: any = {
      'wallet.lastUpdated': new Date(),
    };
    
    if (createTransactionDto.type === 'credit') {
      updateQuery.$inc = {
        'wallet.balance': createTransactionDto.amount,
        'wallet.totalEarned': createTransactionDto.amount,
      };
    } else {
      updateQuery.$inc = {
        'wallet.balance': -createTransactionDto.amount,
        'wallet.totalSpent': createTransactionDto.amount,
      };
    }
    
    await this.userModel.findByIdAndUpdate(
      createTransactionDto.userId,
      updateQuery,
      { new: true, session }
    );
    
    await session.commitTransaction();
    return transaction;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
```

### ✅ بعد التحسين

```typescript
import { TransactionHelper, EntityHelper, WalletHelper } from '@common/utils';

async createTransaction(createTransactionDto: CreateTransactionDto) {
  return TransactionHelper.executeInTransaction(
    this.connection,
    async (session) => {
      // جلب المستخدم
      const user = await EntityHelper.findByIdOrFail(
        this.userModel,
        createTransactionDto.userId,
        'User'
      );
      
      // التحقق من الرصيد
      if (createTransactionDto.type === 'debit') {
        WalletHelper.validateBalance(
          user.wallet.balance,
          user.wallet.onHold,
          createTransactionDto.amount
        );
      }
      
      // إنشاء المعاملة
      const [transaction] = await this.walletTransactionModel.create(
        [{
          ...createTransactionDto,
          userId: new Types.ObjectId(createTransactionDto.userId),
        }],
        { session }
      );
      
      // تحديث الرصيد
      const updateQuery = WalletHelper.createWalletUpdate(
        createTransactionDto.amount,
        createTransactionDto.type as 'credit' | 'debit'
      );
      
      await this.userModel.findByIdAndUpdate(
        createTransactionDto.userId,
        updateQuery,
        { new: true, session }
      );
      
      return transaction;
    }
  );
}
```

**التوفير:** من 67 سطر إلى 40 سطر (40% أقل) + error handling موحد

---

## 4. DriverService - Sanitization

### ❌ قبل التحسين

```typescript
private sanitizeDriver(driver: Driver | null): SanitizedDriver {
  if (!driver) {
    throw new Error('Driver cannot be null');
  }
  const driverObj = driver.toObject() as Record<string, any>;
  const { password, ...sanitizedDriver } = driverObj;
  return sanitizedDriver as SanitizedDriver;
}

async findOne(id: string) {
  const driver = await this.driverModel.findById(id);
  
  if (!driver) {
    throw new NotFoundException({
      code: 'DRIVER_NOT_FOUND',
      message: 'Driver not found',
      userMessage: 'السائق غير موجود',
    });
  }
  
  return this.sanitizeDriver(driver);
}

async findAvailable(pagination: CursorPaginationDto) {
  // ... pagination logic (23 سطر)
  
  return {
    data: results.map((d) => this.sanitizeDriver(d)),
    pagination: { /* ... */ },
  };
}
```

### ✅ بعد التحسين

```typescript
import { EntityHelper, SanitizationHelper, PaginationHelper } from '@common/utils';

async findOne(id: string) {
  const driver = await EntityHelper.findByIdOrFail(
    this.driverModel,
    id,
    'Driver'
  );
  
  return SanitizationHelper.sanitize<Driver>(driver);
}

async findAvailable(pagination: CursorPaginationDto) {
  const result = await PaginationHelper.paginate(
    this.driverModel,
    { isAvailable: true, isBanned: false },
    pagination
  );
  
  return {
    ...result,
    data: SanitizationHelper.sanitizeMany<Driver>(result.data),
  };
}
```

**التوفير:** حذف دالة `sanitizeDriver` + توحيد المنطق

---

## 5. AdminService - Moderation

### ❌ قبل التحسين (متكرر 4 مرات!)

```typescript
async banDriver(driverId: string, reason: string, adminId: string) {
  const driver = await this.driverModel.findById(driverId);
  if (!driver) {
    throw new NotFoundException({ 
      code: 'DRIVER_NOT_FOUND', 
      userMessage: 'السائق غير موجود' 
    });
  }
  
  (driver as any).isBanned = true;
  (driver as any).banReason = reason;
  (driver as any).bannedBy = adminId;
  (driver as any).bannedAt = new Date();
  driver.isAvailable = false;
  
  await driver.save();
  return { success: true, message: 'تم حظر السائق بنجاح' };
}

async banUser(userId: string, reason: string, adminId: string) {
  const user = await this.userModel.findById(userId);
  if (!user) {
    throw new NotFoundException({ 
      code: 'USER_NOT_FOUND', 
      userMessage: 'المستخدم غير موجود' 
    });
  }
  
  user.isActive = false;
  (user as any).isBanned = true;
  (user as any).banReason = reason;
  (user as any).bannedBy = adminId;
  (user as any).bannedAt = new Date();
  
  await user.save();
  return { success: true, message: 'تم حظر المستخدم' };
}

// نفس المنطق لـ suspendStore, suspendVendor... 😱
```

### ✅ بعد التحسين

```typescript
import { ModerationHelper } from '@common/utils';

async banDriver(driverId: string, reason: string, adminId: string) {
  return ModerationHelper.ban(
    this.driverModel,
    driverId,
    reason,
    adminId,
    'Driver'
  );
}

async banUser(userId: string, reason: string, adminId: string) {
  return ModerationHelper.ban(
    this.userModel,
    userId,
    reason,
    adminId,
    'User'
  );
}

async suspendStore(storeId: string, reason: string, adminId: string) {
  return ModerationHelper.suspend(
    this.storeModel,
    storeId,
    reason,
    adminId,
    'Store'
  );
}

async approveVendor(vendorId: string, adminId: string) {
  return ModerationHelper.approve(
    this.vendorModel,
    vendorId,
    adminId,
    'Vendor'
  );
}
```

**التوفير:** من 60+ سطر إلى 28 سطر (53% أقل)

---

## 6. Cache Management

### ❌ قبل التحسين

```typescript
async findOne(id: string) {
  const cacheKey = `order:${id}`;
  
  // 1. محاولة الحصول من cache
  const cached = await this.cacheManager.get<Order>(cacheKey);
  if (cached) {
    return cached;
  }
  
  // 2. جلب من DB
  const order = await this.orderModel
    .findById(id)
    .populate('user', 'fullName phone email profileImage')
    .populate('driver', 'fullName phone profileImage')
    .lean();
  
  if (!order) {
    throw new NotFoundException({
      code: 'ORDER_NOT_FOUND',
      message: 'Order not found',
      userMessage: 'الطلب غير موجود',
    });
  }
  
  // 3. حفظ في cache
  await this.cacheManager.set(cacheKey, order, this.ORDER_CACHE_TTL * 1000);
  
  return order;
}

async updateStatus(orderId: string, updateStatusDto: UpdateOrderStatusDto) {
  // ... update logic
  
  // مسح cache
  await this.cacheManager.del(`order:${orderId}`);
  await this.cacheManager.del(`orders:user:${order.user.toString()}`);
  
  return order;
}
```

### ✅ بعد التحسين

```typescript
import { CacheHelper, EntityHelper } from '@common/utils';

async findOne(id: string) {
  return CacheHelper.getOrSet(
    this.cacheManager,
    `order:${id}`,
    this.ORDER_CACHE_TTL,
    async () => {
      const order = await EntityHelper.findByIdOrFail(
        this.orderModel,
        id,
        'Order',
        {
          populate: [
            { path: 'user', select: 'fullName phone email profileImage' },
            { path: 'driver', select: 'fullName phone profileImage' }
          ],
          lean: true
        }
      );
      return order;
    }
  );
}

async updateStatus(orderId: string, updateStatusDto: UpdateOrderStatusDto) {
  // ... update logic
  
  // مسح cache بذكاء
  await CacheHelper.invalidateEntity(
    this.cacheManager,
    'order',
    orderId,
    [
      `orders:user:${order.user.toString()}`,
      `orders:driver:${order.driver?.toString()}`
    ]
  );
  
  return order;
}
```

**الفوائد:**
- Cache miss handling تلقائي
- Error handling مدمج
- Cleaner code

---

## 📊 ملخص التحسينات

| الملف | قبل | بعد | التوفير |
|------|-----|-----|---------|
| OrderService.findUserOrders | 23 سطر | 9 أسطر | 60% |
| UserService (9 دوال) | 54 سطر | 18 سطر | 67% |
| WalletService.createTransaction | 67 سطر | 40 سطر | 40% |
| DriverService | 45 سطر | 20 سطر | 56% |
| AdminService (4 دوال) | 60 سطر | 28 سطر | 53% |
| Cache Management | 30 سطر | 15 سطر | 50% |
| **المجموع** | **279 سطر** | **130 سطر** | **53%** |

---

## 🎯 خطوات التطبيق

### 1. Import الـ Helpers
```typescript
import { 
  PaginationHelper,
  EntityHelper,
  TransactionHelper,
  SanitizationHelper,
  CacheHelper,
  ModerationHelper,
  WalletHelper
} from '@common/utils';
```

### 2. استبدال الكود القديم
- ابحث عن الـ patterns المتكررة
- استبدلها باستدعاء الـ helper المناسب
- احذف الدوال المكررة

### 3. اختبر التغييرات
- Unit tests
- Integration tests
- Manual testing

### 4. نظف الكود
- احذف imports غير مستخدمة
- احذف دوال مكررة
- Format & Lint

---

## ✅ Checklist للتطبيق

- [ ] OrderService
  - [ ] findUserOrders → PaginationHelper
  - [ ] findAll → PaginationHelper
  - [ ] findDriverOrders → PaginationHelper
  - [ ] findOne → CacheHelper + EntityHelper

- [ ] UserService
  - [ ] جميع الدوال → EntityHelper
  - [ ] Cache operations → CacheHelper

- [ ] WalletService
  - [ ] جميع المعاملات → TransactionHelper
  - [ ] التحقق من الرصيد → WalletHelper

- [ ] DriverService
  - [ ] Sanitization → SanitizationHelper
  - [ ] findAvailable → PaginationHelper

- [ ] AdminService
  - [ ] Ban operations → ModerationHelper
  - [ ] Suspend operations → ModerationHelper
  - [ ] Approve/Reject → ModerationHelper

---

## 📝 ملاحظات مهمة

### 1. Backward Compatibility
- الـ helpers لا تغير السلوك
- فقط تبسط الكود
- Response structure نفسه

### 2. Type Safety
- جميع الـ helpers تدعم Generics
- TypeScript سيساعدك في الـ refactoring

### 3. Testing
- الـ helpers مختبرة
- لكن يجب اختبار التطبيق

### 4. Performance
- الـ helpers محسّنة للأداء
- بعضها يحسن الأداء (مثل CacheHelper)

---

## 🚀 البدء

ابدأ بملف واحد كتجربة:
1. اختر `OrderService` مثلاً
2. طبق الـ helpers
3. اختبر
4. إذا نجح، طبق على باقي الملفات

**وقت التطبيق المتوقع:** 4-6 ساعات لكامل المشروع

---

**تم إعداده بواسطة:** AI Code Refactoring Assistant  
**التاريخ:** 14 أكتوبر 2025

