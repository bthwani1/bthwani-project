# معايير الترميز والأداء لمنصة بثواني

## نظرة عامة على معايير التطوير

توثق هذه الوثيقة معايير الترميز وأفضل الممارسات للأداء في منصة بثواني، مع ضمان جودة الكود وقابلية الصيانة والأداء الأمثل عبر جميع المكونات.

## فلسفة معايير التطوير في بثواني

### مبادئ أساسية

1. **الكود كتوثيق**: الكود يجب أن يكون واضحاً ومفهوماً بدون تعليقات إضافية
2. **الأداء أولاً**: تحسين الأداء في كل مرحلة من مراحل التطوير
3. **الاختبار الشامل**: اختبار كل ميزة من زوايا متعددة
4. **الأمان الافتراضي**: الأمان مُدمج في كل طبقة من النظام
5. **الصيانة المستمرة**: مراجعة وتحديث الكود بانتظام

## معايير الترميز (Coding Standards)

### 1. معايير عامة للكود

#### أسلوب الكتابة (Code Style)
```typescript
// ✅ جيد: واضح وموجز
interface User {
  readonly id: string;
  name: string;
  email: string;
  createdAt: Date;
  isActive: boolean;
}

// ❌ سيء: غير واضح ومعقد
interface UserData extends BaseEntity {
  public readonly userId: string;
  private userName: string;
  protected userEmailAddress: string;
  private userCreationTimestamp: Date;
  public isUserCurrentlyActive: boolean;
}
```

#### تسمية المتغيرات والدوال
```typescript
// ✅ جيد: تسمية وصفية وموجزة
const userProfile = await getUserProfile(userId);
const isValidEmail = validateEmailFormat(email);
const MAX_RETRY_ATTEMPTS = 3;

// ❌ سيء: تسمية غامضة أو خاطئة
const data = await getData(id);
const check = validateFormat(str);
const x = 3;
```

#### هيكل الملفات والمجلدات
```
src/
├── components/           # مكونات React
│   ├── common/          # مكونات مشتركة
│   ├── features/        # مكونات خاصة بالميزات
│   └── layouts/         # تخطيطات الصفحات
├── hooks/               # React Hooks مخصصة
├── services/            # خدمات API والبيانات
├── types/               # تعريفات TypeScript
├── utils/               # دوال مساعدة
├── constants/           # ثوابت التطبيق
└── styles/              # ملفات التنسيقات
```

### 2. معايير TypeScript

#### استخدام الأنواع (Type Safety)
```typescript
// ✅ جيد: أنواع محددة وصريحة
interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
}

type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

const calculateTotal = (items: OrderItem[], taxRate: number = 0.15): number => {
  const subtotal = items.reduce((sum, item) => {
    const discount = item.discount || 0;
    return sum + (item.quantity * item.unitPrice * (1 - discount));
  }, 0);

  return subtotal * (1 + taxRate);
};

// ❌ سيء: استخدام any أو أنواع عامة غير ضرورية
const processOrder = (data: any): any => {
  return data;
};
```

#### معالجة الأخطاء
```typescript
// ✅ جيد: معالجة أخطاء شاملة ومفيدة
const createOrder = async (orderData: CreateOrderInput): Promise<Order> => {
  try {
    // التحقق من صحة البيانات
    validateOrderInput(orderData);

    // إنشاء الطلب
    const order = await orderService.create(orderData);

    // إرسال إشعار للتاجر
    await notificationService.sendOrderNotification(order);

    return order;
  } catch (error) {
    // تسجيل الخطأ مع السياق
    logger.error('Failed to create order', {
      error: error.message,
      orderData: sanitizeOrderData(orderData),
      userId: orderData.userId
    });

    // رمي خطأ مفهوم للمستخدم
    if (error instanceof ValidationError) {
      throw new UserFriendlyError('INVALID_ORDER_DATA', error.details);
    }

    throw new UserFriendlyError('ORDER_CREATION_FAILED');
  }
};
```

### 3. معايير React وFrontend

#### هيكل المكونات
```typescript
// ✅ جيد: مكون نظيف وقابل للاختبار
interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  className
}) => {
  const { track } = useAnalytics();

  const handleAddToCart = useCallback(() => {
    onAddToCart?.(product.id);
    track('ProductAddedToCart', {
      productId: product.id,
      productName: product.name
    });
  }, [product.id, product.name, onAddToCart, track]);

  return (
    <div className={cn('product-card', className)}>
      <ProductImage src={product.image} alt={product.name} />
      <ProductInfo product={product} />
      {onAddToCart && (
        <Button onClick={handleAddToCart} variant="primary">
          إضافة للسلة
        </Button>
      )}
    </div>
  );
};
```

