/**
 * مثال على كيفية إضافة Routes الجديدة
 * انسخ هذا الكود إلى ملف الـ routes الخاص بك
 * 
 * ملاحظة: هذا ملف مثال فقط - انسخ الكود الذي تحتاجه
 */

// import { lazy } from 'react';

// Lazy load للصفحات (uncomment to use)
// const MarketersListPage = lazy(() => import('@/pages/admin/marketers/MarketersListPage'));
// const OnboardingListPage = lazy(() => import('@/pages/admin/onboarding/OnboardingListPage'));
// const AnalyticsDashboard = lazy(() => import('@/pages/admin/analytics/AnalyticsDashboard'));
// const FinanceDashboard = lazy(() => import('@/pages/admin/finance/FinanceDashboard'));
// const ApiTestPage = lazy(() => import('@/pages/admin/test/ApiTestPage'));

/**
 * Admin Routes - أضف هذه إلى ملف الـ routes الخاص بك
 */

/*
export const adminRoutes = [
  // التحليلات
  {
    path: '/admin/analytics',
    element: <AnalyticsDashboard />,
  },
  
  // المسوقين
  {
    path: '/admin/marketers',
    element: <MarketersListPage />,
  },
  
  // طلبات الانضمام
  {
    path: '/admin/onboarding',
    element: <OnboardingListPage />,
  },
  
  // النظام المالي
  {
    path: '/admin/finance',
    element: <FinanceDashboard />,
  },
  
  // صفحة اختبار API
  {
    path: '/admin/test/api',
    element: <ApiTestPage />,
  },
];
*/

/**
 * إذا كنت تستخدم React Router v6:
 */

/*
import { Routes, Route } from 'react-router-dom';

export function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
      <Route path="/admin/marketers" element={<MarketersListPage />} />
      <Route path="/admin/onboarding" element={<OnboardingListPage />} />
      <Route path="/admin/finance" element={<FinanceDashboard />} />
      <Route path="/admin/test/api" element={<ApiTestPage />} />
    </Routes>
  );
}
*/

/**
 * إذا كنت تستخدم نظام routes مخصص:
 */
export const customAdminRoutes = {
  analytics: {
    path: '/admin/analytics',
    component: AnalyticsDashboard,
    title: 'التحليلات',
    icon: 'assessment',
  },
  marketers: {
    path: '/admin/marketers',
    component: MarketersListPage,
    title: 'المسوقين',
    icon: 'people',
  },
  onboarding: {
    path: '/admin/onboarding',
    component: OnboardingListPage,
    title: 'طلبات الانضمام',
    icon: 'person_add',
  },
  finance: {
    path: '/admin/finance',
    component: FinanceDashboard,
    title: 'النظام المالي',
    icon: 'account_balance',
  },
  testApi: {
    path: '/admin/test/api',
    component: ApiTestPage,
    title: 'اختبار API',
    icon: 'bug_report',
  },
};

