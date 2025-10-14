# 🔄 API Versioning Strategy

## استراتيجية إدارة إصدارات الـ API

تستخدم هذه الواجهة **URI Versioning** لإدارة إصدارات الـ API، مما يوفر وضوحاً وسهولة في التعامل.

## 🎯 نوع الـ Versioning

**URI Versioning** - النوع المستخدم:
```
/api/v1/orders
/api/v2/orders
/api/v3/orders
```

### لماذا URI Versioning؟

✅ **واضح وسهل الفهم** - الإصدار ظاهر في الـ URL  
✅ **سهل الاختبار** - يمكن اختبار الإصدارات في المتصفح مباشرة  
✅ **Cache-friendly** - كل إصدار له URL منفصل  
✅ **متوافق مع جميع الأدوات** - Postman, cURL, Swagger  
✅ **RESTful** - متوافق مع مبادئ REST  

## 📊 الإصدار الحالي

**الإصدار الافتراضي:** `v2`

```typescript
// في main.ts
app.enableVersioning({
  type: VersioningType.URI,
  defaultVersion: '2',
  prefix: 'api/v',
});
```

## 🔧 كيفية استخدام Versioning

### في Controllers

```typescript
import { Controller, Get, Version } from '@nestjs/common';

// الطريقة 1: تحديد الإصدار على مستوى الـ Controller
@Controller({ path: 'orders', version: '2' })
export class OrderControllerV2 {
  @Get()
  findAll() {
    return 'Orders API v2';
  }
}

// الطريقة 2: تحديد الإصدار على مستوى الـ Route
@Controller('products')
export class ProductController {
  @Get()
  @Version('1')
  findAllV1() {
    return 'Products API v1';
  }

  @Get()
  @Version('2')
  findAllV2() {
    return 'Products API v2 with new features';
  }
}

// الطريقة 3: دعم إصدارات متعددة
@Controller('users')
export class UserController {
  @Get()
  @Version(['1', '2'])
  findAll() {
    return 'Works in both v1 and v2';
  }

  @Get('detailed')
  @Version('2')
  findDetailedV2() {
    return 'Only available in v2';
  }
}
```

## 🌐 URLs الناتجة

| Endpoint | URL | الوصف |
|----------|-----|-------|
| Orders v2 | `GET /api/v2/orders` | الإصدار الافتراضي |
| Wallet v2 | `GET /api/v2/wallet/balance` | المحفظة |
| Users v2 | `GET /api/v2/users/me` | معلومات المستخدم |
| Health Check | `GET /health` | بدون إصدار (excluded) |
| API Docs | `GET /api/docs` | بدون إصدار (excluded) |

## 📝 إنشاء إصدار جديد

### خطوات إنشاء v3:

#### 1. إنشاء Controller جديد
```typescript
// src/modules/order/order-v3.controller.ts
@Controller({ path: 'orders', version: '3' })
export class OrderControllerV3 {
  @Get()
  findAll() {
    return 'New features in v3';
  }
}
```

#### 2. إضافة الـ Controller إلى Module
```typescript
// src/modules/order/order.module.ts
@Module({
  controllers: [
    OrderControllerV2, // الإصدار القديم
    OrderControllerV3, // الإصدار الجديد
  ],
})
export class OrderModule {}
```

#### 3. توثيق التغييرات
```markdown
## v3 Changes (2025-10-15)
- Added pagination support
- Improved filtering
- New response format
```

## 🔄 استراتيجية الترقية (Migration Strategy)

### قاعدة الـ Breaking Changes

**قاعدة ذهبية:** أي تغيير يكسر التوافق مع الإصدار السابق يتطلب إصدار جديد.

#### ✅ لا يتطلب إصدار جديد:
- إضافة حقول جديدة اختيارية
- إضافة endpoints جديدة
- تحسينات الأداء
- إصلاح الأخطاء

#### ❌ يتطلب إصدار جديد:
- تغيير أسماء الحقول
- تغيير أنواع البيانات
- حذف endpoints
- تغيير هيكل الـ response
- تغيير القواعد (validation rules)

### مثال: ترقية من v2 إلى v3

**v2 Response:**
```json
{
  "id": "123",
  "total": 100,
  "items": [...]
}
```

**v3 Response (Breaking Change):**
```json
{
  "orderId": "123",        // ✅ تغيير اسم الحقل
  "totalAmount": {         // ✅ تغيير الهيكل
    "value": 100,
    "currency": "YER"
  },
  "orderItems": [...]      // ✅ تغيير اسم الحقل
}
```

## 📅 دورة حياة الإصدار (Version Lifecycle)

### 1. Active (نشط)
- الإصدار الحالي المدعوم بالكامل
- يتلقى جميع التحديثات والميزات الجديدة

### 2. Deprecated (مُهمل)
- لا يزال يعمل ولكن لا يُنصح باستخدامه
- يتلقى فقط إصلاحات الأخطاء الحرجة
- مدة الدعم: **6 أشهر** من تاريخ الإعلان

### 3. End of Life (نهاية الحياة)
- لم يعد مدعوماً
- سيتم إزالته في التحديث التالي

