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

export type ArabonStatus = 'draft' | 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface ArabonMetadata {
  guests?: number;
  notes?: string;
  [key: string]: any;
}

export interface CreateArabonPayload {
  ownerId: string;
  title: string;
  description?: string;
  depositAmount?: number;
  scheduleAt?: string;
  metadata?: ArabonMetadata;
  status?: ArabonStatus;
}

export interface UpdateArabonPayload {
  title?: string;
  description?: string;
  depositAmount?: number;
  scheduleAt?: string;
  metadata?: ArabonMetadata;
  status?: ArabonStatus;
}

export interface ArabonItem {
  _id: string;
  ownerId: string;
  title: string;
  description?: string;
  depositAmount?: number;
  scheduleAt?: string;
  metadata?: ArabonMetadata;
  status: ArabonStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ArabonListResponse {
  data: ArabonItem[];
  nextCursor?: string;
  hasMore: boolean;
}

// ==================== API Functions ====================

/**
 * إنشاء عربون جديد
 */
export const createArabon = async (
  payload: CreateArabonPayload
): Promise<ArabonItem> => {
  const headers = await getAuthHeaders();
  const response = await axiosInstance.post("/arabon", payload, {
    headers,
  });
  return response.data;
};

/**
 * جلب قائمة العربونات
 */
export const getArabonList = async (
  cursor?: string
): Promise<ArabonListResponse> => {
  const headers = await getAuthHeaders();
  const params = cursor ? { cursor } : {};
  const response = await axiosInstance.get("/arabon", {
    headers,
    params,
  });
  return response.data;
};

/**
 * جلب تفاصيل عربون محدد
 */
export const getArabonDetails = async (id: string): Promise<ArabonItem> => {
  const headers = await getAuthHeaders();
  const response = await axiosInstance.get(`/arabon/${id}`, {
    headers,
  });
  return response.data;
};

/**
 * تحديث عربون
 */
export const updateArabon = async (
  id: string,
  payload: UpdateArabonPayload
): Promise<ArabonItem> => {
  const headers = await getAuthHeaders();
  const response = await axiosInstance.patch(`/arabon/${id}`, payload, {
    headers,
  });
  return response.data;
};

/**
 * حذف عربون
 */
export const deleteArabon = async (id: string): Promise<void> => {
  const headers = await getAuthHeaders();
  await axiosInstance.delete(`/arabon/${id}`, {
    headers,
  });
};

/**
 * جلب عربوناتي الخاصة
 */
export const getMyArabon = async (
  cursor?: string
): Promise<ArabonListResponse> => {
  const headers = await getAuthHeaders();
  const params = cursor ? { cursor } : {};
  const response = await axiosInstance.get("/arabon/my", {
    headers,
    params,
  });
  return response.data;
};

/**
 * البحث في العربونات
 */
export const searchArabon = async (
  query: string,
  status?: ArabonStatus,
  cursor?: string
): Promise<ArabonListResponse> => {
  const headers = await getAuthHeaders();
  const params: any = { q: query };
  if (status) params.status = status;
  if (cursor) params.cursor = cursor;

  const response = await axiosInstance.get("/arabon/search", {
    headers,
    params,
  });
  return response.data;
};
