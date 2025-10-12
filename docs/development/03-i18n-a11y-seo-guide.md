# دليل i18n/A11y وSEO الأساسي للويب في منصة بثواني

## نظرة عامة على دليل الويب الأساسي

يوثق هذا الدليل ممارسات التدويل (i18n)، الوصول (A11y)، وتحسين محركات البحث (SEO) في تطبيقات الويب لمنصة بثواني، مع ضمان تجربة مستخدم شاملة وفعالة.

## التدويل (Internationalization - i18n)

### 1. إعداد نظام التدويل

#### تكوين React i18next
```typescript
// src/i18n/config.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ar from './locales/ar.json';

const resources = {
  en: { translation: en },
  ar: { translation: ar }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ar', // اللغة الافتراضية
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React يتعامل مع الهروب
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage']
    }
  });

export default i18n;
```

#### هيكل ملفات الترجمة
```json
// src/i18n/locales/ar.json
{
  "common": {
    "loading": "جارٍ التحميل...",
    "error": "حدث خطأ",
    "retry": "إعادة المحاولة",
    "cancel": "إلغاء",
    "confirm": "تأكيد"
  },
  "auth": {
    "login": "تسجيل الدخول",
    "register": "إنشاء حساب",
    "logout": "تسجيل الخروج",
    "forgotPassword": "نسيت كلمة المرور؟"
  },
  "products": {
    "title": "المنتجات",
    "price": "السعر",
    "addToCart": "إضافة للسلة",
    "outOfStock": "غير متوفر"
  }
}
```

### 2. استخدام الترجمة في المكونات

```typescript
// ✅ جيد: استخدام React i18next بشكل صحيح
import { useTranslation } from 'react-i18next';

const ProductCard = ({ product }) => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="product-card">
      <h3>{t(`products.${product.category}.name`)}</h3>
      <p>{t('products.price')}: {product.price} {t('common.currency')}</p>

      <button onClick={() => handleAddToCart()}>
        {t('products.addToCart')}
      </button>

      {/* تبديل اللغة */}
      <select onChange={(e) => handleLanguageChange(e.target.value)} value={i18n.language}>
        <option value="ar">العربية</option>
        <option value="en">English</option>
      </select>
    </div>
  );
};
```

### 3. معالجة النصوص المركبة والتواريخ

```typescript
// ✅ جيد: معالجة النصوص المركبة
const OrderStatus = ({ status, count }) => {
  const { t } = useTranslation();

  return (
    <span>
      {t('orders.status', { status, count })}
    </span>
  );
};

// في ملف الترجمة
{
  "orders": {
    "status_one": "طلب واحد في حالة {{status}}",
    "status_other": "{{count}} طلبات في حالة {{status}}",
    "status": "{{count, plural, one {# طلب في حالة #} other {# طلبات في حالة #}}}"
  }
}
```

## الوصول (Accessibility - A11y)

### 1. مبادئ الوصول الأساسية

#### هيكل HTML الدلالي
```typescript
// ✅ جيد: استخدام عناصر دلالية
const AccessibleForm = () => {
  return (
    <form role="form" aria-labelledby="form-title">
      <h2 id="form-title">تسجيل الدخول</h2>

      <div>
        <label htmlFor="email">البريد الإلكتروني:</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          aria-describedby="email-help"
          aria-invalid="false"
        />
        <small id="email-help">سنستخدم هذا البريد للتواصل معك</small>
      </div>

      <button type="submit" aria-busy="false">
        تسجيل الدخول
      </button>
    </form>
  );
};
```

#### دعم لوحة المفاتيح
```typescript
// ✅ جيد: دعم كامل للوحة المفاتيح
const KeyboardAccessibleModal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // تركيز تلقائي على العنصر الأول
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className={isOpen ? 'modal-open' : 'modal-closed'}
    >
      {children}
    </div>
  );
};
```

### 2. أدوات اختبار الوصول

```typescript
// اختبار تلقائي للوصول باستخدام axe-core
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  it('should not have any accessibility violations', async () => {
    const { container } = render(<ProductCard product={mockProduct} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper ARIA attributes', () => {
    render(<AccessibleForm />);

    expect(screen.getByLabelText(/البريد الإلكتروني/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /تسجيل الدخول/ })).toBeInTheDocument();
  });
});
```

## تحسين محركات البحث (SEO)

### 1. إعداد SEO الأساسي

#### تكوين React Helmet
```typescript
// src/components/SEOHead.tsx
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export const SEOHead = ({
  title = 'بثواني - منصة التجارة الإلكترونية الأولى في الشرق الأوسط',
  description = 'اكتشف آلاف المنتجات من أفضل التجار في الشرق الأوسط مع خدمة توصيل سريعة وآمنة',
  keywords = 'تجارة إلكترونية, توصيل, تسوق عبر الإنترنت, الشرق الأوسط',
  image = 'https://bthwani.com/og-image.jpg',
  url = window.location.href
}: SEOHeadProps) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="بثواني" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* إضافية */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Arabic" />
      <link rel="canonical" href={url} />
    </Helmet>
  );
};
```

### 2. تحسين البيانات المنظمة (Structured Data)

```typescript
// إضافة بيانات منظمة للمنتجات
const ProductStructuredData = ({ product }) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.images,
    "brand": {
      "@type": "Brand",
      "name": product.vendor.name
    },
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "SAR",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "url": `${window.location.origin}/products/${product.id}`
    },
    "aggregateRating": product.rating ? {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviewCount
    } : undefined
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};
```

### 3. تحسين الأداء لـ SEO