#### إدارة الحالة (State Management)
```typescript
// ✅ جيد: استخدام Zustand للحالة المعقدة
interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;

  // إجراءات
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;

  // حسابات مشتقة
  totalItems: number;
  totalPrice: number;
  isEmpty: boolean;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  addItem: (item) => set((state) => ({
    items: [...state.items, item],
    error: null
  })),

  removeItem: (itemId) => set((state) => ({
    items: state.items.filter(item => item.id !== itemId)
  })),

  updateQuantity: (itemId, quantity) => set((state) => ({
    items: state.items.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    )
  })),

  clearCart: () => set({ items: [], error: null }),

  // حسابات مشتقة
  get totalItems() {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  get totalPrice() {
    return get().items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  get isEmpty() {
    return get().items.length === 0;
  }
}));
```

### 4. معايير Backend وNode.js

#### هيكل الخدمات
```typescript
// ✅ جيد: خدمة نظيفة ومنظمة
@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly paymentService: PaymentService,
    private readonly notificationService: NotificationService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    // بدء transaction
    const queryRunner = this.orderRepository.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // إنشاء الطلب
      const order = await queryRunner.manager.save(Order, {
        ...createOrderDto,
        status: OrderStatus.PENDING,
        createdAt: new Date()
      });

      // معالجة الدفع
      const payment = await this.paymentService.processPayment({
        orderId: order.id,
        amount: order.total,
        paymentMethod: createOrderDto.paymentMethod
      });

      // تحديث حالة الطلب
      order.paymentId = payment.id;
      order.status = OrderStatus.PAID;
      await queryRunner.manager.save(order);

      // إرسال إشعارات
      await this.notificationService.sendOrderNotifications(order);

      // إرسال حدث
      this.eventEmitter.emit('order.created', order);

      // تأكيد transaction
      await queryRunner.commitTransaction();

      return order;
    } catch (error) {
      // إلغاء transaction في حالة الخطأ
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
```

#### معالجة الأخطاء في الخلفية
```typescript
// ✅ جيد: معالجة أخطاء شاملة ومفيدة
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RateLimitGuard)
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    try {
      const order = await this.orderService.createOrder(createOrderDto);

      return {
        success: true,
        data: order,
        message: 'تم إنشاء الطلب بنجاح'
      };
    } catch (error) {
      // تسجيل الخطأ مع السياق الكامل
      this.logger.error('Order creation failed', {
        error: error.message,
        stack: error.stack,
        userId: getUserFromRequest()?.id,
        requestBody: sanitizeRequestBody(createOrderDto),
        timestamp: new Date().toISOString()
      });

      // تصنيف الخطأ وإرسال استجابة مناسبة
      if (error instanceof BusinessRuleError) {
        throw new BadRequestException({
          error: 'BUSINESS_RULE_VIOLATION',
          message: error.message,
          details: error.details
        });
      }

      if (error instanceof PaymentError) {
        throw new BadRequestException({
          error: 'PAYMENT_FAILED',
          message: 'فشل في معالجة الدفع',
          retry: true
        });
      }

      // خطأ غير متوقع
      throw new InternalServerErrorException({
        error: 'INTERNAL_ERROR',
        message: 'حدث خطأ داخلي في الخادم'
      });
    }
  }
}
```

## معايير الأداء (Performance Standards)

### 1. مقاييس الأداء المستهدفة

| المقياس | الهدف | القيمة المقبولة | القيمة الممتازة |
|---------|-------|-----------------|------------------|
| **First Contentful Paint** | < 1.5 ثانية | < 2.5 ثانية | < 1 ثانية |
| **Largest Contentful Paint** | < 2.5 ثانية | < 4 ثانية | < 2 ثانية |
| **Cumulative Layout Shift** | < 0.1 | < 0.25 | < 0.05 |
| **First Input Delay** | < 100ms | < 300ms | < 50ms |
| **Time to Interactive** | < 3 ثانية | < 5 ثانية | < 2 ثانية |

### 2. تحسين أداء Frontend

#### تحميل الموارد (Resource Loading)
```typescript
// ✅ جيد: تحميل ذكي للموارد
const ResourceOptimizer = () => {
  // تحميل المكونات بالحاجة فقط
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={elementRef}>
      {isVisible ? <ExpensiveComponent /> : <SkeletonLoader />}
    </div>
  );
};
```

#### تحسين الصور
```typescript
// ✅ جيد: تحسين تلقائي للصور
import { useImageOptimizer } from '@/hooks/useImageOptimizer';

const OptimizedImage = ({ src, alt, className }) => {
  const { optimizedSrc, isLoading } = useImageOptimizer(src, {
    width: 800,
    height: 600,
    quality: 85,
    format: 'webp'
  });

  return (
    <img
      src={optimizedSrc}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onLoad={() => track('ImageLoaded')}
      onError={() => track('ImageLoadFailed')}
    />
  );
};
```

