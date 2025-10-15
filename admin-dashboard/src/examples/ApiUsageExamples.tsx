/**
 * أمثلة عملية على استخدام الـ API الجديد
 */

import { useState } from 'react';
import { Box, Button, Typography, CircularProgress, Alert } from '@mui/material';

// ==================== مثال 1: Marketers ====================

import { useMarketers, useCreateMarketer } from '@/api/marketers';

export function MarketersExample() {
  // جلب القائمة
  const { data, loading, refetch } = useMarketers({
    page: '1',
    limit: '20',
    status: 'active',
  });

  // إنشاء مسوق جديد
  const { mutate: createMarketer, loading: creating } = useCreateMarketer({
    onSuccess: () => {
      alert('تم إنشاء المسوق!');
      refetch(); // تحديث القائمة
    },
  });

  const handleCreate = () => {
    createMarketer({
      name: 'محمد أحمد',
      phone: '0512345678',
      email: 'mohamed@example.com',
      commissionRate: 5,
    });
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h6">المسوقين ({data?.total})</Typography>
      <Button onClick={handleCreate} disabled={creating}>
        إضافة مسوق
      </Button>
      {data?.data?.map((marketer) => (
        <div key={marketer._id}>{marketer.name}</div>
      ))}
    </Box>
  );
}

// ==================== مثال 2: Onboarding ====================

import { useOnboardingApplications, useApproveApplication } from '@/api/onboarding';

export function OnboardingExample() {
  const { data, loading, refetch } = useOnboardingApplications({
    status: 'pending',
  });

  const { mutate: approve } = useApproveApplication({
    onSuccess: () => {
      alert('تمت الموافقة!');
      refetch();
    },
  });

  const handleApprove = (applicationId: string) => {
    approve({ notes: 'موافق' }, { params: { id: applicationId } });
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h6">طلبات الانضمام ({data?.total})</Typography>
      {data?.data?.map((app) => (
        <Box key={app._id}>
          <Typography>{app.fullName}</Typography>
          <Button onClick={() => handleApprove(app._id)}>موافقة</Button>
        </Box>
      ))}
    </Box>
  );
}

// ==================== مثال 3: Finance ====================

import { useFinanceStats, usePayCommission } from '@/api/finance';

export function FinanceExample() {
  const { data: stats } = useFinanceStats();
  const { mutate: payCommission, loading: paying } = usePayCommission({
    onSuccess: () => alert('تم الدفع!'),
  });

  return (
    <Box>
      <Typography variant="h6">الإحصائيات المالية</Typography>
      <Typography>إجمالي الإيرادات: {stats?.totalRevenue}</Typography>
      <Typography>العمولات المعلقة: {stats?.pendingCommissions}</Typography>
      <Button
        onClick={() => payCommission(undefined, { params: { id: 'commission-id' } })}
        disabled={paying}
      >
        دفع عمولة
      </Button>
    </Box>
  );
}

// ==================== مثال 4: Analytics ====================

import { useDashboardStats, useSystemMetrics } from '@/api/analytics';

export function AnalyticsExample() {
  const { data: dashboardStats } = useDashboardStats();
  const { data: systemMetrics } = useSystemMetrics({
    startDate: '2024-01-01',
    endDate: '2024-12-31',
  });

  return (
    <Box>
      <Typography variant="h6">إحصائيات النظام</Typography>
      <Typography>إجمالي السائقين: {dashboardStats?.data?.totalDrivers}</Typography>
      <Typography>إجمالي المتاجر: {dashboardStats?.data?.totalStores}</Typography>
      <Typography>إجمالي الطلبات: {systemMetrics?.data?.totalOrders}</Typography>
    </Box>
  );
}

// ==================== مثال 5: Combined Usage ====================

export function CombinedExample() {
  const [activeTab, setActiveTab] = useState<'marketers' | 'onboarding' | 'finance'>('marketers');

  // استخدام multiple APIs معاً
  const { data: marketers } = useMarketers({ page: '1' });
  const { data: applications } = useOnboardingApplications({ status: 'pending' });
  const { data: financeStats } = useFinanceStats();

  return (
    <Box>
      <Box display="flex" gap={2} mb={3}>
        <Button
          variant={activeTab === 'marketers' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('marketers')}
        >
          المسوقين ({marketers?.total || 0})
        </Button>
        <Button
          variant={activeTab === 'onboarding' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('onboarding')}
        >
          الطلبات ({applications?.total || 0})
        </Button>
        <Button
          variant={activeTab === 'finance' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('finance')}
        >
          المالية
        </Button>
      </Box>

      {activeTab === 'marketers' && <MarketersExample />}
      {activeTab === 'onboarding' && <OnboardingExample />}
      {activeTab === 'finance' && <FinanceExample />}
    </Box>
  );
}

// ==================== مثال 6: Error Handling ====================

export function ErrorHandlingExample() {
  const [error, setError] = useState<Error | null>(null);

  const { data, loading } = useMarketers(
    { page: '1' },
    {
      onError: (err) => {
        setError(err);
        console.error('Failed to fetch marketers:', err);
      },
    }
  );

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error.message}</Alert>;

  return (
    <Box>
      <Typography>تم جلب {data?.total} مسوق</Typography>
    </Box>
  );
}

// ==================== مثال 7: Refetch Pattern ====================

export function RefetchExample() {
  const { data, loading, refetch } = useMarketers({ page: '1' });
  const [lastRefetch, setLastRefetch] = useState<Date | null>(null);

  const handleRefresh = async () => {
    await refetch();
    setLastRefetch(new Date());
  };

  return (
    <Box>
      <Button onClick={handleRefresh} disabled={loading}>
        {loading ? <CircularProgress size={20} /> : 'تحديث'}
      </Button>
      {lastRefetch && (
        <Typography variant="caption" display="block">
          آخر تحديث: {lastRefetch.toLocaleTimeString('ar-SA')}
        </Typography>
      )}
      <Typography>المسوقين: {data?.total}</Typography>
    </Box>
  );
}

// ==================== مثال 8: Pagination ====================

export function PaginationExample() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, loading } = useMarketers({
    page: String(page),
    limit: String(limit),
  });

  return (
    <Box>
      {loading && <CircularProgress />}
      
      {data?.data?.map((marketer) => (
        <div key={marketer._id}>{marketer.name}</div>
      ))}

      <Box display="flex" gap={2} mt={2}>
        <Button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          السابق
        </Button>
        <Typography>صفحة {page} من {data?.pages}</Typography>
        <Button
          disabled={page === data?.pages}
          onClick={() => setPage(page + 1)}
        >
          التالي
        </Button>
      </Box>
    </Box>
  );
}

// ==================== مثال 9: Search & Filter ====================

export function SearchFilterExample() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const { data, loading } = useMarketers({
    search,
    status,
    page: '1',
  });

  return (
    <Box>
      <Box display="flex" gap={2} mb={2}>
        <input
          type="text"
          placeholder="بحث..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">الكل</option>
          <option value="active">نشط</option>
          <option value="inactive">غير نشط</option>
        </select>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <Typography>النتائج: {data?.total}</Typography>
      )}
    </Box>
  );
}