```typescript
// ✅ جيد: تحميل ذكي للمحتوى
const SEOOptimizedPage = ({ productId }) => {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // جلب البيانات من جانب الخادم إن أمكن
    if (typeof window === 'undefined') {
      // Server-side rendering
      setProduct(window.__INITIAL_DATA__.product);
    } else {
      // Client-side
      fetchProduct(productId).then(setProduct);
    }

    setIsLoading(false);
  }, [productId]);

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <>
      <SEOHead
        title={`${product.name} - بثواني`}
        description={product.description}
        image={product.images[0]}
      />
      <ProductStructuredData product={product} />
      <ProductDetails product={product} />
    </>
  );
};
```

## أدوات وأتمتة الجودة

### 1. أدوات اختبار الوصول والـ SEO

```typescript
// اختبارات تلقائية للوصول والـ SEO
describe('Web Standards Tests', () => {
  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<ProductPage />);

      const headings = screen.getAllByRole('heading');
      expect(headings[0]).toHaveTextContent(/منتج/i);
      expect(headings[0].tagName).toBe('H1');
    });

    it('should have alt text for all images', () => {
      render(<ProductGallery />);

      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('alt');
        expect(img.alt).not.toBe('');
      });
    });

    it('should be keyboard navigable', async () => {
      render(<Navigation />);

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();

      // اختبار التنقل بلوحة المفاتيح
      await userEvent.tab();
      expect(screen.getByText('الرئيسية')).toHaveFocus();
    });
  });

  describe('SEO', () => {
    it('should have proper meta tags', () => {
      render(<ProductPage />);

      expect(document.title).toContain('بثواني');
      expect(document.querySelector('meta[name="description"]')).toHaveAttribute('content');
      expect(document.querySelector('meta[property="og:title"]')).toBeInTheDocument();
    });

    it('should have structured data', () => {
      render(<ProductPage />);

      const structuredData = document.querySelector('script[type="application/ld+json"]');
      expect(structuredData).toBeInTheDocument();

      const data = JSON.parse(structuredData.textContent);
      expect(data['@type']).toBe('Product');
    });
  });
});
```

### 2. مراقبة SEO وA11y

```typescript
// لوحة مراقبة الويب الأساسي
const WebStandardsDashboard = () => {
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    const fetchMetrics = async () => {
      const data = await Promise.all([
        getSEOHealth(),
        getAccessibilityScore(),
        getCoreWebVitals(),
        getLighthouseScores()
      ]);

      setMetrics({
        seo: data[0],
        accessibility: data[1],
        performance: data[2],
        lighthouse: data[3]
      });
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 3600000); // كل ساعة

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="web-standards-dashboard">
      <div className="seo-metrics">
        <h3>مقاييس SEO</h3>
        <MetricCard title="درجة الصحة" value={`${metrics.seo?.health}%`} />
        <MetricCard title="الروابط الخلفية" value={metrics.seo?.backlinks} />
      </div>

      <div className="a11y-metrics">
        <h3>مقاييس الوصول</h3>
        <MetricCard title="درجة الوصول" value={`${metrics.accessibility?.score}/100`} />
        <MetricCard title="مشاكل الوصول" value={metrics.accessibility?.issues} />
      </div>

      <div className="performance-metrics">
        <h3>مقاييس الأداء</h3>
        <MetricCard title="LCP" value={`${metrics.performance?.lcp}ms`} />
        <MetricCard title="CLS" value={metrics.performance?.cls} />
      </div>
    </div>
  );
};
```

## الخلاصة والتوصيات

### النتائج الحالية
- ✅ **تدويل شامل**: دعم كامل للعربية والإنجليزية مع React i18next
- ✅ **وصول ممتاز**: تطبيق معايير WCAG 2.1 AA عبر جميع التطبيقات
- ✅ **SEO محسن**: تحسين شامل لمحركات البحث مع بيانات منظمة
- ✅ **اختبارات تلقائية**: تغطية شاملة لاختبارات الوصول والـ SEO
- ✅ **مراقبة مستمرة**: مراقبة يومية لمقاييس الجودة والأداء

### التوصيات الرئيسية

1. **توسيع اللغات**: إضافة المزيد من اللغات حسب التوسع الجغرافي
2. **تحسين مستمر للوصول**: مراجعة دورية لمعايير الوصول وتطبيق التحسينات
3. **مراقبة SEO متقدمة**: تطبيق مراقبة تنبؤية للتغييرات في خوارزميات البحث
4. **تدريب الفريق**: تدريب منتظم على ممارسات الوصول وSEO
5. **أتمتة المزيد**: زيادة الأتمتة في اختبارات الجودة والمراقبة

### مؤشرات الجودة للويب

| المؤشر | الهدف | طريقة القياس | تكرار المراجعة |
|---------|-------|-------------|----------------|
| **درجة الوصول** | > 95 | أدوات مثل axe-core وLighthouse | مع كل إصدار |
| **درجة SEO** | > 90 | أدوات مثل SEMrush وAhrefs | أسبوعي |
| **سرعة التحميل** | < 2 ثانية | مراقبة Core Web Vitals | يومي |
| **تغطية الترجمة** | 100% | مراجعة يدوية للنصوص غير المترجمة | مع كل إصدار |
| **امتثال WCAG** | AA | اختبارات تلقائية ويدوية | ربع سنوي |

---

هذا الدليل يُحدث ربع سنوياً مع مراجعة شاملة لمعايير الويب الجديدة وتحسين الممارسات بناءً على التطورات التقنية وتعليقات المستخدمين.
