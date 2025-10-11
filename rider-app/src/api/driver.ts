
import axios from "./axios";

export const getDriverOrders = async () => {
  const response = await axios.get("/driver/orders");
  return response.data;
};

export const completeOrder = async (orderId: string) => {
  const response = await axios.post(`/driver/complete/${orderId}`);
  return response.data;
};

// جديد:
export const updateAvailability = async (isAvailable: boolean) => {
  const response = await axios.post("/driver/availability", { isAvailable });
  return response.data;
};

export const getWalletSummary = async () => {
  const response = await axios.get("/driver/wallet/summary");
  return response.data;
};

export const listWithdrawals = async () => {
  const response = await axios.get("/driver/withdrawals");
  return response.data;
};

export const requestWithdrawal = async (payload: { amount: number; method: string; accountInfo?: string }) => {
  const response = await axios.post("/driver/withdrawals", payload);
  return response.data;
};

export const listOffers = async () => {
  const response = await axios.get("/driver/offers");
  return response.data;
};

export const acceptOffer = async (offerId: string) => {
  const response = await axios.post(`/driver/offers/${offerId}/accept`);
  return response.data;
};

export const listVacations = async (params?: {
  from?: string;
  to?: string;
  status?: string;
}) => {
  const searchParams = new URLSearchParams();
  if (params?.from) searchParams.append("from", params.from);
  if (params?.to) searchParams.append("to", params.to);
  if (params?.status) searchParams.append("status", params.status);

  const queryString = searchParams.toString();
  const url = queryString ? `/driver/vacations?${queryString}` : "/driver/vacations";

  const response = await axios.get(url);
  return response.data;
};