### 3. تحسين أداء Backend

#### استعلامات قاعدة البيانات المحسنة
```typescript
// ✅ جيد: استعلام محسن مع فهرسة مناسبة
@Injectable()
export class ProductService {
  async getPopularProducts(limit: number = 10): Promise<Product[]> {
    return this.productRepository.find({
      where: {
        isActive: true,
        stock: MoreThan(0)
      },
      order: {
        viewCount: 'DESC',
        rating: 'DESC',
        createdAt: 'DESC'
      },
      take: limit,
      relations: ['vendor', 'category'],
      cache: {
        id: `popular_products_${limit}`,
        milliseconds: 5 * 60 * 1000 // 5 دقائق
      }
    });
  }

  // ❌ سيء: استعلام غير محسن
  async getProductsBad(): Promise<Product[]> {
    const products = await this.productRepository.find();

    // ترتيب في الذاكرة بدلاً من قاعدة البيانات
    return products
      .filter(p => p.isActive)
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 10);
  }
}
```

#### إدارة الذاكرة والموارد
```typescript
// ✅ جيد: إدارة ذاكرة فعالة
@Injectable()
export class FileUploadService {
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  async uploadFile(file: Express.Multer.File): Promise<UploadResult> {
    // التحقق من الحجم والنوع
    if (file.size > this.MAX_FILE_SIZE) {
      throw new BadRequestException('FILE_TOO_LARGE');
    }

    if (!this.ALLOWED_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('INVALID_FILE_TYPE');
    }

    // استخدام stream لمعالجة الملفات الكبيرة
    const stream = Readable.from(file.buffer);
    const chunks: Buffer[] = [];

    for await (const chunk of stream) {
      chunks.push(chunk);

      // منع استهلاك ذاكرة زائدة
      if (chunks.length > 1000) {
        throw new BadRequestException('FILE_TOO_LARGE');
      }
    }

    const buffer = Buffer.concat(chunks);

    // معالجة الصورة بطريقة فعالة للذاكرة
    const optimizedBuffer = await sharp(buffer)
      .resize(1200, null, { withoutEnlargement: true })
      .jpeg({ quality: 85, progressive: true })
      .toBuffer();

    return this.saveToStorage(optimizedBuffer, file.originalname);
  }
}
```

## أدوات وأتمتة الجودة

### 1. أدوات التحقق من الجودة

```yaml
# إعدادات ESLint وPrettier
eslint:
  extends:
    - '@typescript-eslint/recommended'
    - '@typescript-eslint/recommended-requiring-type-checking'
    - 'plugin:react/recommended'
    - 'plugin:react-hooks/recommended'
    - 'plugin:jsx-a11y/recommended'
    - 'plugin:import/recommended'
    - 'plugin:import/typescript'

  rules:
    '@typescript-eslint/no-explicit-any': 'error'
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    'react-hooks/exhaustive-deps': 'error'
    'import/order': ['error', { groups: ['builtin', 'external', 'internal'] }]

prettier:
  semi: true
  trailingComma: 'es5'
  singleQuote: true
  printWidth: 100
  tabWidth: 2
  useTabs: false
```

### 2. اختبارات تلقائية

```typescript
// ✅ جيد: اختبارات شاملة وقابلة للصيانة
describe('OrderService', () => {
  let service: OrderService;
  let repository: MockOrderRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: OrderRepository,
          useValue: {
            find: jest.fn(),
            save: jest.fn(),
            createQueryRunner: jest.fn()
          }
        },
        {
          provide: PaymentService,
          useValue: { processPayment: jest.fn() }
        }
      ]
    }).compile();

    service = module.get<OrderService>(OrderService);
    repository = module.get<OrderRepository>(OrderRepository);
  });

  describe('createOrder', () => {
    it('should create order successfully', async () => {
      // ترتيب (Arrange)
      const orderData = createMockOrderData();
      const mockOrder = { id: '123', ...orderData };

      repository.save.mockResolvedValue(mockOrder);

      // تنفيذ (Act)
      const result = await service.createOrder(orderData);

      // تأكيد (Assert)
      expect(result).toEqual(mockOrder);
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ...orderData,
          status: OrderStatus.PENDING
        })
      );
    });

    it('should handle payment failure gracefully', async () => {
      // ترتيب
      const orderData = createMockOrderData();
      repository.save.mockResolvedValue({ id: '123', ...orderData });

      // محاكاة فشل في الدفع
      const paymentService = service['paymentService'] as any;
      paymentService.processPayment.mockRejectedValue(new PaymentError('Payment failed'));

      // تنفيذ وتأكيد
      await expect(service.createOrder(orderData)).rejects.toThrow(UserFriendlyError);
    });
  });
});
```

