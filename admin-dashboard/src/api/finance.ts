/**
 * Finance API
 * جميع الوظائف الخاصة بالنظام المالي
 */

import { useAdminAPI, useAdminQuery, useAdminMutation } from '@/hooks/useAdminAPI';
import { ALL_ADMIN_ENDPOINTS } from '@/config/admin-endpoints';

// ==================== Types ====================

export interface FinancialReport {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  pendingPayments: number;
  completedPayments: number;
  period: string;
}

export interface Commission {
  _id: string;
  type: 'driver' | 'marketer' | 'store';
  userId: string;
  userName: string;
  amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  orderId?: string;
  applicationId?: string;
  createdAt: string;
  paidAt?: string;
}

export interface CommissionPlan {
  _id: string;
  name: string;
  type: 'driver' | 'marketer' | 'store';
  rate: number;
  minAmount?: number;
  maxAmount?: number;
  isActive: boolean;
  createdAt: string;
}

export interface CreateCommissionPlanData {
  name: string;
  type: 'driver' | 'marketer' | 'store';
  rate: number;
  minAmount?: number;
  maxAmount?: number;
}

// ==================== Endpoints ====================

const endpoints = {
  getReport: ALL_ADMIN_ENDPOINTS.find(ep => ep.handler === 'getFinancialReport'),
  getCommissions: ALL_ADMIN_ENDPOINTS.find(ep => ep.handler === 'getAllCommissions'),
  payCommission: ALL_ADMIN_ENDPOINTS.find(ep => ep.handler === 'payCommission'),
  getPlans: ALL_ADMIN_ENDPOINTS.find(ep => ep.handler === 'getCommissionPlans'),
  createPlan: ALL_ADMIN_ENDPOINTS.find(ep => ep.handler === 'createCommissionPlan'),
  updatePlan: ALL_ADMIN_ENDPOINTS.find(ep => ep.handler === 'updateCommissionPlan'),
  deletePlan: ALL_ADMIN_ENDPOINTS.find(ep => ep.handler === 'deleteCommissionPlan'),
  getStats: ALL_ADMIN_ENDPOINTS.find(ep => ep.handler === 'getFinanceStats'),
};

// ==================== Query Hooks ====================

/**
 * جلب التقرير المالي
 */
export function useFinancialReport(query?: {
  startDate?: string;
  endDate?: string;
  period?: string;
}) {
  return useAdminQuery<{ data: FinancialReport }>(
    endpoints.getReport!,
    { query },
    { enabled: true }
  );
}

/**
 * جلب جميع العمولات
 */
export function useCommissions(query?: {
  page?: string;
  limit?: string;
  status?: string;
  type?: string;
}) {
  return useAdminQuery<{ data: Commission[]; total: number }>(
    endpoints.getCommissions!,
    { query },
    { enabled: true }
  );
}

/**
 * جلب خطط العمولات
 */
export function useCommissionPlans(query?: {
  type?: string;
  isActive?: string;
}) {
  return useAdminQuery<{ data: CommissionPlan[]; total: number }>(
    endpoints.getPlans!,
    { query },
    { enabled: true }
  );
}

/**
 * جلب إحصائيات مالية
 */
export function useFinanceStats() {
  return useAdminQuery<{
    totalRevenue: number;
    totalCommissions: number;
    pendingCommissions: number;
    paidCommissions: number;
  }>(endpoints.getStats!, {}, { enabled: true });
}

// ==================== Mutation Hooks ====================

/**
 * دفع عمولة
 */
export function usePayCommission(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) {
  return useAdminMutation(endpoints.payCommission!, options);
}

/**
 * إنشاء خطة عمولة جديدة
 */
export function useCreateCommissionPlan(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) {
  return useAdminMutation<CommissionPlan, CreateCommissionPlanData>(
    endpoints.createPlan!,
    options
  );
}

/**
 * تحديث خطة عمولة
 */
export function useUpdateCommissionPlan(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) {
  return useAdminMutation(endpoints.updatePlan!, options);
}

/**
 * حذف خطة عمولة
 */
export function useDeleteCommissionPlan(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) {
  return useAdminMutation(endpoints.deletePlan!, options);
}

// ==================== Direct API Calls ====================

/**
 * استخدام مباشر للـ API بدون hooks
 */
export function useFinanceAPI() {
  const { callEndpoint } = useAdminAPI();

  return {
    /**
     * جلب التقرير المالي
     */
    getReport: async (query?: Record<string, string>) => {
      return callEndpoint<{ data: FinancialReport }>(
        endpoints.getReport!,
        { query }
      );
    },

    /**
     * جلب جميع العمولات
     */
    getCommissions: async (query?: Record<string, string>) => {
      return callEndpoint<{ data: Commission[]; total: number }>(
        endpoints.getCommissions!,
        { query }
      );
    },

    /**
     * دفع عمولة
     */
    payCommission: async (commissionId: string) => {
      return callEndpoint(
        endpoints.payCommission!,
        { params: { id: commissionId } }
      );
    },

    /**
     * جلب خطط العمولات
     */
    getPlans: async (query?: Record<string, string>) => {
      return callEndpoint<{ data: CommissionPlan[] }>(
        endpoints.getPlans!,
        { query }
      );
    },

    /**
     * إنشاء خطة عمولة
     */
    createPlan: async (data: CreateCommissionPlanData) => {
      return callEndpoint<{ data: CommissionPlan }>(
        endpoints.createPlan!,
        { body: data }
      );
    },

    /**
     * تحديث خطة عمولة
     */
    updatePlan: async (planId: string, data: Partial<CreateCommissionPlanData>) => {
      return callEndpoint<{ data: CommissionPlan }>(
        endpoints.updatePlan!,
        { params: { id: planId }, body: data }
      );
    },

    /**
     * حذف خطة عمولة
     */
    deletePlan: async (planId: string) => {
      return callEndpoint(
        endpoints.deletePlan!,
        { params: { id: planId } }
      );
    },

    /**
     * جلب الإحصائيات المالية
     */
    getStats: async () => {
      return callEndpoint<{
        totalRevenue: number;
        totalCommissions: number;
        pendingCommissions: number;
      }>(endpoints.getStats!);
    },
  };
}
