import axiosInstance from "../utils/axios";

export interface WalletTransaction {
  _id?: string;
  userId: string;
  userModel: "User" | "Driver";
  amount: number;
  type: "credit" | "debit";
  method: "agent" | "card" | "transfer" | "payment" | "escrow" | "reward" | "kuraimi" | "withdrawal";
  status: "pending" | "completed" | "failed" | "reversed";
  description?: string;
  bankRef?: string;
  meta?: any;
  createdAt?: string;
}

export interface Wallet {
  balance: number;
  onHold: number;
  available: number;
  loyaltyPoints: number;
  transactions: WalletTransaction[];
}

export interface WalletUser {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  wallet: Wallet;
}

export interface Coupon {
  _id?: string;
  code: string;
  type: "percentage" | "fixed" | "free_shipping";
  value: number;
  expiryDate: string;
  isUsed: boolean;
  assignedTo?: string;
  usageLimit?: number;
  usedCount: number;
  createdAt?: string;
}

export interface Subscription {
  _id?: string;
  user: string;
  plan: string;
  amount: number;
  status: "active" | "cancelled" | "expired";
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  createdAt?: string;
}

// Get all wallet transactions
export async function getWalletTransactions(params?: {
  userId?: string;
  type?: string;
  status?: string;
  method?: string;
  cursor?: string;
  limit?: number;
}): Promise<{
  data: WalletTransaction[];
  hasMore: boolean;
  nextCursor?: string;
}> {
  // Note: Backend uses /v2/wallet/transactions (not /admin/wallet/transactions)
  // Admin access is controlled by JWT + Roles decorator
  const { data } = await axiosInstance.get<{
    data: WalletTransaction[];
    hasMore: boolean;
    nextCursor?: string;
  }>("/v2/wallet/transactions", {
    params: {
      cursor: params?.cursor,
      limit: params?.limit || 20,
    },
    headers: { "x-silent-401": "1" }
  });
  return data;
}

// Get wallet balance for user (Admin uses same endpoint with JWT auth)
export async function getUserWallet(userId: string): Promise<Wallet> {
  // Note: This requires the admin to impersonate or have special access
  // Current backend doesn't support getting other user's wallet directly
  // May need to add admin-specific endpoint in backend
  const { data } = await axiosInstance.get<Wallet>(`/v2/wallet/balance`, {
    headers: { "x-silent-401": "1" },
    params: { userId } // If backend supports it
  });
  return data;
}

// ⚠️ Note: These endpoints don't exist in backend yet
// May need to be added in backend/src/modules/wallet/wallet.controller.ts

// Get all users with wallets
export async function getWalletUsers(): Promise<WalletUser[]> {
  // TODO: Add this endpoint in backend
  // For now, return empty array
  console.warn("getWalletUsers: endpoint not implemented in backend");
  return [];
}

// Create transaction (Admin only - exists in backend)
export async function createTransaction(data: {
  userId: string;
  amount: number;
  type: "credit" | "debit";
  method: string;
  description?: string;
}): Promise<WalletTransaction> {
  const { data: response } = await axiosInstance.post<WalletTransaction>(
    "/v2/wallet/transaction",
    data
  );
  return response;
}

// Hold funds (Admin only - exists in backend)
export async function holdFunds(data: {
  userId: string;
  amount: number;
  orderId?: string;
}): Promise<{ success: boolean; message: string }> {
  const { data: response } = await axiosInstance.post(
    "/v2/wallet/hold",
    data
  );
  return response;
}

// Release funds (Admin only - exists in backend)
export async function releaseFunds(data: {
  userId: string;
  amount: number;
  orderId?: string;
}): Promise<{ success: boolean; message: string }> {
  const { data: response } = await axiosInstance.post(
    "/v2/wallet/release",
    data
  );
  return response;
}

// Refund funds (Admin only - exists in backend)
export async function refundFunds(data: {
  userId: string;
  amount: number;
  orderId?: string;
  reason?: string;
}): Promise<{ success: boolean; message: string }> {
  const { data: response } = await axiosInstance.post(
    "/v2/wallet/refund",
    data
  );
  return response;
}

// Get wallet statistics
export async function getWalletStats(): Promise<{
  totalUsers: number;
  totalBalance: number;
  totalOnHold: number;
  totalTransactions: number;
  transactionsToday: number;
  averageBalance: number;
}> {
  // TODO: Add this endpoint in backend
  console.warn("getWalletStats: endpoint not implemented in backend");
  return {
    totalUsers: 0,
    totalBalance: 0,
    totalOnHold: 0,
    totalTransactions: 0,
    transactionsToday: 0,
    averageBalance: 0,
  };
}
