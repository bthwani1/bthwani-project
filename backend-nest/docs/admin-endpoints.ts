/**
 * Admin Endpoints Configuration
 * Auto-generated from backend controllers
 * Generated At: 2025-10-15
 */

export interface AdminEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  path: string;
  fullPath: string;
  summary: string;
  module: string;
  handler: string;
  roles: string[];
  category?: string;
  icon?: string;
  requiredPermissions?: string[];
}

export interface AdminEndpointModule {
  name: string;
  displayName: string;
  icon: string;
  endpoints: AdminEndpoint[];
  color?: string;
}

/**
 * جميع Admin Endpoints مجمعة حسب الـ Module
 */
export const ADMIN_ENDPOINTS_BY_MODULE: Record<string, AdminEndpointModule> = {
  admin: {
    name: 'admin',
    displayName: 'الإدارة العامة',
    icon: 'dashboard',
    color: '#1976d2',
    endpoints: [
      {
        id: 'admin-dashboard',
        method: 'GET',
        path: 'dashboard',
        fullPath: '/admin/dashboard',
        summary: 'لوحة التحكم - الإحصائيات العامة',
        module: 'admin',
        handler: 'getDashboard',
        roles: ['admin', 'superadmin'],
        category: 'Dashboard',
        icon: 'dashboard',
      },
      {
        id: 'admin-today-stats',
        method: 'GET',
        path: 'stats/today',
        fullPath: '/admin/stats/today',
        summary: 'إحصائيات اليوم',
        module: 'admin',
        handler: 'getTodayStats',
        roles: ['admin', 'superadmin'],
        category: 'Statistics',
        icon: 'today',
      },
      // ... المزيد من الـ endpoints
    ],
  },
  
  drivers: {
    name: 'drivers',
    displayName: 'إدارة السائقين',
    icon: 'local_shipping',
    color: '#2e7d32',
    endpoints: [
      {
        id: 'admin-drivers-all',
        method: 'GET',
        path: 'drivers',
        fullPath: '/admin/drivers',
        summary: 'جلب كل السائقين',
        module: 'admin',
        handler: 'getAllDrivers',
        roles: ['admin', 'superadmin'],
        category: 'Drivers',
        icon: 'groups',
      },
      {
        id: 'admin-driver-details',
        method: 'GET',
        path: 'drivers/:id',
        fullPath: '/admin/drivers/:id',
        summary: 'تفاصيل سائق محدد',
        module: 'admin',
        handler: 'getDriverDetails',
        roles: ['admin', 'superadmin'],
        category: 'Drivers',
        icon: 'person',
      },
    ],
  },

  withdrawals: {
    name: 'withdrawals',
    displayName: 'طلبات السحب',
    icon: 'account_balance_wallet',
    color: '#f57c00',
    endpoints: [
      {
        id: 'admin-withdrawals-all',
        method: 'GET',
        path: 'withdrawals',
        fullPath: '/admin/withdrawals',
        summary: 'جلب طلبات السحب',
        module: 'admin',
        handler: 'getWithdrawals',
        roles: ['admin', 'superadmin'],
        category: 'Financial',
        icon: 'list',
      },
      {
        id: 'admin-withdrawals-pending',
        method: 'GET',
        path: 'withdrawals/pending',
        fullPath: '/admin/withdrawals/pending',
        summary: 'طلبات السحب المعلقة',
        module: 'admin',
        handler: 'getPendingWithdrawals',
        roles: ['admin', 'superadmin'],
        category: 'Financial',
        icon: 'pending',
      },
      {
        id: 'admin-withdrawals-approve',
        method: 'PATCH',
        path: 'withdrawals/:id/approve',
        fullPath: '/admin/withdrawals/:id/approve',
        summary: 'الموافقة على طلب سحب',
        module: 'admin',
        handler: 'approveWithdrawal',
        roles: ['admin', 'superadmin'],
        category: 'Financial',
        icon: 'check_circle',
      },
    ],
  },

  stores: {
    name: 'stores',
    displayName: 'إدارة المتاجر',
    icon: 'store',
    color: '#d32f2f',
    endpoints: [
      {
        id: 'admin-stores-pending',
        method: 'GET',
        path: 'stores/pending',
        fullPath: '/admin/stores/pending',
        summary: 'المتاجر المعلقة',
        module: 'admin',
        handler: 'getPendingStores',
        roles: ['admin', 'superadmin'],
        category: 'Moderation',
        icon: 'pending_actions',
      },
      {
        id: 'admin-stores-approve',
        method: 'POST',
        path: 'stores/:id/approve',
        fullPath: '/admin/stores/:id/approve',
        summary: 'الموافقة على متجر',
        module: 'admin',
        handler: 'approveStore',
        roles: ['admin', 'superadmin'],
        category: 'Moderation',
        icon: 'check',
      },
    ],
  },

  marketers: {
    name: 'marketers',
    displayName: 'إدارة المسوقين',
    icon: 'campaign',
    color: '#7b1fa2',
    endpoints: [
      {
        id: 'admin-marketers-all',
        method: 'GET',
        path: 'marketers',
        fullPath: '/admin/marketers',
        summary: 'جلب المسوقين الميدانيين',
        module: 'admin',
        handler: 'getAllMarketers',
        roles: ['admin', 'superadmin'],
        category: 'Marketers',
        icon: 'groups',
      },
      {
        id: 'admin-marketer-details',
        method: 'GET',
        path: 'marketers/:id',
        fullPath: '/admin/marketers/:id',
        summary: 'تفاصيل مسوق',
        module: 'admin',
        handler: 'getMarketerDetails',
        roles: ['admin', 'superadmin'],
        category: 'Marketers',
        icon: 'person',
      },
    ],
  },

  analytics: {
    name: 'analytics',
    displayName: 'التحليلات والتقارير',
    icon: 'analytics',
    color: '#0288d1',
    endpoints: [
      {
        id: 'analytics-roas-daily',
        method: 'GET',
        path: 'roas/daily',
        fullPath: '/analytics/roas/daily',
        summary: 'ROAS اليومي',
        module: 'analytics',
        handler: 'getRoasDaily',
        roles: ['admin', 'superadmin'],
        category: 'Analytics',
        icon: 'trending_up',
      },
      {
        id: 'analytics-kpis',
        method: 'GET',
        path: 'kpis',
        fullPath: '/analytics/kpis',
        summary: 'مؤشرات الأداء الرئيسية',
        module: 'analytics',
        handler: 'getKPIs',
        roles: ['admin', 'superadmin'],
        category: 'Analytics',
        icon: 'assessment',
      },
    ],
  },

  finance: {
    name: 'finance',
    displayName: 'الإدارة المالية',
    icon: 'account_balance',
    color: '#388e3c',
    endpoints: [
      {
        id: 'finance-settlements',
        method: 'GET',
        path: 'settlements',
        fullPath: '/finance/settlements',
        summary: 'التسويات المالية',
        module: 'finance',
        handler: 'getSettlements',
        roles: ['admin', 'superadmin'],
        category: 'Finance',
        icon: 'receipt_long',
      },
    ],
  },

  akhdimni: {
    name: 'akhdimni',
    displayName: 'خدمة أخدمني',
    icon: 'delivery_dining',
    color: '#ff6f00',
    endpoints: [
      {
        id: 'akhdimni-admin-errands',
        method: 'GET',
        path: 'admin/errands',
        fullPath: '/akhdimni/admin/errands',
        summary: 'كل طلبات أخدمني (إدارة)',
        module: 'akhdimni',
        handler: 'getAllErrands',
        roles: ['admin', 'superadmin'],
        category: 'Errands',
        icon: 'list_alt',
      },
      {
        id: 'akhdimni-assign-driver',
        method: 'POST',
        path: 'admin/errands/:id/assign-driver',
        fullPath: '/akhdimni/admin/errands/:id/assign-driver',
        summary: 'تعيين سائق لمهمة',
        module: 'akhdimni',
        handler: 'assignDriver',
        roles: ['admin', 'superadmin'],
        category: 'Errands',
        icon: 'person_add',
      },
    ],
  },
};

