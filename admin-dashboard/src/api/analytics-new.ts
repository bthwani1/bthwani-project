/**
 * Analytics API - النسخة الجديدة الكاملة
 * جميع الوظائف الخاصة بالتحليلات والإحصائيات
 */

import { useAdminAPI, useAdminQuery } from '@/hooks/useAdminAPI';
import { ALL_ADMIN_ENDPOINTS } from '@/config/admin-endpoints';
import type * as Types from '@/types/analytics';

// ==================== Helper Function ====================

const getEndpoint = (id: string) => {
  const endpoint = ALL_ADMIN_ENDPOINTS.find(ep => ep.id === id);
  if (!endpoint) {
    throw new Error(`Endpoint with id "${id}" not found`);
  }
  return endpoint;
};

// ==================== ROAS Hooks ====================

export function useDailyRoas(query?: Types.PlatformQuery) {
  return useAdminQuery<Types.AnalyticsResponse<Types.DailyRoas[]>>(
    getEndpoint('analytics-roas-daily'),
    { query },
    { enabled: true }
  );
}

export function useRoasSummary(query?: Types.DateRangeQuery) {
  return useAdminQuery<Types.AnalyticsResponse<Types.RoasSummary>>(
    getEndpoint('analytics-roas-summary'),
    { query },
    { enabled: true }
  );
}

export function useRoasByPlatform(query?: Types.DateRangeQuery) {
  return useAdminQuery<Types.AnalyticsResponse<Types.RoasByPlatform[]>>(
    getEndpoint('analytics-roas-by-platform'),
    { query },
    { enabled: true }
  );
}

// ==================== Ad Spend Hooks ====================

export function useAdSpend(query?: Types.PlatformQuery) {
  return useAdminQuery<Types.AnalyticsResponse<Types.AdSpend[]>>(
    getEndpoint('analytics-adspend-get'),
    { query },
    { enabled: true }
  );
}

export function useAdSpendSummary(query?: Types.DateRangeQuery) {
  return useAdminQuery<Types.AnalyticsResponse<Types.AdSpendSummary>>(
    getEndpoint('analytics-adspend-summary'),
    { query },
    { enabled: true }
  );
}

// ==================== KPIs Hooks ====================

export function useKPIs(query?: Types.DateRangeQuery) {
  return useAdminQuery<Types.AnalyticsResponse<Types.KPIData>>(
    getEndpoint('analytics-kpis'),
    { query },
    { enabled: true }
  );
}

export function useRealTimeKPIs() {
  return useAdminQuery<Types.AnalyticsResponse<Types.RealTimeKPI>>(
    getEndpoint('analytics-kpis-realtime'),
    {},
    { enabled: true, refetchInterval: 30000 } // Refetch every 30 seconds
  );
}

export function useKPITrends(query: Types.MetricQuery) {
  return useAdminQuery<Types.AnalyticsResponse<Types.KPITrend[]>>(
    getEndpoint('analytics-kpis-trends'),
    { query },
    { enabled: !!query.metric }
  );
}

// ==================== Marketing Events Hooks ====================

export function useEvents(query?: Types.EventTypeQuery) {
  return useAdminQuery<Types.AnalyticsResponse<Types.MarketingEvent[]>>(
    getEndpoint('analytics-events-get'),
    { query },
    { enabled: true }
  );
}

export function useEventsSummary(query?: Types.DateRangeQuery) {
  return useAdminQuery<Types.AnalyticsResponse<Types.EventsSummary>>(
    getEndpoint('analytics-events-summary'),
    { query },
    { enabled: true }
  );
}

// ==================== Funnel Hooks ====================

export function useConversionFunnel(query?: Types.DateRangeQuery) {
  return useAdminQuery<Types.AnalyticsResponse<Types.ConversionFunnel[]>>(
    getEndpoint('analytics-funnel-conversion'),
    { query },
    { enabled: true }
  );
}

export function useDropOffPoints() {
  return useAdminQuery<Types.AnalyticsResponse<Types.DropOffPoint[]>>(
    getEndpoint('analytics-funnel-dropoff'),
    {},
    { enabled: true }
  );
}

// ==================== User Analytics Hooks ====================

export function useUserGrowth(query: Types.PeriodQuery) {
  return useAdminQuery<Types.AnalyticsResponse<Types.UserGrowth[]>>(
    getEndpoint('analytics-users-growth'),
    { query },
    { enabled: true }
  );
}

export function useUserRetention() {
  return useAdminQuery<Types.AnalyticsResponse<Types.UserRetention[]>>(
    getEndpoint('analytics-users-retention'),
    {},
    { enabled: true }
  );
}

