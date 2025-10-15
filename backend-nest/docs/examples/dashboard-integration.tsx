/**
 * مثال عملي: كيفية استخدام Admin Endpoints في Dashboard
 * يمكنك نسخ هذا الكود مباشرة في مشروع React/Next.js
 */

import React, { useState, useMemo } from 'react';
import { 
  ADMIN_ENDPOINTS_BY_MODULE, 
  ALL_ADMIN_ENDPOINTS,
  ENDPOINT_CATEGORIES,
  getEndpointsByCategory,
  buildEndpointUrl,
  hasPermission,
  type AdminEndpoint,
  type AdminEndpointModule 
} from '../admin-endpoints';

// ==================== Hook للصلاحيات ====================

function useAuth() {
  // في التطبيق الحقيقي، احصل عليها من Context أو Redux
  return {
    user: {
      id: '123',
      name: 'أحمد محمد',
      roles: ['admin', 'superadmin'],
    },
    token: 'your-jwt-token-here',
  };
}

function usePermissions() {
  const { user } = useAuth();
  
  const allowedEndpoints = useMemo(() => {
    if (!user) return [];
    return ALL_ADMIN_ENDPOINTS.filter(ep => 
      hasPermission(user.roles, ep)
    );
  }, [user]);
  
  return { allowedEndpoints };
}

// ==================== Sidebar Component ====================

export function AdminSidebar() {
  const { allowedEndpoints } = usePermissions();
  const [activeModule, setActiveModule] = useState<string | null>(null);

  // Filter modules للعرض فقط التي لديها صلاحيات لها
  const visibleModules = useMemo(() => {
    return Object.values(ADMIN_ENDPOINTS_BY_MODULE).filter(module => 
      module.endpoints.some(ep => 
        allowedEndpoints.some(allowed => allowed.id === ep.id)
      )
    );
  }, [allowedEndpoints]);

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white overflow-y-auto">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">لوحة التحكم</h2>
      </div>
      
      <nav className="p-2">
        {visibleModules.map((module) => (
          <ModuleSection
            key={module.name}
            module={module}
            isActive={activeModule === module.name}
            onToggle={() => setActiveModule(
              activeModule === module.name ? null : module.name
            )}
            allowedEndpoints={allowedEndpoints}
          />
        ))}
      </nav>
    </aside>
  );
}

// ==================== Module Section ====================

interface ModuleSectionProps {
  module: AdminEndpointModule;
  isActive: boolean;
  onToggle: () => void;
  allowedEndpoints: AdminEndpoint[];
}

function ModuleSection({ 
  module, 
  isActive, 
  onToggle, 
  allowedEndpoints 
}: ModuleSectionProps) {
  const visibleEndpoints = module.endpoints.filter(ep =>
    allowedEndpoints.some(allowed => allowed.id === ep.id)
  );

  if (visibleEndpoints.length === 0) return null;

  return (
    <div className="mb-2">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-800 rounded transition"
      >
        <div className="flex items-center gap-3">
          <span 
            className="material-icons text-xl" 
            style={{ color: module.color }}
          >
            {module.icon}
          </span>
          <span className="font-semibold">{module.displayName}</span>
        </div>
        <span className="text-xs bg-gray-700 px-2 py-1 rounded">
          {visibleEndpoints.length}
        </span>
      </button>
      
      {isActive && (
        <div className="ml-4 mt-1">
          {visibleEndpoints.map((endpoint) => (
            <EndpointLink key={endpoint.id} endpoint={endpoint} />
          ))}
        </div>
      )}
    </div>
  );
}

// ==================== Endpoint Link ====================

interface EndpointLinkProps {
  endpoint: AdminEndpoint;
}

function EndpointLink({ endpoint }: EndpointLinkProps) {
  const isActive = window.location.pathname === endpoint.fullPath;
  
  return (
    <a
      href={endpoint.fullPath}
      className={`
        block p-2 rounded text-sm transition
        ${isActive 
          ? 'bg-blue-600 text-white' 
          : 'text-gray-300 hover:bg-gray-800'
        }
      `}
    >
      <div className="flex items-center gap-2">
        <span className="material-icons text-sm">{endpoint.icon}</span>
        <span>{endpoint.summary}</span>
      </div>
      <div className="flex gap-1 mt-1">
        <span className={`
          text-xs px-1.5 py-0.5 rounded
          ${endpoint.method === 'GET' ? 'bg-green-900 text-green-200' :
            endpoint.method === 'POST' ? 'bg-blue-900 text-blue-200' :
            endpoint.method === 'PATCH' ? 'bg-yellow-900 text-yellow-200' :
            'bg-red-900 text-red-200'}
        `}>
          {endpoint.method}
        </span>
      </div>
    </a>
  );
}

// ==================== Dashboard Grid ====================