## مراقبة الأداء وقياسه

### 1. أدوات مراقبة الأداء

```typescript
// ✅ جيد: مراقبة شاملة للأداء
@Injectable()
export class PerformanceMonitorService {
  private readonly metrics: Map<string, number[]> = new Map();

  async recordMetric(name: string, value: number, tags?: Record<string, string>) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    this.metrics.get(name)!.push(value);

    // حفظ المقاييس كل دقيقة
    if (this.shouldFlush()) {
      await this.flushMetrics();
    }

    // تنبيه عند تجاوز الحدود
    if (this.isThresholdExceeded(name, value)) {
      await this.alertPerformanceIssue(name, value, tags);
    }
  }

  private isThresholdExceeded(name: string, value: number): boolean {
    const thresholds = {
      'api_response_time': 1000, // 1 ثانية
      'database_query_time': 100, // 100ms
      'memory_usage': 80, // 80%
      'error_rate': 5 // 5%
    };

    return value > thresholds[name];
  }

  private async alertPerformanceIssue(name: string, value: number, tags?: Record<string, string>) {
    await this.notificationService.send({
      type: 'performance_alert',
      severity: 'warning',
      message: `Performance threshold exceeded for ${name}: ${value}`,
      metadata: { metric: name, value, tags }
    });
  }
}
```

### 2. لوحة مراقبة الأداء

```typescript
// مكون مراقبة الأداء في الوقت الفعلي
const PerformanceDashboard = () => {
  const [metrics, setMetrics] = useState({});
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      const data = await Promise.all([
        getAPIMetrics(),
        getDatabaseMetrics(),
        getFrontendMetrics(),
        getSystemMetrics()
      ]);

      setMetrics({
        api: data[0],
        database: data[1],
        frontend: data[2],
        system: data[3]
      });
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000); // كل 10 ثواني

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="performance-dashboard">
      <div className="metrics-grid">
        <PerformanceCard
          title="زمن استجابة API"
          value={`${metrics.api?.averageResponseTime}ms`}
          target="< 200ms"
          status={getStatus(metrics.api?.averageResponseTime, 200)}
        />

        <PerformanceCard
          title="استخدام قاعدة البيانات"
          value={`${metrics.database?.connectionPoolUsage}%`}
          target="< 80%"
          status={getStatus(metrics.database?.connectionPoolUsage, 80)}
        />

        <PerformanceCard
          title="معدل الأخطاء"
          value={`${metrics.api?.errorRate}%`}
          target="< 1%"
          status={getStatus(metrics.api?.errorRate, 1)}
        />
      </div>

      <div className="alerts-section">
        <h3>تنبيهات الأداء</h3>
        {alerts.map(alert => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </div>
    </div>
  );
};
```

## الخلاصة والتوصيات

### النتائج الحالية
- ✅ **معايير ترميز صارمة**: ضمان جودة عالية للكود عبر جميع المكونات
- ✅ **تحسين أداء شامل**: مراقبة وتحسين مستمر للأداء في جميع الطبقات
- ✅ **أدوات أتمتة فعالة**: أدوات تلقائية للتحقق من الجودة والأداء
- ✅ **اختبارات شاملة**: تغطية اختبارات عالية مع أتمتة كاملة
- ✅ **مراقبة متقدمة**: مراقبة في الوقت الفعلي مع تنبيهات ذكية

### التوصيات الرئيسية

1. **التدريب المستمر**: تدريب منتظم للفريق على المعايير والممارسات الجديدة
2. **مراجعة دورية**: مراجعة الكود وتحسينه بانتظام للحفاظ على الجودة
3. **أتمتة المزيد**: زيادة الأتمتة في عمليات الجودة والأداء
4. **تحسين مستمر**: مراقبة مقاييس الأداء وتحسينها بناءً على البيانات
5. **توثيق الممارسات**: توثيق أفضل الممارسات ومشاركتها مع الفريق

### مؤشرات الجودة والأداء

| المؤشر | الهدف | طريقة القياس | تكرار المراجعة |
|---------|-------|-------------|----------------|
| **تغطية الاختبارات** | > 95% | أدوات مثل Jest وCypress | مع كل PR |
| **معدل الأخطاء في الإنتاج** | < 0.1% | مراقبة Sentry وNew Relic | أسبوعي |
| **زمن استجابة API** | p95 < 200ms | مراقبة الأداء | يومي |
| **درجة إضاءة المنارة** | > 90 | أدوات مثل Lighthouse | أسبوعي |
| **تغطية الوصول** | > 95% | أدوات مثل axe-core | مع كل إصدار |

---

هذه المعايير تُحدث ربع سنوياً مع مراجعة شاملة للتقنيات الجديدة وتحسين الممارسات بناءً على تجربة الفريق والمشاريع.
