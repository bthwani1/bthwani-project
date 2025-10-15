/**
 * أمثلة عملية لاستخدام useAdminAPI Hook
 */

import { useAdminAPI, useAdminQuery, useAdminMutation } from '../useAdminAPI';
import { ALL_ADMIN_ENDPOINTS } from '@/config/admin-endpoints';
import { Button, CircularProgress, Alert } from '@mui/material';

// ==================== مثال 1: استخدام أساسي ====================

export function Example1_BasicUsage() {
  const { callEndpoint, loading, error, data } = useAdminAPI();

  async function handleFetchDrivers() {
    // الحصول على endpoint
    const endpoint = ALL_ADMIN_ENDPOINTS.find(
      (ep) => ep.id === 'admin-drivers-all'
    );

    if (!endpoint) {
      console.error('Endpoint not found');
      return;
    }

    try {
      const result = await callEndpoint(endpoint, {
        query: {
          page: '1',
          limit: '20',
          status: 'active',
        },
      });

      console.log('Drivers:', result);
    } catch (error) {
      console.error('Failed to fetch drivers:', error);
    }
  }

  return (
    <div>
      <Button onClick={handleFetchDrivers} disabled={loading}>
        {loading ? <CircularProgress size={20} /> : 'جلب السائقين'}
      </Button>

      {error && <Alert severity="error">{error.message}</Alert>}

      {data && (
        <div>
          <p>تم جلب {data.total} سائق</p>
        </div>
      )}
    </div>
  );
}

// ==================== مثال 2: GET Request مع Auto-fetch ====================

export function Example2_QueryHook() {
  const driversEndpoint = ALL_ADMIN_ENDPOINTS.find(
    (ep) => ep.id === 'admin-drivers-all'
  );

  const { data, loading, error, refetch } = useAdminQuery(
    driversEndpoint!,
    {
      query: {
        page: '1',
        limit: '20',
      },
    },
    {
      enabled: true, // يبدأ التحميل تلقائياً
      onSuccess: (data) => {
        console.log('✅ Drivers loaded:', data);
      },
    }
  );

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error.message}</Alert>;

  return (
    <div>
      <Button onClick={refetch}>تحديث</Button>
      <p>عدد السائقين: {data?.total}</p>
    </div>
  );
}

// ==================== مثال 3: POST Request (Create) ====================

export function Example3_CreateMutation() {
  const createMarketerEndpoint = ALL_ADMIN_ENDPOINTS.find(
    (ep) => ep.handler === 'createMarketer'
  );

  const { mutate, loading, error } = useAdminMutation(
    createMarketerEndpoint!,
    {
      onSuccess: (data) => {
        console.log('✅ Marketer created:', data);
        alert('تم إضافة المسوق بنجاح');
      },
      onError: (error) => {
        console.error('❌ Failed:', error);
      },
    }
  );

  async function handleCreate() {
    await mutate({
      name: 'محمد أحمد',
      phone: '0512345678',
      email: 'mohamed@example.com',
    });
  }

  return (
    <div>
      <Button onClick={handleCreate} disabled={loading}>
        {loading ? 'جاري الإنشاء...' : 'إضافة مسوق'}
      </Button>

      {error && <Alert severity="error">{error.message}</Alert>}
    </div>
  );
}

// ==================== مثال 4: PATCH Request (Update) ====================

export function Example4_UpdateMutation() {
  const updateDriverEndpoint = ALL_ADMIN_ENDPOINTS.find(
    (ep) => ep.handler === 'updateDriver'
  );

  const { mutate, loading } = useAdminMutation(updateDriverEndpoint!, {
    onSuccess: () => alert('تم التحديث'),
  });

  async function handleUpdate(driverId: string) {
    await mutate(
      {
        isAvailable: true,
        status: 'active',
      },
      {
        params: { id: driverId },
      }
    );
  }

  return (
    <Button onClick={() => handleUpdate('123')} disabled={loading}>
      تحديث السائق
    </Button>
  );
}

// ==================== مثال 5: استخدام مع Parameters ====================

export function Example5_WithParams() {
  const { callEndpoint, loading } = useAdminAPI();

  async function fetchDriverDetails(driverId: string) {
    const endpoint = ALL_ADMIN_ENDPOINTS.find(
      (ep) => ep.id === 'admin-driver-details'
    );

    if (!endpoint) return;

    const data = await callEndpoint(endpoint, {
      params: { id: driverId }, // سيتم استبدال :id في الـ URL
    });

    console.log('Driver Details:', data);
  }

  return (
    <Button onClick={() => fetchDriverDetails('12345')} disabled={loading}>
      جلب تفاصيل السائق
    </Button>
  );
}

// ==================== مثال 6: استخدام متقدم مع Error Handling ====================

