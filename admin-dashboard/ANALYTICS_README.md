# 📊 Analytics System - دليل الاستخدام السريع

## 🚀 نظرة عامة

نظام تحليلات شامل يربط **30 endpoint** من الـ Backend مع **7 dashboards** في الـ Frontend.

---

## 📁 هيكل الملفات

```
admin-dashboard/
├── src/
│   ├── types/
│   │   └── analytics.ts          # 50+ TypeScript types
│   ├── api/
│   │   └── analytics-new.ts      # 30+ React hooks
│   ├── config/
│   │   └── admin-endpoints.ts    # 32 endpoints configured
│   └── pages/admin/analytics/
│       ├── AnalyticsDashboard.tsx    # الصفحة الرئيسية
│       ├── ROASDashboard.tsx         # ROAS
│       ├── KPIDashboard.tsx          # KPIs
│       ├── AdvancedAnalytics.tsx     # Advanced
│       ├── FunnelDashboard.tsx       # Funnel
│       ├── UsersDashboard.tsx        # Users
│       └── RevenueDashboard.tsx      # Revenue
└── docs/
    ├── ANALYTICS_FINAL_IMPLEMENTATION_REPORT.md  # التقرير الكامل
    ├── ANALYTICS_ENDPOINTS_AUDIT_REPORT.md      # تقرير الفحص
    ├── ANALYTICS_QUICK_SUMMARY.md               # ملخص سريع
    └── ANALYTICS_DONE.md                        # الإنجاز
```

---

## 🎯 الـ Dashboards

### 1. **Analytics Dashboard** (الرئيسية)
- 6 بطاقات تفاعلية
- روابط سريعة لجميع الأقسام

### 2. **ROAS Dashboard**
- إجمالي الإنفاق الإعلاني
- إجمالي الإيرادات
- متوسط ROAS
- أفضل/أسوأ يوم
- الأداء حسب المنصة

### 3. **KPI Dashboard**
- بيانات حية (كل 30 ثانية)
- 6 مؤشرات رئيسية
- ملخص الأداء

### 4. **Advanced Analytics**
- القيمة الدائمة (LTV)
- معدل التراجع (Churn)
- التوزيع الجغرافي
- ساعات الذروة
- أداء المنتجات والسائقين

### 5. **Funnel Dashboard**
- Funnel visualization
- Drop-off analysis
- اقتراحات التحسين

### 6. **Users Dashboard**
- نمو المستخدمين
- معدل الاحتفاظ
- تحليل الأفواج

### 7. **Revenue Dashboard**
- توقعات الإيرادات
- Confidence levels
- Revenue breakdown

---

## 💻 أمثلة الاستخدام

### استخدام Hook بسيط:
```typescript
import { useDailyRoas } from '@/api/analytics-new';

function MyComponent() {
  const { data, loading, error } = useDailyRoas({
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    platform: 'facebook'
  });

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error.message}</Alert>;

  return (
    <div>
      {data?.data?.map(item => (
        <div key={item.date}>
          {item.date}: ROAS = {item.roas.toFixed(2)}
        </div>
      ))}
    </div>
  );
}
```

### استخدام Real-time KPIs:
```typescript
import { useRealTimeKPIs } from '@/api/analytics-new';

function RealTimeStats() {
  // تحديث تلقائي كل 30 ثانية
  const { data } = useRealTimeKPIs();

  return (
    <div>
      <h3>مستخدمين نشطين: {data?.data?.activeUsers}</h3>
      <h3>طلبات نشطة: {data?.data?.activeOrders}</h3>
    </div>
  );
}
```

### استخدام Mutation API:
```typescript
import { useAnalyticsAPI } from '@/api/analytics-new';

function RecordAdSpend() {
  const api = useAnalyticsAPI();

  const handleSubmit = async () => {
    const result = await api.recordAdSpend({
      date: '2025-01-15',
      platform: 'facebook',
      campaignName: 'Winter Campaign',
      amount: 5000,
      impressions: 100000,
      clicks: 5000,
      conversions: 250
    });
    console.log('Success:', result);
  };

  return <button onClick={handleSubmit}>Record Ad Spend</button>;
}
```

---

## 🎨 الـ Types المتاحة

```typescript
// استيراد جميع الـ types
import type * as AnalyticsTypes from '@/types/analytics';

// أو استيراد محدد
import type { 
  DailyRoas, 
  KPIData, 
  CustomerLTV 
} from '@/types/analytics';

// مثال
const roasData: AnalyticsTypes.DailyRoas = {
  date: '2025-01-15',
  platform: 'facebook',
  adSpend: 1000,
  revenue: 3500,
  roas: 3.5,
  impressions: 50000,
  clicks: 2500,
  conversions: 125
};
```

---

## 📊 الـ Hooks المتاحة

### ROAS (3 hooks)
- `useDailyRoas(query?)`
- `useRoasSummary(query?)`
- `useRoasByPlatform(query?)`

### Ad Spend (2 hooks)
- `useAdSpend(query?)`
- `useAdSpendSummary(query?)`

