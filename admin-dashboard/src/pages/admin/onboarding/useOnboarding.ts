import { useEffect, useState } from "react";
import api from "../../../utils/axios";

export type Onb = {
  _id: string;
  storeDraft: { name: string; address: string };
  ownerDraft?: { fullName?: string; phone?: string; email?: string };
  status: "submitted" | "needs_fix" | "approved" | "rejected" | "draft";
  notes?: string;
  createdAt: string;
};

export function useOnboarding() {
  const [rows, setRows] = useState<Onb[]>([]);
  const [loading, setLoading] = useState(false);

  async function list(params?: Record<string, string>) {
    setLoading(true);
    try {
      const r = await api.get<Onb[]>("/field/onboarding/queue", { params });
      setRows(r.data);
    } finally {
      setLoading(false);
    }
  }
  async function approve(id: string, vendorPassword?: string) {
    await api.post(`/field/onboarding/${id}/approve`, { vendorPassword });
    await list();
  }
  async function reject(id: string, reason: string) {
    await api.post(`/field/onboarding/${id}/reject`, { reason });
    await list();
  }
  async function needsFix(id: string, notes: string) {
    await api.post(`/field/onboarding/${id}/needs-fix`, { notes });
    await list();
  }

  useEffect(() => {
    list({ status: "submitted" });
  }, []);
  return { rows, loading, list, approve, reject, needsFix };
}
