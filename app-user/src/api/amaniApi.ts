import axiosInstance from "../utils/api/axiosInstance";
import { refreshIdToken } from "./authService";

/**
 * Helper لجلب headers المصادقة
 */
const getAuthHeaders = async () => {
  try {
    const token = await refreshIdToken();
    return { Authorization: `Bearer ${token}` };
  } catch (error) {
    console.warn("⚠️ فشل في جلب التوكن:", error);
    return {};
  }
};

// ==================== Types ====================

export type AmaniStatus = 'draft' | 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface AmaniLocation {
  lat: number;
  lng: number;
  address: string;
}

export interface AmaniMetadata {
  passengers?: number;
  luggage?: boolean;
  specialRequests?: string;
  [key: string]: any;
}

export interface CreateAmaniPayload {
  ownerId: string;
  title: string;
  description?: string;
  origin?: AmaniLocation;
  destination?: AmaniLocation;
  metadata?: AmaniMetadata;
  status?: AmaniStatus;
}

export interface UpdateAmaniPayload {
  title?: string;
  description?: string;
  origin?: AmaniLocation;
  destination?: AmaniLocation;
  metadata?: AmaniMetadata;
  status?: AmaniStatus;
}

export interface AmaniItem {
  _id: string;
  ownerId: string;
  title: string;
  description?: string;
  origin?: AmaniLocation;
  destination?: AmaniLocation;
  metadata?: AmaniMetadata;
  status: AmaniStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface AmaniListResponse {
  data: AmaniItem[];
  nextCursor?: string;
  hasMore: boolean;
}

// ==================== API Functions ====================

/**
 * إنشاء طلب أماني جديد
 */
export const createAmani = async (
  payload: CreateAmaniPayload
): Promise<AmaniItem> => {
  const headers = await getAuthHeaders();
  const response = await axiosInstance.post("/amani", payload, {
    headers,
  });
  return response.data;
};

/**
 * جلب قائمة طلبات الأماني
 */
export const getAmaniList = async (
  cursor?: string
): Promise<AmaniListResponse> => {
  const headers = await getAuthHeaders();
  const params = cursor ? { cursor } : {};
  const response = await axiosInstance.get("/amani", {
    headers,
    params,
  });
  return response.data;
};

/**
 * جلب تفاصيل طلب أماني محدد
 */
export const getAmaniDetails = async (id: string): Promise<AmaniItem> => {
  const headers = await getAuthHeaders();
  const response = await axiosInstance.get(`/amani/${id}`, {
    headers,
  });
  return response.data;
};

/**
 * تحديث طلب أماني
 */
export const updateAmani = async (
  id: string,
  payload: UpdateAmaniPayload
): Promise<AmaniItem> => {
  const headers = await getAuthHeaders();
  const response = await axiosInstance.patch(`/amani/${id}`, payload, {
    headers,
  });
  return response.data;
};

/**
 * حذف طلب أماني
 */
export const deleteAmani = async (id: string): Promise<void> => {
  const headers = await getAuthHeaders();
  await axiosInstance.delete(`/amani/${id}`, {
    headers,
  });
};

/**
 * جلب طلباتي الخاصة
 */
export const getMyAmani = async (
  cursor?: string
): Promise<AmaniListResponse> => {
  const headers = await getAuthHeaders();
  const params = cursor ? { cursor } : {};
  const response = await axiosInstance.get("/amani/my", {
    headers,
    params,
  });
  return response.data;
};

/**
 * البحث في طلبات الأماني
 */
export const searchAmani = async (
  query: string,
  cursor?: string
): Promise<AmaniListResponse> => {
  const headers = await getAuthHeaders();
  const params: any = { q: query };
  if (cursor) params.cursor = cursor;

  const response = await axiosInstance.get("/amani/search", {
    headers,
    params,
  });
  return response.data;
};
