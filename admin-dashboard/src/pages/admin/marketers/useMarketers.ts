import { useEffect, useState } from "react";
import axios from "../../../utils/axios";
import { isAxiosError } from "axios";

export type Marketer = {
  _id: string;
  fullName: string;
  phone: string;
  email?: string;
  city?: string;
  team?: string;
  password?: string;
  area?: string;
  status: "active" | "suspended";
  createdAt: string;
};

export function useMarketers() {
  const [rows, setRows] = useState<Marketer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function list(params?: Record<string, string>) {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<Marketer[]>("/admin/marketers", { params });
      setRows(res.data || []);
    } catch (e: unknown) {
      const message = isAxiosError(e)
        ? ((e.response?.data as unknown as { message?: string })?.message ?? e.message)
        : e instanceof Error
        ? e.message
        : "فشل في جلب المسوّقين";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  // إنشاء (دعوة) — يُرسل كلمة مرور عند الإنشاء فقط
  async function create(payload: Partial<Marketer> & { password?: string }) {
    setLoading(true);
    setError(null);
    try {
      await axios.post("/admin/marketers/invite", payload);
      await list();
    } catch (e: unknown) {
      const message = isAxiosError(e)
        ? ((e.response?.data as unknown as { message?: string })?.message ?? e.message)
        : e instanceof Error
        ? e.message
        : "فشل إنشاء المسوّق";
      setError(message);
      throw e;
    } finally {
      setLoading(false);
    }
  }

  // تعديل بيانات عامة بدون كلمة مرور
  async function patch(id: string, payload: Partial<Marketer>) {
    setLoading(true);
    setError(null);
    try {
      await axios.patch(`/admin/marketers/${id}`, payload);
      await list();
    } catch (e: unknown) {
      const message = isAxiosError(e)
        ? ((e.response?.data as unknown as { message?: string })?.message ?? e.message)
        : e instanceof Error
        ? e.message
        : "فشل تعديل المسوّق";
      setError(message);
      throw e;
    } finally {
      setLoading(false);
    }
  }

  // تفعيل/تعليق
  async function setStatus(id: string, status: "active" | "suspended") {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`/admin/marketers/${id}/status`, { status });
      await list();
    } catch (e: unknown) {
      const message = isAxiosError(e)
        ? ((e.response?.data as unknown as { message?: string })?.message ?? e.message)
        : e instanceof Error
        ? e.message
        : "فشل تحديث الحالة";
      setError(message);
      throw e;
    } finally {
      setLoading(false);
    }
  }

  // إعادة تعيين كلمة المرور
  async function resetPassword(id: string, password: string) {
    if (!password || password.length < 8) {
      throw new Error("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
    }
    setLoading(true);
    setError(null);
    try {
      await axios.post(`/admin/marketers/${id}/reset-password`, { password });
    } catch (e: unknown) {
      const message = isAxiosError(e)
        ? ((e.response?.data as unknown as { message?: string })?.message ?? e.message)
        : e instanceof Error
        ? e.message
        : "فشل إعادة تعيين كلمة المرور";
      setError(message);
      throw e;
    } finally {
      setLoading(false);
    }
  }

  // حذف
  async function remove(id: string) {
    if (!window.confirm("حذف المسوّق؟")) return;
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/admin/marketers/${id}`);
      await list();
    } catch (e: unknown) {
      const message = isAxiosError(e)
        ? ((e.response?.data as unknown as { message?: string })?.message ?? e.message)
        : e instanceof Error
        ? e.message
        : "فشل حذف المسوّق";
      setError(message);
      throw e;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    list();
  }, []);
  return {
    rows,
    loading,
    error,
    list,
    create,
    patch,
    setStatus,
    resetPassword,
    remove,
  };
}