export function Example6_AdvancedErrorHandling() {
  const { callEndpoint, loading, error } = useAdminAPI({
    onSuccess: (data) => {
      console.log('✅ Success:', data);
    },
    onError: (error) => {
      // معالجة مخصصة للأخطاء
      if (error.response?.status === 401) {
        alert('انتهت الجلسة - يرجى تسجيل الدخول مرة أخرى');
      } else if (error.response?.status === 403) {
        alert('ليس لديك صلاحية للوصول');
      } else {
        alert('حدث خطأ: ' + error.message);
      }
    },
  });

  async function fetchProtectedData() {
    const endpoint = ALL_ADMIN_ENDPOINTS.find(
      (ep) => ep.id === 'admin-dashboard'
    );

    if (!endpoint) return;

    try {
      await callEndpoint(endpoint);
    } catch (error) {
      // الخطأ تم معالجته في onError callback
      console.error('Request failed:', error);
    }
  }

  return (
    <div>
      <Button onClick={fetchProtectedData} disabled={loading}>
        جلب البيانات المحمية
      </Button>

      {error && (
        <Alert severity="error">
          <strong>خطأ:</strong> {error.message}
        </Alert>
      )}
    </div>
  );
}

// ==================== مثال 7: استخدام في صفحة كاملة ====================

export function Example7_FullPageExample() {
  const driversEndpoint = ALL_ADMIN_ENDPOINTS.find(
    (ep) => ep.id === 'admin-drivers-all'
  );

  const banDriverEndpoint = ALL_ADMIN_ENDPOINTS.find(
    (ep) => ep.handler === 'banDriver'
  );

  // Query للجلب
  const {
    data: drivers,
    loading: loadingDrivers,
    refetch,
  } = useAdminQuery(driversEndpoint!, {
    query: { page: '1', limit: '20' },
  });

  // Mutation للحظر
  const { mutate: banDriver, loading: banning } = useAdminMutation(
    banDriverEndpoint!,
    {
      onSuccess: () => {
        alert('تم حظر السائق');
        refetch(); // إعادة جلب القائمة
      },
    }
  );

  async function handleBan(driverId: string) {
    await banDriver(
      { reason: 'مخالفة السياسات' },
      { params: { id: driverId } }
    );
  }

  if (loadingDrivers) return <CircularProgress />;

  return (
    <div>
      <h2>قائمة السائقين ({drivers?.total})</h2>

      {drivers?.data?.map((driver: any) => (
        <div key={driver._id}>
          <span>{driver.fullName}</span>
          <Button
            onClick={() => handleBan(driver._id)}
            disabled={banning}
            color="error"
          >
            حظر
          </Button>
        </div>
      ))}

      <Button onClick={refetch}>تحديث القائمة</Button>
    </div>
  );
}

// ==================== مثال 8: استخدام مع React Query (اختياري) ====================

/**
 * يمكن دمج useAdminAPI مع React Query للحصول على:
 * - Caching تلقائي
 * - Background refetching
 * - Optimistic updates
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function Example8_WithReactQuery() {
  const { callEndpoint } = useAdminAPI();
  const queryClient = useQueryClient();

  const driversEndpoint = ALL_ADMIN_ENDPOINTS.find(
    (ep) => ep.id === 'admin-drivers-all'
  );

  // استخدام مع React Query
  const { data, isLoading } = useQuery({
    queryKey: ['drivers', { page: 1 }],
    queryFn: () =>
      callEndpoint(driversEndpoint!, {
        query: { page: '1', limit: '20' },
      }),
  });

  const banMutation = useMutation({
    mutationFn: (driverId: string) =>
      callEndpoint(
        ALL_ADMIN_ENDPOINTS.find((ep) => ep.handler === 'banDriver')!,
        {
          params: { id: driverId },
          body: { reason: 'مخالفة' },
        }
      ),
    onSuccess: () => {
      // تحديث الـ cache
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
    },
  });

  if (isLoading) return <CircularProgress />;

  return (
    <div>
      <h2>السائقين (مع React Query)</h2>
      {data?.data?.map((driver: any) => (
        <div key={driver._id}>
          <span>{driver.fullName}</span>
          <Button onClick={() => banMutation.mutate(driver._id)}>حظر</Button>
        </div>
      ))}
    </div>
  );
}

// ==================== مثال 9: Helper Function ====================

/**
 * إنشاء helper functions مخصصة لكل module
 */

export function useDriversAPI() {
  const { callEndpoint } = useAdminAPI();

  const getAllDrivers = async (query?: Record<string, string>) => {
    const endpoint = ALL_ADMIN_ENDPOINTS.find(
      (ep) => ep.id === 'admin-drivers-all'
    );
    return callEndpoint(endpoint!, { query });
  };

  const getDriverDetails = async (driverId: string) => {
    const endpoint = ALL_ADMIN_ENDPOINTS.find(
      (ep) => ep.id === 'admin-driver-details'
    );
    return callEndpoint(endpoint!, { params: { id: driverId } });
  };

  const banDriver = async (driverId: string, reason: string) => {
    const endpoint = ALL_ADMIN_ENDPOINTS.find(
      (ep) => ep.handler === 'banDriver'
    );
    return callEndpoint(endpoint!, {
      params: { id: driverId },
      body: { reason },
    });
  };

  return {
    getAllDrivers,
    getDriverDetails,
    banDriver,
  };
}

// الاستخدام:
export function Example9_CustomHook() {
  const driversAPI = useDriversAPI();

  async function loadDrivers() {
    const drivers = await driversAPI.getAllDrivers({ page: '1' });
    console.log('Drivers:', drivers);
  }

  return <Button onClick={loadDrivers}>جلب السائقين</Button>;
}

