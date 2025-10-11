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
  page?: number;
  pageSize?: number;
}): Promise<{
  transactions: WalletTransaction[];
  total: number;
  page: number;
  pageSize: number;
}> {
  const mapped = {
    page: params?.page,
    per_page: params?.pageSize,
    // filters إضافية عند الحاجة
  };
  const { data } = await axiosInstance.get<{
    transactions: WalletTransaction[];
    total: number;
    page: number;
    pageSize: number;
  }>("/admin/wallet/transactions", {
    params: mapped,
    headers: { "x-silent-401": "1" }
  });
  return data;
}

// Get wallet balance for user
export async function getUserWallet(userId: string): Promise<Wallet> {
  const { data } = await axiosInstance.get<Wallet>(`/admin/wallet/${userId}`, {
    headers: { "x-silent-401": "1" }
  });
  return data;
}

// Get all users with wallets
export async function getWalletUsers(): Promise<WalletUser[]> {
  const { data } = await axiosInstance.get<WalletUser[]>("/admin/wallet/users/search", {
    headers: { "x-silent-401": "1" }
  });
  return data;
}

// Update wallet balance
export async function updateWalletBalance(userId: string, amount: number, type: "credit" | "debit", description?: string): Promise<Wallet> {
  const { data } = await axiosInstance.patch<Wallet>(`/admin/wallet/${userId}/balance`, {
    amount,
    type,
    description
  });
  return data;
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
  const { data } = await axiosInstance.get<{
    totalUsers: number;
    totalBalance: number;
    totalOnHold: number;
    totalTransactions: number;
    transactionsToday: number;
    averageBalance: number;
  }>("/admin/wallet/stats", {
    headers: { "x-silent-401": "1" }
  });
  return data;
}