export function useCohortAnalysis(query: Types.CohortQuery) {
  return useAdminQuery<Types.AnalyticsResponse<Types.CohortAnalysis>>(
    getEndpoint('analytics-users-cohort'),
    { query },
    { enabled: !!query.cohortDate }
  );
}

// ==================== Revenue Analytics Hooks ====================

export function useRevenueForecast() {
  return useAdminQuery<Types.AnalyticsResponse<Types.RevenueForecast[]>>(
    getEndpoint('analytics-revenue-forecast'),
    {},
    { enabled: true }
  );
}

export function useRevenueBreakdown(query?: Types.DateRangeQuery) {
  return useAdminQuery<Types.AnalyticsResponse<Types.RevenueBreakdown[]>>(
    getEndpoint('analytics-revenue-breakdown'),
    { query },
    { enabled: true }
  );
}

// ==================== Advanced Analytics Hooks ====================

export function useDashboardOverview(query?: Types.DateRangeQuery) {
  return useAdminQuery<Types.AnalyticsResponse<Types.DashboardOverview>>(
    getEndpoint('analytics-advanced-dashboard-overview'),
    { query },
    { enabled: true }
  );
}

export function useCohortAnalysisAdvanced(type: 'daily' | 'weekly' | 'monthly' = 'monthly') {
  return useAdminQuery<Types.AnalyticsResponse<Types.CohortAnalysisAdvanced>>(
    getEndpoint('analytics-advanced-cohort'),
    { query: { type } },
    { enabled: true }
  );
}

export function useFunnelAnalysis(query: Types.FunnelTypeQuery) {
  return useAdminQuery<Types.AnalyticsResponse<Types.FunnelAnalysis>>(
    getEndpoint('analytics-advanced-funnel'),
    { query },
    { enabled: !!query.funnelType }
  );
}

export function useRetentionRate(period: string = 'monthly') {
  return useAdminQuery<Types.AnalyticsResponse<Types.RetentionRate>>(
    getEndpoint('analytics-advanced-retention'),
    { query: { period } },
    { enabled: true }
  );
}

export function useCustomerLTV() {
  return useAdminQuery<Types.AnalyticsResponse<Types.CustomerLTV>>(
    getEndpoint('analytics-advanced-ltv'),
    {},
    { enabled: true }
  );
}

export function useChurnRate(period: string = 'monthly') {
  return useAdminQuery<Types.AnalyticsResponse<Types.ChurnRate>>(
    getEndpoint('analytics-advanced-churn'),
    { query: { period } },
    { enabled: true }
  );
}

export function useGeographicDistribution(metric: string = 'orders') {
  return useAdminQuery<Types.AnalyticsResponse<Types.GeographicDistribution>>(
    getEndpoint('analytics-advanced-geo'),
    { query: { metric } },
    { enabled: true }
  );
}

export function usePeakHours() {
  return useAdminQuery<Types.AnalyticsResponse<Types.PeakHours[]>>(
    getEndpoint('analytics-advanced-peak-hours'),
    {},
    { enabled: true }
  );
}

export function useProductPerformance(query?: Types.DateRangeQuery) {
  return useAdminQuery<Types.AnalyticsResponse<Types.ProductPerformance[]>>(
    getEndpoint('analytics-advanced-product-performance'),
    { query },
    { enabled: true }
  );
}

export function useDriverPerformance(query?: Types.DateRangeQuery) {
  return useAdminQuery<Types.AnalyticsResponse<Types.DriverPerformance[]>>(
    getEndpoint('analytics-advanced-driver-performance'),
    { query },
    { enabled: true }
  );
}

// ==================== Direct API Calls (for mutations) ====================

export function useAnalyticsAPI() {
  const { callEndpoint } = useAdminAPI();

  return {
    // Calculate ROAS
    calculateRoas: async (date: string) => {
      return callEndpoint(
        getEndpoint('analytics-roas-calculate'),
        { body: { date } }
      );
    },

    // Record Ad Spend
    recordAdSpend: async (data: {
      date: string;
      platform: string;
      campaignName: string;
      amount: number;
      impressions?: number;
      clicks?: number;
      conversions?: number;
    }) => {
      return callEndpoint(
        getEndpoint('analytics-adspend-record'),
        { body: data }
      );
    },

    // Track Marketing Event
    trackEvent: async (data: {
      eventType: string;
      userId?: string;
      source?: string;
      medium?: string;
      campaign?: string;
      metadata?: any;
    }) => {
      return callEndpoint(
        getEndpoint('analytics-events-track'),
        { body: data }
      );
    },
  };
}

