# 🚀 خطة التكامل العملية: Dashboard ← Backend Endpoints

**المدة المتوقعة:** 2-3 أسابيع  
**تاريخ البدء:** 15 أكتوبر 2025

---

## 📦 الخطوة 1: نقل ملفات Endpoints (يوم 1)

### 1.1 نسخ الملفات
```bash
# من مجلد backend-nest للـ admin-dashboard
cd admin-dashboard

# إنشاء المجلدات
mkdir -p src/config
mkdir -p public/data

# نسخ الملفات
cp ../backend-nest/docs/admin-endpoints.ts src/config/
cp ../backend-nest/docs/admin-endpoints.json public/data/
cp ../backend-nest/docs/examples/dashboard-integration.tsx src/examples/
```

### 1.2 تحديث الـ imports
```typescript
// src/config/admin-endpoints.ts
// تعديل الـ baseURL ليناسب الـ dashboard
export function buildEndpointUrl(
  endpoint: AdminEndpoint,
  params?: Record<string, string>,
  baseUrl: string = import.meta.env.VITE_API_BASE_URL || 'https://api.bthwani.com/api/v1'
): string {
  // ...
}
```

### 1.3 إضافة للـ tsconfig
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/config/*": ["./src/config/*"]
    }
  }
}
```

---

## 🔧 الخطوة 2: إنشاء API Hook موحد (يوم 2)

### 2.1 إنشاء useAdminAPI Hook
```typescript
// src/hooks/useAdminAPI.ts
import { useState } from 'react';
import type { AdminEndpoint } from '@/config/admin-endpoints';
import { buildEndpointUrl } from '@/config/admin-endpoints';
import axiosInstance from '@/utils/axios';

interface UseAdminAPIOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export function useAdminAPI(options?: UseAdminAPIOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function callEndpoint<T = any>(
    endpoint: AdminEndpoint,
    config?: {
      params?: Record<string, string>;
      body?: any;
      query?: Record<string, string>;
    }
  ): Promise<T> {
    setLoading(true);
    setError(null);

    try {
      let url = buildEndpointUrl(endpoint, config?.params);
      
      // Add query parameters
      if (config?.query) {
        const queryString = new URLSearchParams(config.query).toString();
        url += `?${queryString}`;
      }

      const response = await axiosInstance.request({
        method: endpoint.method,
        url,
        data: config?.body,
      });

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (err: any) {
      setError(err);
      options?.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { callEndpoint, loading, error };
}
```

### 2.2 اختبار الـ Hook
```typescript
// src/pages/admin/test/ApiTestPage.tsx
import { useAdminAPI } from '@/hooks/useAdminAPI';
import { getEndpointById } from '@/config/admin-endpoints';

export function ApiTestPage() {
  const { callEndpoint, loading } = useAdminAPI();

  async function testDriversEndpoint() {
    const endpoint = getEndpointById('admin-drivers-all');
    if (!endpoint) return;

    const data = await callEndpoint(endpoint, {
      query: { page: '1', limit: '20' }
    });
    console.log('Drivers:', data);
  }

  return (
    <button onClick={testDriversEndpoint} disabled={loading}>
      {loading ? 'Loading...' : 'Test API'}
    </button>
  );
}
```

---

## 📝 الخطوة 3: إنشاء API Files المفقودة (يوم 3-5)

### 3.1 Marketers API
```typescript
// src/api/marketers.ts
import axiosInstance from '../utils/axios';
import type { AdminEndpoint } from '@/config/admin-endpoints';
import { getEndpointsByModule } from '@/config/admin-endpoints';

export interface Marketer {
  _id: string;
  fullName: string;
  phone: string;
  email?: string;
  status: 'active' | 'inactive';
  commissionRate: number;
  totalEarnings: number;
  totalStoresOnboarded: number;
}

// استخدام الـ endpoints من الـ config
const marketerEndpoints = getEndpointsByModule('marketers');

export async function getAllMarketers(params?: {
  status?: string;
  page?: number;
  limit?: number;
}) {
  const endpoint = marketerEndpoints.find(ep => ep.handler === 'getAllMarketers');
  if (!endpoint) throw new Error('Endpoint not found');

  const response = await axiosInstance.get(endpoint.fullPath, { params });
  return response.data;
}

export async function getMarketerDetails(marketerId: string) {
  const endpoint = marketerEndpoints.find(ep => ep.handler === 'getMarketerDetails');
  if (!endpoint) throw new Error('Endpoint not found');

  const url = endpoint.fullPath.replace(':id', marketerId);
  const response = await axiosInstance.get(url);
  return response.data;
}

export async function createMarketer(data: {
  name: string;
  phone: string;
  email?: string;
}) {
  const endpoint = marketerEndpoints.find(ep => ep.handler === 'createMarketer');
  if (!endpoint) throw new Error('Endpoint not found');

  const response = await axiosInstance.post(endpoint.fullPath, data);
  return response.data;
}

export async function updateMarketer(marketerId: string, updates: Partial<Marketer>) {
  const endpoint = marketerEndpoints.find(ep => ep.handler === 'updateMarketer');
  if (!endpoint) throw new Error('Endpoint not found');

  const url = endpoint.fullPath.replace(':id', marketerId);
  const response = await axiosInstance.patch(url, { updates });
  return response.data;
}

export async function activateMarketer(marketerId: string) {
  const endpoint = marketerEndpoints.find(ep => ep.handler === 'activateMarketer');
  if (!endpoint) throw new Error('Endpoint not found');

  const url = endpoint.fullPath.replace(':id', marketerId);
  const response = await axiosInstance.post(url);
  return response.data;
}

export async function deactivateMarketer(marketerId: string, reason: string) {
  const endpoint = marketerEndpoints.find(ep => ep.handler === 'deactivateMarketer');
  if (!endpoint) throw new Error('Endpoint not found');

  const url = endpoint.fullPath.replace(':id', marketerId);
  const response = await axiosInstance.post(url, { reason });
  return response.data;
}
```

### 3.2 Onboarding API
```typescript
// src/api/onboarding.ts
import axiosInstance from '../utils/axios';
import { getEndpointsByModule } from '@/config/admin-endpoints';

const onboardingEndpoints = getEndpointsByModule('onboarding');

export interface OnboardingApplication {
  _id: string;
  type: 'store' | 'vendor';
  businessName: string;
  ownerName: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected';
  referredBy?: string;
  createdAt: string;
}

export async function getOnboardingApplications(params?: {
  status?: string;
  type?: string;
  page?: number;
  limit?: number;
}) {
  const response = await axiosInstance.get('/admin/onboarding/applications', { params });
  return response.data;
}

export async function getOnboardingDetails(applicationId: string) {
  const response = await axiosInstance.get(`/admin/onboarding/${applicationId}/details`);
  return response.data;
}

export async function approveOnboarding(applicationId: string) {
  const response = await axiosInstance.patch(`/admin/onboarding/${applicationId}/approve`);
  return response.data;
}

export async function rejectOnboarding(applicationId: string, reason: string) {
  const response = await axiosInstance.patch(`/admin/onboarding/${applicationId}/reject`, {
    reason
  });
  return response.data;
}

export async function getOnboardingStatistics() {
  const response = await axiosInstance.get('/admin/onboarding/statistics');
  return response.data;
}
```

### 3.3 Akhdimni API
```typescript
// src/api/akhdimni.ts
import axiosInstance from '../utils/axios';

export interface Errand {
  _id: string;
  orderId: string;
  customer: {
    name: string;
    phone: string;
  };
  pickup: {
    address: string;
    location: { lat: number; lng: number };
  };
  dropoff: {
    address: string;
    location: { lat: number; lng: number };
  };
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  assignedDriver?: string;
  price: number;
  createdAt: string;
}

export async function getAllErrands(params?: {
  status?: string;
  limit?: number;
  cursor?: string;
}) {
  const response = await axiosInstance.get('/akhdimni/admin/errands', { params });
  return response.data;
}

export async function assignDriver(errandId: string, driverId: string) {
  const response = await axiosInstance.post(
    `/akhdimni/admin/errands/${errandId}/assign-driver`,
    { driverId }
  );
  return response.data;
}
```

### 3.4 Audit Logs API
```typescript
// src/api/audit-logs.ts
import axiosInstance from '../utils/axios';

export interface AuditLog {
  _id: string;
  action: string;
  userId: string;
  userModel: string;
  metadata: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export async function getAuditLogs(params?: {
  action?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
}) {
  const response = await axiosInstance.get('/admin/audit-logs', { params });
  return response.data;
}

export async function getAuditLogDetails(logId: string) {
  const response = await axiosInstance.get(`/admin/audit-logs/${logId}`);
  return response.data;
}
```

### 3.5 Commission Plans API
```typescript
// src/api/commission-plans.ts
import axiosInstance from '../utils/axios';

export interface CommissionPlan {
  _id: string;
  name: string;
  type: 'percentage' | 'fixed' | 'tiered';
  rate: number;
  minOrders?: number;
  maxOrders?: number;
  isActive: boolean;
  createdAt: string;
}

export async function getCommissionPlans() {
  const response = await axiosInstance.get('/admin/commission-plans');
  return response.data;
}

export async function createCommissionPlan(data: Omit<CommissionPlan, '_id' | 'createdAt'>) {
  const response = await axiosInstance.post('/admin/commission-plans', data);
  return response.data;
}

export async function updateCommissionPlan(planId: string, updates: Partial<CommissionPlan>) {
  const response = await axiosInstance.patch(`/admin/commission-plans/${planId}`, updates);
  return response.data;
}
```

---

## 🎨 الخطوة 4: إنشاء Pages المفقودة (يوم 6-10)

### 4.1 Marketers Details Page
```typescript
// src/pages/admin/marketers/MarketerDetailsPage.tsx
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMarketerDetails } from '@/api/marketers';
import { Box, Typography, Card, Grid } from '@mui/material';

export function MarketerDetailsPage() {
  const { id } = useParams<{ id: string }>();
  
  const { data: marketer, isLoading } = useQuery({
    queryKey: ['marketer', id],
    queryFn: () => getMarketerDetails(id!),
    enabled: !!id,
  });

  if (isLoading) return <div>Loading...</div>;
  if (!marketer) return <div>Not found</div>;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        تفاصيل المسوق: {marketer.marketer.fullName}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">إجمالي المتاجر</Typography>
            <Typography variant="h3">{marketer.stats.totalStores}</Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">المتاجر النشطة</Typography>
            <Typography variant="h3">{marketer.stats.activeStores}</Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">إجمالي الأرباح</Typography>
            <Typography variant="h3">{marketer.stats.totalEarnings} ريال</Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
```

### 4.2 Akhdimni Page
```typescript
// src/pages/admin/akhdimni/ErrandsPage.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllErrands } from '@/api/akhdimni';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, Chip } from '@mui/material';

export function ErrandsPage() {
  const [status, setStatus] = useState<string>();

  const { data, isLoading } = useQuery({
    queryKey: ['errands', status],
    queryFn: () => getAllErrands({ status }),
  });

  const columns = [
    { field: 'orderId', headerName: 'رقم الطلب', width: 150 },
    { field: 'customer.name', headerName: 'العميل', width: 200 },
    {
      field: 'status',
      headerName: 'الحالة',
      width: 150,
      renderCell: (params: any) => (
        <Chip label={params.value} color="primary" />
      ),
    },
    { field: 'price', headerName: 'السعر', width: 100 },
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        طلبات أخدمني
      </Typography>

      <DataGrid
        rows={data?.data || []}
        columns={columns}
        loading={isLoading}
        getRowId={(row) => row._id}
      />
    </Box>
  );
}
```

---

## 🔐 الخطوة 5: تحديث Permissions System (يوم 11-12)

### 5.1 إنشاء usePermissions Hook
```typescript
// src/hooks/usePermissions.ts
import { useMemo } from 'react';
import { useAdminUser } from './useAdminUser';
import { filterEndpointsByPermissions, type AdminEndpoint } from '@/config/admin-endpoints';

export function usePermissions() {
  const { adminUser } = useAdminUser();

  const allowedEndpoints = useMemo(() => {
    if (!adminUser) return [];
    return filterEndpointsByPermissions(adminUser.roles || ['admin']);
  }, [adminUser]);

  const canAccess = (endpoint: AdminEndpoint | string) => {
    if (typeof endpoint === 'string') {
      return allowedEndpoints.some(ep => ep.id === endpoint);
    }
    return allowedEndpoints.some(ep => ep.id === endpoint.id);
  };

  return {
    allowedEndpoints,
    canAccess,
  };
}
```

### 5.2 ProtectedRoute Component
```typescript
// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { usePermissions } from '@/hooks/usePermissions';

interface ProtectedRouteProps {
  endpointId: string;
  children: React.ReactNode;
}

export function ProtectedRoute({ endpointId, children }: ProtectedRouteProps) {
  const { canAccess } = usePermissions();

  if (!canAccess(endpointId)) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  return <>{children}</>;
}
```

---

## 📊 الخطوة 6: تحديث Sidebar (يوم 13-14)

### 6.1 Dynamic Sidebar من Endpoints
```typescript
// src/components/DynamicSidebar.tsx
import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { ADMIN_ENDPOINTS_BY_MODULE } from '@/config/admin-endpoints';
import { usePermissions } from '@/hooks/usePermissions';

export function DynamicSidebar() {
  const { allowedEndpoints } = usePermissions();

  const visibleModules = useMemo(() => {
    return Object.values(ADMIN_ENDPOINTS_BY_MODULE)
      .map(module => ({
        ...module,
        endpoints: module.endpoints.filter(ep =>
          allowedEndpoints.some(allowed => allowed.id === ep.id)
        ),
      }))
      .filter(module => module.endpoints.length > 0);
  }, [allowedEndpoints]);

  return (
    <nav>
      {visibleModules.map(module => (
        <div key={module.name}>
          <h3>{module.displayName}</h3>
          {module.endpoints.map(endpoint => (
            <NavLink key={endpoint.id} to={endpoint.fullPath}>
              <span>{endpoint.icon}</span>
              <span>{endpoint.summary}</span>
            </NavLink>
          ))}
        </div>
      ))}
    </nav>
  );
}
```

---

## ✅ Checklist التنفيذ

### Week 1: Foundation
- [ ] نقل ملفات endpoints
- [ ] إنشاء useAdminAPI Hook
- [ ] اختبار الـ Hook
- [ ] إنشاء Marketers API
- [ ] إنشاء Onboarding API

### Week 2: Integration
- [ ] إنشاء Akhdimni API
- [ ] إنشاء Audit Logs API
- [ ] إنشاء Commission Plans API
- [ ] إنشاء Pages المفقودة
- [ ] تحديث Permissions System

### Week 3: Finalization
- [ ] تحديث Sidebar
- [ ] اختبار كل الـ endpoints
- [ ] توثيق التغييرات
- [ ] Code review
- [ ] Deployment

---

## 🎯 النتائج المتوقعة

بعد تنفيذ هذه الخطة:
- ✅ **100%** تكامل بين Backend و Dashboard
- ✅ **Type-safe** API calls
- ✅ **Dynamic** Sidebar
- ✅ **Permission-based** access control
- ✅ **Centralized** endpoints configuration

---

**Next Steps:** ابدأ بالخطوة 1 ونفذها خطوة بخطوة!