/**
 * جميع الـ Endpoints في مصفوفة واحدة
 */
export const ALL_ADMIN_ENDPOINTS: AdminEndpoint[] = Object.values(
  ADMIN_ENDPOINTS_BY_MODULE
).flatMap((module) => module.endpoints);

/**
 * الحصول على endpoints حسب الـ category
 */
export function getEndpointsByCategory(category: string): AdminEndpoint[] {
  return ALL_ADMIN_ENDPOINTS.filter((ep) => ep.category === category);
}

/**
 * الحصول على endpoints حسب الـ module
 */
export function getEndpointsByModule(moduleName: string): AdminEndpoint[] {
  return ADMIN_ENDPOINTS_BY_MODULE[moduleName]?.endpoints || [];
}

/**
 * الحصول على endpoint بواسطة ID
 */
export function getEndpointById(id: string): AdminEndpoint | undefined {
  return ALL_ADMIN_ENDPOINTS.find((ep) => ep.id === id);
}

/**
 * Categories للتنظيم في الـ UI
 */
export const ENDPOINT_CATEGORIES = [
  { id: 'Dashboard', label: 'لوحة التحكم', icon: 'dashboard' },
  { id: 'Statistics', label: 'الإحصائيات', icon: 'bar_chart' },
  { id: 'Drivers', label: 'السائقين', icon: 'local_shipping' },
  { id: 'Financial', label: 'المالية', icon: 'account_balance' },
  { id: 'Moderation', label: 'المراجعة والموافقات', icon: 'verified' },
  { id: 'Marketers', label: 'المسوقين', icon: 'campaign' },
  { id: 'Analytics', label: 'التحليلات', icon: 'analytics' },
  { id: 'Finance', label: 'الإدارة المالية', icon: 'account_balance' },
  { id: 'Errands', label: 'أخدمني', icon: 'delivery_dining' },
];

