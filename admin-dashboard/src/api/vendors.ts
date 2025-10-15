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
  const { data } = await axiosInstance.get<VendorDetails>(`/vendors/${id}`, {
    headers: { "x-silent-401": "1" }
  });
  return data;
}

// Get all vendors with optional filters
export async function getVendors(params?: {
  isActive?: boolean;
  storeId?: string;
  search?: string;
  cursor?: string;
  limit?: number;
}): Promise<{
  data: VendorDetails[];
  pagination: {
    nextCursor: string | null;
    hasMore: boolean;
    limit: number;
  };
}> {
  const queryParams: any = { limit: params?.limit || 20 };
  if (params?.cursor) queryParams.cursor = params.cursor;
  if (params?.isActive !== undefined) queryParams.isActive = params.isActive;
  
  const { data } = await axiosInstance.get("/vendors", {
    params: queryParams,
    headers: { "x-silent-401": "1" }
  });
  return data;
}

// Create new vendor
export async function createVendor(vendorData: {
  fullName: string;
  phone: string;
  email?: string;
  password: string;
  store: string;
}): Promise<VendorDetails> {
  const { data } = await axiosInstance.post<VendorDetails>("/vendors", vendorData);
  return data;
}

// Note: Stats/Performance endpoints غير موجودة في Backend
// يمكن استخدام /vendors/dashboard/overview أو إضافتها في admin module لاحقاً

// Update vendor status
export async function updateVendorStatus(vendorId: string, isActive: boolean): Promise<VendorDetails> {
  const { data } = await axiosInstance.patch<VendorDetails>(`/vendors/${vendorId}/status`, {
    isActive
  });
  return data;
}

// Update vendor information
export async function updateVendor(vendorId: string, updates: Partial<VendorDetails>): Promise<VendorDetails> {
  const { data } = await axiosInstance.patch<VendorDetails>(`/vendors/${vendorId}`, updates);
  return data;
}

// Reset vendor password
export async function resetVendorPassword(vendorId: string, newPassword: string): Promise<void> {
  await axiosInstance.post(`/vendors/${vendorId}/reset-password`, {
    password: newPassword
  });
}

// Note: Delete & Export endpoints غير موجودة في Backend
// يمكن إضافتها في vendor.controller.ts أو admin.controller.ts عند الحاجة