### مثال على الجدول الزمني:

| الإصدار | الحالة | تاريخ الإطلاق | تاريخ الإهمال | تاريخ الإزالة |
|---------|--------|---------------|---------------|--------------|
| v1 | EOL | 2024-01-01 | 2024-06-01 | 2024-12-01 |
| v2 | Active | 2024-06-01 | - | - |
| v3 | Planned | 2025-12-01 | - | - |

## 🔔 إعلان الإهمال (Deprecation Notice)

### في الـ Response Headers:
```typescript
@Get()
@Header('Deprecation', 'true')
@Header('Sunset', 'Wed, 01 Jun 2025 00:00:00 GMT')
@Header('Link', '</api/v3/orders>; rel="successor-version"')
async findAllV2() {
  return { message: 'This version is deprecated. Please use v3.' };
}
```

### في Swagger Documentation:
```typescript
@ApiOperation({ 
  summary: 'Get Orders',
  deprecated: true,
  description: '⚠️ DEPRECATED: Use v3 instead. This endpoint will be removed on 2025-06-01.'
})
```

## 📊 مثال كامل: Order API

```typescript
// ========== V2 Controller (Current) ==========
@Controller({ path: 'orders', version: '2' })
@ApiTags('Orders v2')
export class OrderControllerV2 {
  @Get()
  @ApiOperation({ summary: 'Get all orders (v2)' })
  async findAll(@Query() query: QueryDto) {
    return {
      data: [],
      meta: { page: 1, total: 0 }
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID (v2)' })
  async findOne(@Param('id') id: string) {
    return {
      id,
      total: 100,
      status: 'pending'
    };
  }
}

// ========== V3 Controller (Future) ==========
@Controller({ path: 'orders', version: '3' })
@ApiTags('Orders v3')
export class OrderControllerV3 {
  @Get()
  @ApiOperation({ summary: 'Get all orders (v3) - Enhanced with filtering' })
  async findAll(
    @Query() query: EnhancedQueryDto
  ) {
    return {
      data: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        hasNext: false
      },
      filters: query.filters
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID (v3) - Enhanced response' })
  async findOne(@Param('id') id: string) {
    return {
      orderId: id,
      totalAmount: {
        value: 100,
        currency: 'YER'
      },
      orderStatus: {
        code: 'PENDING',
        label: 'قيد الانتظار'
      },
      timeline: []
    };
  }
}
```

## 🧪 اختبار الإصدارات

### باستخدام cURL:
```bash
# v2
curl http://localhost:3000/api/v2/orders

# v3 (عند إطلاقه)
curl http://localhost:3000/api/v3/orders
```

### باستخدام Axios:
```javascript
// v2
axios.get('http://localhost:3000/api/v2/orders');

// v3
axios.get('http://localhost:3000/api/v3/orders');
```

### في Frontend:
```typescript
// تكوين Base URL حسب الإصدار
const API_VERSION = 'v2';
const baseURL = `http://localhost:3000/api/${API_VERSION}`;

const api = axios.create({ baseURL });

// الاستخدام
api.get('/orders');      // => /api/v2/orders
api.get('/wallet');      // => /api/v2/wallet
```

## 📖 Best Practices

### ✅ افعل:
1. **وثّق التغييرات** في CHANGELOG.md
2. **أعلن عن الإهمال مبكراً** (قبل 6 أشهر على الأقل)
3. **حافظ على الإصدارات القديمة** لفترة معقولة
4. **استخدم Semantic Versioning** للتوثيق
5. **اختبر جميع الإصدارات** في CI/CD

### ❌ لا تفعل:
1. **لا تغير** الإصدارات الموجودة
2. **لا تحذف** إصداراً بدون إعلان مسبق
3. **لا تخلط** بين الإصدارات في نفس الـ Controller
4. **لا تنسَ** توثيق Breaking Changes

## 🔐 الأمان

### استخدام نفس الـ Authentication لجميع الإصدارات:
```typescript
@Controller({ path: 'orders', version: ['2', '3'] })
@UseGuards(UnifiedAuthGuard)  // نفس الحماية لكل الإصدارات
export class OrderController {
  // ...
}
```

## 📈 المراقبة (Monitoring)

### تتبع استخدام الإصدارات:
```typescript
@Injectable()
export class VersionMetricsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const version = request.url.match(/\/v(\d+)\//)?[1];
    
    // تسجيل الإصدار المستخدم
    logger.log(`API Version ${version} called`, {
      endpoint: request.url,
      method: request.method
    });
    
    return next.handle();
  }
}
```

---

## 🎯 الخلاصة

- ✅ استخدم **URI Versioning** للوضوح
- ✅ الإصدار الافتراضي: **v2**
- ✅ أنشئ إصدار جديد عند **Breaking Changes**
- ✅ أعلن عن الإهمال **مبكراً**
- ✅ حافظ على الإصدارات القديمة لمدة **6 أشهر**
- ✅ وثّق جميع التغييرات

**تاريخ التحديث:** 2025-10-14  
**الإصدار الحالي:** v2