/**
 * الحصول على كل الـ modules
 */
export const ALL_MODULES = Object.values(ADMIN_ENDPOINTS_BY_MODULE);

/**
 * إحصائيات عامة
 */
export const ENDPOINTS_STATS = {
  total: ALL_ADMIN_ENDPOINTS.length,
  byMethod: {
    GET: ALL_ADMIN_ENDPOINTS.filter((ep) => ep.method === 'GET').length,
    POST: ALL_ADMIN_ENDPOINTS.filter((ep) => ep.method === 'POST').length,
    PATCH: ALL_ADMIN_ENDPOINTS.filter((ep) => ep.method === 'PATCH').length,
    PUT: ALL_ADMIN_ENDPOINTS.filter((ep) => ep.method === 'PUT').length,
    DELETE: ALL_ADMIN_ENDPOINTS.filter((ep) => ep.method === 'DELETE').length,
  },
  modules: Object.keys(ADMIN_ENDPOINTS_BY_MODULE).length,
};

/**
 * Helper لبناء الـ URL الكامل
 */
export function buildEndpointUrl(
  endpoint: AdminEndpoint,
  params?: Record<string, string>,
  baseUrl: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
): string {
  let url = `${baseUrl}${endpoint.fullPath}`;
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, value);
    });
  }
  
  return url;
}

/**
 * Type guard للتحقق من صلاحيات المستخدم
 */
export function hasPermission(
  userRoles: string[],
  endpoint: AdminEndpoint
): boolean {
  return endpoint.roles.some((role) => userRoles.includes(role));
}

/**
 * Filter endpoints حسب صلاحيات المستخدم
 */
export function filterEndpointsByPermissions(
  userRoles: string[]
): AdminEndpoint[] {
  return ALL_ADMIN_ENDPOINTS.filter((ep) => hasPermission(userRoles, ep));
}