### KPIs (3 hooks)
- `useKPIs(query?)`
- `useRealTimeKPIs()` - auto-refresh
- `useKPITrends(query)`

### Marketing Events (2 hooks)
- `useEvents(query?)`
- `useEventsSummary(query?)`

### Funnel (2 hooks)
- `useConversionFunnel(query?)`
- `useDropOffPoints()`

### Users (3 hooks)
- `useUserGrowth(query)`
- `useUserRetention()`
- `useCohortAnalysis(query)`

### Revenue (2 hooks)
- `useRevenueForecast()`
- `useRevenueBreakdown(query?)`

### Advanced (10 hooks)
- `useDashboardOverview(query?)`
- `useCohortAnalysisAdvanced(type?)`
- `useFunnelAnalysis(query)`
- `useRetentionRate(period?)`
- `useCustomerLTV()`
- `useChurnRate(period?)`
- `useGeographicDistribution(metric?)`
- `usePeakHours()`
- `useProductPerformance(query?)`
- `useDriverPerformance(query?)`

---

## ⚙️ الإعداد المطلوب

### 1. إضافة Routes

في `src/routes/admin-routes.tsx`:

```typescript
import AnalyticsDashboard from '@/pages/admin/analytics/AnalyticsDashboard';
import ROASDashboard from '@/pages/admin/analytics/ROASDashboard';
import KPIDashboard from '@/pages/admin/analytics/KPIDashboard';
import AdvancedAnalytics from '@/pages/admin/analytics/AdvancedAnalytics';
import FunnelDashboard from '@/pages/admin/analytics/FunnelDashboard';
import UsersDashboard from '@/pages/admin/analytics/UsersDashboard';
import RevenueDashboard from '@/pages/admin/analytics/RevenueDashboard';

// في الـ routes array:
{
  path: '/admin/analytics',
  element: <AnalyticsDashboard />,
},
{
  path: '/admin/analytics/roas',
  element: <ROASDashboard />,
},
{
  path: '/admin/analytics/kpis',
  element: <KPIDashboard />,
},
{
  path: '/admin/analytics/advanced',
  element: <AdvancedAnalytics />,
},
{
  path: '/admin/analytics/funnel',
  element: <FunnelDashboard />,
},
{
  path: '/admin/analytics/users',
  element: <UsersDashboard />,
},
{
  path: '/admin/analytics/revenue',
  element: <RevenueDashboard />,
},
```

### 2. التأكد من الـ Backend

تأكد من أن الـ backend يرجع البيانات بالصيغة:
```typescript
{
  data: T,
  success: boolean,
  message?: string
}
```

---

## 🔐 Authentication

جميع الـ endpoints تتطلب:
- ✅ Bearer Token في الـ headers
- ✅ Role: `admin` أو `superadmin`

---

## 📅 صيغة التواريخ

استخدم صيغة: `YYYY-MM-DD`

```typescript
const query = {
  startDate: '2025-01-01',
  endDate: '2025-01-31'
};
```

---

## 🎯 Query Parameters

### DateRangeQuery
```typescript
{
  startDate?: string;
  endDate?: string;
}
```

### PlatformQuery
```typescript
{
  startDate?: string;
  endDate?: string;
  platform?: string; // 'facebook' | 'google' | 'instagram' | 'snapchat'
}
```

### PeriodQuery
```typescript
{
  startDate?: string;
  endDate?: string;
  period?: 'daily' | 'weekly' | 'monthly';
}
```

---

## 🐛 Error Handling

جميع الـ hooks ترجع:
```typescript
{
  data,      // البيانات
  loading,   // حالة التحميل
  error,     // الأخطاء
  refetch    // إعادة التحميل
}
```

مثال:
```typescript
const { data, loading, error, refetch } = useKPIs();

if (loading) return <CircularProgress />;
if (error) return <Alert severity="error">{error.message}</Alert>;
if (!data) return <Alert severity="info">لا توجد بيانات</Alert>;

return <div>{/* عرض البيانات */}</div>;
```

---

## 📚 التوثيق الكامل

- **ANALYTICS_FINAL_IMPLEMENTATION_REPORT.md** - التقرير الكامل المفصل
- **ANALYTICS_ENDPOINTS_AUDIT_REPORT.md** - تقرير الفحص والتدقيق
- **ANALYTICS_QUICK_SUMMARY.md** - الملخص السريع
- **ANALYTICS_DONE.md** - ملخص الإنجاز

---

## ✅ Checklist

- [x] Configuration: 30 endpoints ✅
- [x] TypeScript Types: 50+ ✅
- [x] React Hooks: 30+ ✅
- [x] UI Dashboards: 7 ✅
- [x] Documentation: 4 files ✅
- [ ] Routes: يدوياً ⚠️

---

## 🎉 النتيجة

**نظام تحليلات شامل جاهز للاستخدام!**

- ✅ 100% Type-safe
- ✅ Real-time data
- ✅ Beautiful UI
- ✅ Comprehensive documentation

---

**آخر تحديث**: 2025-10-15  
**الحالة**: ✅ مكتمل

