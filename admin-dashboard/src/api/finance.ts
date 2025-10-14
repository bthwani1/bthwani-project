import axiosInstance from "../utils/axios";

export interface WalletStatementLine {
  _id: string;
  account_id: string;
  date: string;
  description: string;
  memo?: string;
  debit: number;
  credit: number;
  amount: number;
  side: 'debit' | 'credit';
  balance: number;
  running_balance: number;
  balance_state: 'pending' | 'available';
  reference_type: string;
  reference_id: string;
  ref_type: string;
  ref_id: string;
  ledger_entry_id?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Settlement {
  _id: string;
  id: string;
  type: 'driver' | 'vendor';
  period_start: string;
  period_end: string;
  currency: string;
  status: 'draft' | 'ready' | 'paid' | 'canceled';
  payable_account_id: string;
  gross_amount: number;
  fees: number;
  adjustments: number;
  net_amount: number;
  created_by: {
    _id: string;
    fullName: string;
    email: string;
  };
  paid_by?: {
    _id: string;
    fullName: string;
    email: string;
  };
  paid_at?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SettlementLine {
  _id: string;
  settlement_id: string;
  ref_type: 'order' | 'manual_adjustment';
  ref_id: string;
  description: string;
  amount: number;
  ledger_entry_id?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SettlementGenerationResponse {
  message: string;
  settlement: {
    id: string;
    type: string;
    period_start: string;
    period_end: string;
    status: string;
    gross_amount: number;
    fees: number;
    adjustments: number;
    net_amount: number;
  };
  lines_count: number;
  total_gross_amount: number;
  total_fees: number;
  total_adjustments: number;
  total_net_amount: number;
}

// Get all settlements with filtering and pagination
export async function getSettlements(params?: {
  page?: number;
  perPage?: number;
  sort?: string;
  filters?: {
    status?: string;
    type?: string;
    period_start?: string;
    period_end?: string;
  };
}): Promise<{
  settlements: Settlement[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  meta: {
    page: number;
    per_page: number;
    total: number;
    returned: number;
  };
}> {
  const { data } = await axiosInstance.get<{
    settlements: Settlement[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
    meta: {
      page: number;
      per_page: number;
      total: number;
      returned: number;
    };
  }>("/finance/settlements", {
    params,
    headers: { "x-silent-401": "1" }
  });
  return data;
}

// Get settlement by ID
export async function getSettlementById(settlementId: string): Promise<{
  settlement: Settlement;
  lines: SettlementLine[];
}> {
  const { data } = await axiosInstance.get<{
    settlement: Settlement;
    lines: SettlementLine[];
  }>(`/finance/settlements/${settlementId}`, {
    headers: { "x-silent-401": "1" }
  });
  return data;
}

// Generate new settlement
export async function generateSettlement(data: {
  type: 'driver' | 'vendor';
  period_start: string;
  period_end: string;
}): Promise<SettlementGenerationResponse> {
  const { data: response } = await axiosInstance.post<SettlementGenerationResponse>(
    "/finance/settlements/generate",
    data
  );
  return response;
}

// Mark settlement as paid
export async function markSettlementAsPaid(settlementId: string): Promise<Settlement> {
  const { data } = await axiosInstance.patch<Settlement>(
    `/finance/settlements/${settlementId}/mark-paid`
  );
  return data;
}

// Export settlement to CSV
export async function exportSettlementToCSV(settlementId: string): Promise<Blob> {
  const { data } = await axiosInstance.get(`/finance/settlements/${settlementId}/export.csv`, {
    responseType: 'blob',
    headers: { "x-silent-401": "1" }
  });
  return data;
}

// Get wallet balance for current user
export async function getWalletBalance(): Promise<{
  account: {
    id: string;
    owner_type: string;
    owner_id: string;
    currency: string;
    status: string;
  };
  balance: {
    account_id: string;
    owner_type: string;
    owner_id: string;
    currency: string;
    pending_amount: number;
    available_amount: number;
    total_amount: number;
  };
}> {
  const { data } = await axiosInstance.get<{
    account: {
      id: string;
      owner_type: string;
      owner_id: string;
      currency: string;
      status: string;
    };
    balance: {
      account_id: string;
      owner_type: string;
      owner_id: string;
      currency: string;
      pending_amount: number;
      available_amount: number;
      total_amount: number;
    };
  }>("/finance/wallet/balance", {
    headers: { "x-silent-401": "1" }
  });
  return data;
}

// Get wallet balances by type (admin only)
export async function getWalletBalancesByType(type: 'driver' | 'vendor' | 'company' | 'user'): Promise<{
  owner_type: string;
  balances: Array<{
    account_id: string;
    owner_type: string;
    owner_id: string;
    currency: string;
    pending_amount: number;
    available_amount: number;
    total_amount: number;
  }>;
  total_available: number;
}> {
  const { data } = await axiosInstance.get<{
    owner_type: string;
    balances: Array<{
      account_id: string;
      owner_type: string;
      owner_id: string;
      currency: string;
      pending_amount: number;
      available_amount: number;
      total_amount: number;
    }>;
    total_available: number;
  }>(`/finance/wallet/balances/${type}`, {
    headers: { "x-silent-401": "1" }
  });
  return data;
}

// Get settlement balance for eligibility check (admin only)
export async function getSettlementBalance(type: 'driver' | 'vendor'): Promise<{
  owner_type: string;
  available_balance: number;
  can_settle: boolean;
}> {
  const { data } = await axiosInstance.get<{
    owner_type: string;
    available_balance: number;
    can_settle: boolean;
  }>(`/finance/wallet/settlement-balance/${type}`, {
    headers: { "x-silent-401": "1" }
  });
  return data;
}

// Get ledger entries
export async function getLedgerEntries(params?: {
  page?: number;
  perPage?: number;
  sort?: string;
  filters?: {
    event_type?: string;
    event_ref?: string;
    date_from?: string;
    date_to?: string;
  };
}): Promise<{
  entries: Array<{
    _id: string;
    event_type: string;
    event_ref: string;
    description: string;
    total_debit: number;
    total_credit: number;
    is_balanced: boolean;
    created_by?: {
      _id: string;
      fullName: string;
      email: string;
    };
    createdAt: string;
    updatedAt: string;
    splits: Array<{
      _id: string;
      entry_id: string;
      account_id?: {
        _id: string;
        owner_type: string;
        owner_id: string;
      };
      account_type: string;
      side: 'debit' | 'credit';
      amount: number;
      currency: string;
      balance_state: 'pending' | 'available';
      memo?: string;
      createdAt: string;
      updatedAt: string;
    }>;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  meta: {
    page: number;
    per_page: number;
    total: number;
    returned: number;
  };
}> {
  const { data } = await axiosInstance.get<{
    entries: Array<{
      _id: string;
      event_type: string;
      event_ref: string;
      description: string;
      total_debit: number;
      total_credit: number;
      is_balanced: boolean;
      created_by?: {
        _id: string;
        fullName: string;
        email: string;
      };
      createdAt: string;
      updatedAt: string;
      splits: Array<{
        _id: string;
        entry_id: string;
        account_id?: {
          _id: string;
          owner_type: string;
          owner_id: string;
        };
        account_type: string;
        side: 'debit' | 'credit';
        amount: number;
        currency: string;
        balance_state: 'pending' | 'available';
        memo?: string;
        createdAt: string;
        updatedAt: string;
      }>;
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
    meta: {
      page: number;
      per_page: number;
      total: number;
      returned: number;
    };
  }>("/finance/wallet/ledger/entries", {
    params,
    headers: { "x-silent-401": "1" }
  });
  return data;
}

// Generate reconciliation report
export async function generateReconciliationReport(params: {
  period_start: string;
  period_end: string;
  entity_type?: 'driver' | 'vendor';
}): Promise<{
  message: string;
  report: {
    period_start: string;
    period_end: string;
    orders_total: number;
    wallet_movements_total: number;
    settlements_total: number;
    discrepancies: {
      orders_vs_wallet: number;
      wallet_vs_settlements: number;
      orders_vs_settlements: number;
    };
    notes: string[];
  };
}> {
  const { data } = await axiosInstance.get<{
    message: string;
    report: {
      period_start: string;
      period_end: string;
      orders_total: number;
      wallet_movements_total: number;
      settlements_total: number;
      discrepancies: {
        orders_vs_wallet: number;
        wallet_vs_settlements: number;
        orders_vs_settlements: number;
      };
      notes: string[];
    };
  }>("/finance/reconciliation/report", {
    params,
    headers: { "x-silent-401": "1" }
  });
  return data;
}

// Validate ledger balance
export async function validateLedgerBalance(params: {
  period_start: string;
  period_end: string;
}): Promise<{
  message: string;
  period_start: string;
  period_end: string;
  total_debit: number;
  total_credit: number;
  is_balanced: boolean;
  unbalanced_entries: Array<{
    id: string;
    event_type: string;
    event_ref: string;
    total_debit: number;
    total_credit: number;
    is_balanced: boolean;
  }>;
}> {
  const { data } = await axiosInstance.get<{
    message: string;
    period_start: string;
    period_end: string;
    total_debit: number;
    total_credit: number;
    is_balanced: boolean;
    unbalanced_entries: Array<{
      id: string;
      event_type: string;
      event_ref: string;
      total_debit: number;
      total_credit: number;
      is_balanced: boolean;
    }>;
  }>("/finance/reconciliation/validate-balance", {
    params,
    headers: { "x-silent-401": "1" }
  });
  return data;
}

// Generate daily balance report
export async function generateDailyBalanceReport(date: string): Promise<{
  message: string;
  date: string;
  total_debit: number;
  total_credit: number;
  is_balanced: boolean;
  entry_count: number;
  unbalanced_entries: Array<{
    id: string;
    event_type: string;
    event_ref: string;
    total_debit: number;
    total_credit: number;
    is_balanced: boolean;
  }>;
}> {
  const { data } = await axiosInstance.get<{
    message: string;
    date: string;
    total_debit: number;
    total_credit: number;
    is_balanced: boolean;
    entry_count: number;
    unbalanced_entries: Array<{
      id: string;
      event_type: string;
      event_ref: string;
      total_debit: number;
      total_credit: number;
      is_balanced: boolean;
    }>;
  }>(`/finance/reconciliation/daily-report/${date}`, {
    headers: { "x-silent-401": "1" }
  });
  return data;
}

// Commission API functions
export interface CommissionRule {
  _id: string;
  applicable_to: 'driver' | 'vendor';
  basis: 'percentage' | 'flat';
  value: number;
  min?: number;
  max?: number;
  effective_from: string;
  effective_to?: string;
  priority: number;
  is_active: boolean;
  created_by: {
    _id: string;
    fullName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CommissionCalculationResult {
  rule_id: string;
  applicable_to: 'driver' | 'vendor';
  basis: 'percentage' | 'flat';
  value: number;
  calculated_amount: number;
  order_amount: number;
  min?: number;
  max?: number;
}

// Create commission rule
export async function createCommissionRule(data: {
  applicable_to: 'driver' | 'vendor';
  basis: 'percentage' | 'flat';
  value: number;
  min?: number;
  max?: number;
  effective_from: string;
  effective_to?: string;
  priority?: number;
}): Promise<{
  message: string;
  rule: CommissionRule;
}> {
  const { data: response } = await axiosInstance.post<{
    message: string;
    rule: CommissionRule;
  }>("/finance/commissions/rules", data);
  return response;
}

// Get commission rules
export async function getCommissionRules(): Promise<{
  rules: CommissionRule[];
  count: number;
}> {
  const { data } = await axiosInstance.get<{
    rules: CommissionRule[];
    count: number;
  }>("/finance/commissions/rules", {
    headers: { "x-silent-401": "1" }
  });
  return data;
}

// Calculate commission
export async function calculateCommission(data: {
  order_amount: number;
  entity_type: 'driver' | 'vendor';
  entity_id: string;
  order_date?: string;
}): Promise<{
  message: string;
  commission: CommissionCalculationResult;
}> {
  const { data: response } = await axiosInstance.post<{
    message: string;
    commission: CommissionCalculationResult;
  }>("/finance/commissions/calculate", data);
  return response;
}

// Get commission report
export async function getCommissionReport(params: {
  period_start: string;
  period_end: string;
  entity_type?: 'driver' | 'vendor';
}): Promise<{
  message: string;
  report: {
    period_start: string;
    period_end: string;
    total_commission: number;
    order_count: number;
    average_commission_rate: number;
    rules_applied: Array<{
      applicable_to: string;
      basis: string;
      value: number;
      min?: number;
      max?: number;
      priority: number;
      usage_count: number;
    }>;
  };
}> {
  const { data } = await axiosInstance.get<{
    message: string;
    report: {
      period_start: string;
      period_end: string;
      total_commission: number;
      order_count: number;
      average_commission_rate: number;
      rules_applied: Array<{
        applicable_to: string;
        basis: string;
        value: number;
        min?: number;
        max?: number;
        priority: number;
        usage_count: number;
      }>;
    };
  }>("/finance/commissions/report", {
    params,
    headers: { "x-silent-401": "1" }
  });
  return data;
}

// Payout Management API functions
export interface PayoutBatch {
  _id: string;
  id: string;
  period_start: string;
  period_end: string;
  status: 'draft' | 'processing' | 'paid';
  currency: string;
  total_count: number;
  total_amount: number;
  created_by: {
    _id: string;
    fullName: string;
    email: string;
  };
  processed_by?: {
    _id: string;
    fullName: string;
    email: string;
  };
  processed_at?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PayoutItem {
  _id: string;
  batch_id: string;
  account_id: {
    _id: string;
    owner_type: string;
    owner_id: string;
  };
  beneficiary: string;
  amount: number;
  fees: number;
  net_amount: number;
  export_ref?: string;
  ledger_entry_id?: string;
  status: 'pending' | 'processed' | 'failed';
  error_message?: string;
  createdAt: string;
  updatedAt: string;
}

// Generate new payout batch
export async function generatePayoutBatch(data: {
  period_start: string;
  period_end: string;
  min_amount?: number;
}): Promise<{
  message: string;
  batch: {
    id: string;
    period_start: string;
    period_end: string;
    status: string;
    total_count: number;
    total_amount: number;
  };
  items_count: number;
  total_amount: number;
  drivers_included: number;
}> {
  const { data: response } = await axiosInstance.post<{
    message: string;
    batch: {
      id: string;
      period_start: string;
      period_end: string;
      status: string;
      total_count: number;
      total_amount: number;
    };
    items_count: number;
    total_amount: number;
    drivers_included: number;
  }>("/finance/payouts/generate", data);
  return response;
}

// Get payout batches
export async function getPayoutBatches(params?: {
  page?: number;
  perPage?: number;
  status?: string;
  date_from?: Date;
  date_to?: Date;
}): Promise<{
  batches: PayoutBatch[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}> {
  const { data } = await axiosInstance.get<{
    batches: PayoutBatch[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }>("/finance/payouts", {
    params,
    headers: { "x-silent-401": "1" }
  });
  return data;
}

// Get payout batch details
export async function getPayoutBatchDetails(batchId: string): Promise<{
  batch: PayoutBatch;
  items: PayoutItem[];
}> {
  const { data } = await axiosInstance.get<{
    batch: PayoutBatch;
    items: PayoutItem[];
  }>(`/finance/payouts/${batchId}`, {
    headers: { "x-silent-401": "1" }
  });
  return data;
}

// Process payout batch
export async function processPayoutBatch(batchId: string): Promise<PayoutBatch> {
  const { data } = await axiosInstance.patch<PayoutBatch>(
    `/finance/payouts/${batchId}/process`
  );
  return data;
}

// Export payout batch to CSV
export async function exportPayoutBatchToCSV(batchId: string): Promise<Blob> {
  const { data } = await axiosInstance.get(`/finance/payouts/${batchId}/export.csv`, {
    responseType: 'blob',
    headers: { "x-silent-401": "1" }
  });
  return data;
}

// Get wallet statement for an account
export async function getWalletStatement(
  accountId: string,
  params?: {
    date_from?: string;
    date_to?: string;
    balance_state?: string;
  }
): Promise<{
  account_id: string;
  statement_lines: WalletStatementLine[];
  count: number;
}> {
  const { data } = await axiosInstance.get<{
    account_id: string;
    statement_lines: WalletStatementLine[];
    count: number;
  }>(`/finance/payouts/wallet-statement/${accountId}`, {
    params,
    headers: { "x-silent-401": "1" }
  });
  return data;
}

// Export wallet statement to CSV
export async function exportWalletStatementToCSV(
  accountId: string,
  params?: {
    date_from?: string;
    date_to?: string;
    balance_state?: string;
  }
): Promise<Blob> {
  const { data } = await axiosInstance.get(`/finance/payouts/wallet-statement/${accountId}/export.csv`, {
    params,
    responseType: 'blob',
    headers: { "x-silent-401": "1" }
  });
  return data;
}

// Unified Reports Export Functions

/**
 * تصدير تقرير المبيعات
 */
export async function exportSalesReport(params: {
  startDate: string;
  endDate: string;
  storeId?: string;
  status?: string;
  format?: 'csv' | 'excel';
}): Promise<Blob> {
  const { data } = await axiosInstance.get('/finance/reports/sales/export', {
    params,
    responseType: 'blob',
    headers: { "x-silent-401": "1" }
  });
  return data;
}

/**
 * تصدير تقرير المدفوعات
 */
export async function exportPayoutsReport(params: {
  startDate: string;
  endDate: string;
  status?: string;
  format?: 'csv' | 'excel';
}): Promise<Blob> {
  const { data } = await axiosInstance.get('/finance/reports/payouts/export', {
    params,
    responseType: 'blob',
    headers: { "x-silent-401": "1" }
  });
  return data;
}

/**
 * تصدير تقرير الطلبات
 */
export async function exportOrdersReport(params: {
  startDate: string;
  endDate: string;
  status?: string;
  storeId?: string;
  format?: 'csv' | 'excel';
}): Promise<Blob> {
  const { data } = await axiosInstance.get('/finance/reports/orders/export', {
    params,
    responseType: 'blob',
    headers: { "x-silent-401": "1" }
  });
  return data;
}

/**
 * تصدير تقرير الرسوم والضرائب
 */
export async function exportFeesTaxesReport(params: {
  startDate: string;
  endDate: string;
  type?: 'fees' | 'taxes' | 'both';
  format?: 'csv' | 'excel';
}): Promise<Blob> {
  const { data } = await axiosInstance.get('/finance/reports/fees-taxes/export', {
    params,
    responseType: 'blob',
    headers: { "x-silent-401": "1" }
  });
  return data;
}

/**
 * تصدير تقرير المرتجعات
 */
export async function exportRefundsReport(params: {
  startDate: string;
  endDate: string;
  status?: string;
  format?: 'csv' | 'excel';
}): Promise<Blob> {
  const { data } = await axiosInstance.get('/finance/reports/refunds/export', {
    params,
    responseType: 'blob',
    headers: { "x-silent-401": "1" }
  });
  return data;
}

/**
 * جلب ملخص البيانات للمقارنة مع الشاشات
 */
export async function getDataSummary(params: {
  startDate: string;
  endDate: string;
  reportType: 'sales' | 'payouts' | 'orders';
  storeId?: string;
  status?: string;
}): Promise<{
  message: string;
  summary: {
    totalRecords: number;
    totalAmount: number;
    dateRange: { from: string; to: string } | null;
    statusCounts: Record<string, number>;
  };
  reportType: string;
  filters: Record<string, string>;
}> {
  const { data } = await axiosInstance.get('/finance/reports/data-summary', {
    params,
    headers: { "x-silent-401": "1" }
  });
  return data;
}

/**
 * فحص مطابقة البيانات بين الشاشة والملف المصدر
 */
export async function validateDataConsistency(params: {
  reportType: 'sales' | 'payouts' | 'orders';
  startDate: string;
  endDate: string;
  uiTotal: number;
  uiCount: number;
  storeId?: string;
  status?: string;
}): Promise<{
  message: string;
  consistency: {
    totalMatch: boolean;
    countMatch: boolean;
    fileTotal: number;
    uiTotal: number;
    fileCount: number;
    uiCount: number;
    totalDifference: number;
    countDifference: number;
  };
  reportType: string;
  exportResult: {
    filename: string;
    generatedAt: string;
    size: number;
  };
}> {
  const { data } = await axiosInstance.post('/finance/reports/validate-consistency', params, {
    headers: { "x-silent-401": "1" }
  });
  return data;
}