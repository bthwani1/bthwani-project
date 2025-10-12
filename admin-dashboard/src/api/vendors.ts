import axiosInstance from "../utils/axios";

// دالة مساعدة لتنقية الباراميترات من القيم الفارغة
const compact = <T extends Record<string, any>>(obj: T) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== ''));

export interface VendorPerformance {
  vendorId: string;
  vendorName: string;
  storeName: string;
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  conversionRate: number;
  customerSatisfaction: number;
  period: {
    from: string;
    to: string;
  };
}

export interface VendorStats {
  totalVendors: number;
  activeVendors: number;
  inactiveVendors: number;
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  topPerformingVendors: VendorPerformance[];
  recentActivity: {
    newVendors: number;
    salesGrowth: number;
    orderGrowth: number;
  };
}

export interface VendorDetails {
  _id: string;
  fullName: string;
  phone: string;
  email?: string;
  store: {
    _id: string;
    name: string;
    address: string;
    category: string;
  };
  isActive: boolean;
  salesCount: number;
  totalRevenue: number;
  createdAt: string;
  lastOrderDate?: string;
  averageRating?: number;
  totalCustomers?: number;
}

// Get vendor by ID
export async function getVendor(id: string): Promise<VendorDetails> {
  const { data } = await axiosInstance.get<VendorDetails>(`/admin/vendors/${id}`, {
    headers: { "x-silent-401": "1" }
  });
  return data;
}

// Get all vendors with optional filters
export async function getVendors(params?: {
  isActive?: boolean;
  storeId?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{
  vendors: VendorDetails[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}> {
  const mapped = {
    q: params?.search,
    page: params?.page,
    per_page: params?.limit,
    // filters إضافية عند الحاجة
  };
  const { data } = await axiosInstance.get<{
    vendors: VendorDetails[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }>("/admin/vendors", {
    params: mapped,
    headers: { "x-silent-401": "1" }
  });
  return data;
}

// Create new vendor
export async function createVendor(vendor: Omit<VendorDetails, '_id' | 'createdAt'>): Promise<VendorDetails> {
  const { data } = await axiosInstance.post<VendorDetails>("/admin/vendors", vendor);
  return data;
}

// إحصائيات عامة (بدون id)
export const getVendorStats = (filters?: { store?: string; city?: string }) => {
  return axiosInstance.get<VendorStats>('/admin/vendors/stats', {
    params: compact(filters || {}),
    headers: { "x-silent-401": "1" }
  }).then(res => res.data);
};

// إحصائيات تاجر محدد (عند الحاجة فقط)
export const getSingleVendorStats = (vendorId: string) => {
  return axiosInstance.get<VendorStats>(`/admin/vendors/${vendorId}/stats`, {
    headers: { "x-silent-401": "1" }
  }).then(res => res.data);
};

// Get detailed vendor performance
export async function getVendorPerformance(vendorId: string, params?: {
  period?: 'week' | 'month' | 'quarter' | 'year';
  fromDate?: string;
  toDate?: string;
}): Promise<VendorPerformance> {
  const { data } = await axiosInstance.get<VendorPerformance>(`/admin/vendors/${vendorId}/performance`, {
    params,
    headers: { "x-silent-401": "1" }
  });
  return data;
}

// Get vendor sales data for charts
export async function getVendorSalesData(vendorId: string, params?: {
  period?: 'week' | 'month' | 'quarter';
  groupBy?: 'day' | 'week' | 'month';
}): Promise<{
  labels: string[];
  sales: number[];
  orders: number[];
}> {
  const { data } = await axiosInstance.get<{
    labels: string[];
    sales: number[];
    orders: number[];
  }>(`/admin/vendors/${vendorId}/sales-data`, {
    params,
    headers: { "x-silent-401": "1" }
  });
  return data;
}

// Update vendor status
export async function updateVendorStatus(vendorId: string, isActive: boolean): Promise<VendorDetails> {
  const { data } = await axiosInstance.patch<VendorDetails>(`/admin/vendors/${vendorId}/status`, {
    isActive
  });
  return data;
}

// Update vendor information
export async function updateVendor(vendorId: string, updates: Partial<VendorDetails>): Promise<VendorDetails> {
  const { data } = await axiosInstance.patch<VendorDetails>(`/admin/vendors/${vendorId}`, updates);
  return data;
}

// Reset vendor password
export async function resetVendorPassword(vendorId: string, newPassword: string): Promise<void> {
  await axiosInstance.post(`/admin/vendors/${vendorId}/reset-password`, {
    password: newPassword
  });
}

// Delete vendor
export async function deleteVendor(vendorId: string): Promise<void> {
  await axiosInstance.delete(`/admin/vendors/${vendorId}`);
}

// Export vendors data
export async function exportVendors(params?: {
  format?: 'excel' | 'csv';
  isActive?: boolean;
}): Promise<Blob> {
  const { data } = await axiosInstance.get("/admin/vendors/export", {
    params,
    responseType: 'blob',
    headers: { "x-silent-401": "1" }
  });
  return data;
}
