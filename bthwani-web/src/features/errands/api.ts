// src/features/errands/api.ts
import axiosInstance from "../../api/axios-instance";
import type { ErrandForm } from "./types";

export async function fetchErrandFee(form: ErrandForm) {
  const { data } = await axiosInstance.post("/delivery/order/errand/fee", {
    errand: {
      category: form.category,
      size: form.size,
      weightKg: form.weightKg ? Number(form.weightKg) : undefined,
      pickup: form.pickup,
      dropoff: form.dropoff,
      tip: form.tip ? Number(form.tip) : 0,
    },
  });
  return data as {
    distanceKm?: number;
    deliveryFee?: number;
    totalWithTip?: number;
  };
}

export async function submitErrandOrder(payload: {
  paymentMethod: ErrandForm["paymentMethod"];
  scheduledFor: string | null;
  tip: number;
  notes?: string;
  errand: {
    category: ErrandForm["category"];
    description?: string;
    size?: ErrandForm["size"];
    weightKg?: number;
    pickup: ErrandForm["pickup"];
    dropoff: ErrandForm["dropoff"];
    waypoints: ErrandForm["waypoints"];
  };
}) {
  const { data } = await axiosInstance.post("/delivery/order/errand", payload);
  return data;
}