export function AdminDashboardGrid() {
  const { allowedEndpoints } = usePermissions();

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {ENDPOINT_CATEGORIES.map((category) => {
        const endpoints = getEndpointsByCategory(category.id).filter(ep =>
          allowedEndpoints.some(allowed => allowed.id === ep.id)
        );
        
        if (endpoints.length === 0) return null;

        return (
          <CategoryCard 
            key={category.id} 
            category={category} 
            endpoints={endpoints} 
          />
        );
      })}
    </div>
  );
}

// ==================== Category Card ====================

interface CategoryCardProps {
  category: { id: string; label: string; icon: string };
  endpoints: AdminEndpoint[];
}

function CategoryCard({ category, endpoints }: CategoryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
        <div className="flex items-center gap-3">
          <span className="material-icons text-3xl">{category.icon}</span>
          <div>
            <h3 className="font-bold text-lg">{category.label}</h3>
            <p className="text-sm opacity-90">{endpoints.length} وظيفة</p>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <ul className="space-y-2">
          {endpoints.slice(0, 5).map((endpoint) => (
            <li key={endpoint.id}>
              <a 
                href={endpoint.fullPath}
                className="flex items-center gap-2 text-sm hover:text-blue-600 transition"
              >
                <span className="material-icons text-base text-gray-400">
                  {endpoint.icon}
                </span>
                <span>{endpoint.summary}</span>
              </a>
            </li>
          ))}
          {endpoints.length > 5 && (
            <li className="text-sm text-gray-500">
              +{endpoints.length - 5} المزيد...
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

// ==================== API Client Hook ====================

export function useAdminAPI() {
  const { token } = useAuth();

  async function callEndpoint<T = any>(
    endpoint: AdminEndpoint,
    options?: {
      params?: Record<string, string>;
      body?: any;
      query?: Record<string, string>;
    }
  ): Promise<T> {
    let url = buildEndpointUrl(endpoint, options?.params);
    
    // Add query parameters
    if (options?.query) {
      const queryString = new URLSearchParams(options.query).toString();
      url += `?${queryString}`;
    }

    const response = await fetch(url, {
      method: endpoint.method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  return { callEndpoint };
}

// ==================== مثال استخدام الـ API ====================

export function DriversPage() {
  const { callEndpoint } = useAdminAPI();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get endpoint من الـ config
  const endpoint = ALL_ADMIN_ENDPOINTS.find(
    ep => ep.id === 'admin-drivers-all'
  );

  async function loadDrivers() {
    if (!endpoint) return;
    
    setLoading(true);
    try {
      const result = await callEndpoint(endpoint, {
        query: {
          page: '1',
          limit: '20',
          status: 'active',
        }
      });
      setDrivers(result.data);
    } catch (error) {
      console.error('Failed to load drivers:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">السائقين</h1>
        <button 
          onClick={loadDrivers}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'جاري التحميل...' : 'تحديث'}
        </button>
      </div>
      
      {endpoint && (
        <div className="mb-4 p-3 bg-gray-100 rounded text-sm">
          <code>
            {endpoint.method} {endpoint.fullPath}
          </code>
        </div>
      )}

      <div className="grid gap-4">
        {drivers.map((driver: any) => (
          <DriverCard key={driver.id} driver={driver} />
        ))}
      </div>
    </div>
  );
}

// ==================== مثال Permissions Guard ====================

interface ProtectedRouteProps {
  endpointId: string;
  children: React.ReactNode;
}

export function ProtectedRoute({ endpointId, children }: ProtectedRouteProps) {
  const { allowedEndpoints } = usePermissions();
  const canAccess = allowedEndpoints.some(ep => ep.id === endpointId);

  if (!canAccess) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <span className="material-icons text-6xl text-gray-400 mb-4">
            lock
          </span>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            غير مصرح
          </h2>
          <p className="text-gray-600">
            ليس لديك صلاحية للوصول إلى هذه الصفحة
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// ==================== مثال Route Configuration ====================

export const adminRoutes = [
  {
    path: '/admin/dashboard',
    component: AdminDashboardGrid,
    endpointId: 'admin-dashboard',
  },
  {
    path: '/admin/drivers',
    component: DriversPage,
    endpointId: 'admin-drivers-all',
  },
  // ... باقي الـ routes
];

// استخدام في Router
export function AdminRouter() {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1">
        {adminRoutes.map((route) => (
          <ProtectedRoute key={route.path} endpointId={route.endpointId}>
            {/* Route rendering logic */}
          </ProtectedRoute>
        ))}
      </main>
    </div>
  );
}

// Helper component placeholder
function DriverCard({ driver }: { driver: any }) {
  return (
    <div className="border p-4 rounded">
      <p>{driver.name}</p>
    </div>
  );
}

