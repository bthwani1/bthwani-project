# 🚀 دليل البدء السريع

## ✅ ما تم إنجازه

```
✅ 110 Admin Endpoints متاحة
✅ 28 ملف API
✅ 3 Hooks قوية (useAdminAPI, useAdminQuery, useAdminMutation)
✅ 3 صفحات جديدة (Marketers, Onboarding, Analytics)
✅ بدون أخطاء linter
```

---

## 🔧 خطوات التشغيل

### 1. أضف الصفحات للـ Routes

افتح ملف الـ routes الخاص بك (مثل `src/App.tsx` أو `src/routes/index.tsx`):

```typescript
// استيراد الصفحات
import MarketersListPage from '@/pages/admin/marketers/MarketersListPage';
import OnboardingListPage from '@/pages/admin/onboarding/OnboardingListPage';
import AnalyticsDashboard from '@/pages/admin/analytics/AnalyticsDashboard';
import ApiTestPage from '@/pages/admin/test/ApiTestPage';

// أضف Routes:
{
  path: '/admin/marketers',
  element: <MarketersListPage />
},
{
  path: '/admin/onboarding',
  element: <OnboardingListPage />
},
{
  path: '/admin/analytics',
  element: <AnalyticsDashboard />
},
{
  path: '/admin/test/api',
  element: <ApiTestPage />
}
```

### 2. شغّل Dev Server

```bash
npm run dev
```

### 3. افتح الصفحات

```
http://localhost:5173/admin/marketers
http://localhost:5173/admin/onboarding
http://localhost:5173/admin/analytics
http://localhost:5173/admin/test/api
```

---

## 💡 أمثلة الاستخدام

### مثال 1: جلب قائمة المسوقين

```typescript
import { useMarketers } from '@/api';

function MyComponent() {
  const { data, loading } = useMarketers({ page: '1', limit: '20' });
  
  if (loading) return <CircularProgress />;
  
  return (
    <div>
      {data?.data.map(marketer => (
        <div key={marketer._id}>{marketer.name}</div>
      ))}
    </div>
  );
}
```

### مثال 2: إنشاء مسوق جديد

```typescript
import { useCreateMarketer } from '@/api';

function CreateMarketerForm() {
  const { mutate, loading } = useCreateMarketer({
    onSuccess: () => alert('تم الإنشاء!'),
  });

  const handleSubmit = (data) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={loading}>
        إنشاء
      </button>
    </form>
  );
}
```

### مثال 3: الموافقة على طلب انضمام

```typescript
import { useApproveApplication } from '@/api';

function ApproveButton({ applicationId }) {
  const { mutate, loading } = useApproveApplication({
    onSuccess: () => alert('تمت الموافقة'),
  });

  const handleApprove = () => {
    mutate({ notes: 'موافق' }, { params: { id: applicationId } });
  };

  return (
    <button onClick={handleApprove} disabled={loading}>
      موافقة
    </button>
  );
}
```

---

## 📁 هيكل الملفات

```
src/
├── config/
│   ├── admin-endpoints.ts      ← 110 endpoints
│   └── README.md
├── hooks/
│   ├── useAdminAPI.ts          ← 3 hooks
│   ├── examples/               ← 9 أمثلة
│   └── README.md
├── api/
│   ├── index.ts                ← تصدير موحد
│   ├── marketers.ts            ← 7 endpoints
│   ├── onboarding.ts           ← 6 endpoints
│   ├── finance.ts              ← 8 endpoints
│   ├── analytics.ts            ← 9 endpoints
│   └── ... (24 ملف آخر)
└── pages/admin/
    ├── marketers/
    │   └── MarketersListPage.tsx
    ├── onboarding/
    │   └── OnboardingListPage.tsx
    ├── analytics/
    │   └── AnalyticsDashboard.tsx
    └── test/
        └── ApiTestPage.tsx
```

---

## 🧪 الاختبار

### صفحة الاختبار التفاعلية:

1. شغّل الـ server: `npm run dev`
2. افتح: `http://localhost:5173/admin/test/api`
3. جرّب الأزرار لاختبار الـ endpoints

---

## 📚 التوثيق الكامل

- [INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md) - ملخص شامل
- [PROGRESS.md](./PROGRESS.md) - التقدم التفصيلي
- [src/config/README.md](./src/config/README.md) - دليل Endpoints
- [src/hooks/README.md](./src/hooks/README.md) - دليل Hooks

---

## ⚙️ Environment Variables

تأكد من وجود `.env`:

```env
VITE_API_BASE_URL=https://api.bthwani.com/api/v1
```

---

## 🎯 الخطوات التالية

### الآن يمكنك:

1. ✅ استخدام أي من الـ 110 endpoints
2. ✅ إنشاء صفحات جديدة بنفس النمط
3. ✅ إضافة المزيد من الـ features حسب الحاجة
4. ✅ اختبار الـ API من صفحة الاختبار

### لإضافة صفحة جديدة:

```typescript
// 1. استورد الـ hook
import { useDrivers } from '@/api';

// 2. استخدمه في component
const { data, loading } = useDrivers({ page: '1' });

// 3. عرض البيانات
return <div>{data?.total} سائقين</div>;
```

---

**جاهز للاستخدام! 🎉**

