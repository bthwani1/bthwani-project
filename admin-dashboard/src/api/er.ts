import api from "../utils/axios";
import type { Account, JournalEntry, JournalQuery, PagedResult } from "../type/er";



// بحث مرن: يحاول تمريـر query/onlyLeaf/limit للخادم، ويستخدم فلترة احتياطية على العميل إن تجاهلها الخادم.
export async function listChartAccounts(query = "", onlyLeaf = true, limit = 50): Promise<Account[]> {
const { data } = await api.get(`/accounts/chart`, {
params: { query, limit, onlyLeaf: onlyLeaf ? 1 : 0 },
});


let rows: Account[] = Array.isArray(data) ? data : (data?.data ?? []);


// فلترة احتياطية على الطرف الأمامي
if (onlyLeaf) {
rows = rows.filter((a: Account) => a?.isLeaf === true || !a?.children || a?.children?.length === 0);
}
if (query) {
const q = String(query).toLowerCase();
rows = rows.filter((a: Account) =>
String(a?.code ?? "").toLowerCase().includes(q) ||
String(a?.name ?? "").toLowerCase().includes(q)
);
}


return rows.slice(0, limit);
}


// (اختياري) تميرات CRUD إذا رغبت بتجميعها هنا بدل ملفاتك الحالية
export const createAccount = (payload: Account) => api.post(`/accounts/chart`, payload).then(r => r.data);
export const updateAccount = (id: string, payload: Account) => api.patch(`/accounts/chart/${id}`, payload).then(r => r.data);
export const deleteAccount = (id: string) => api.delete(`/accounts/chart/${id}`).then(r => r.data);


// === Journal Entries ===
export async function listJournalEntries(q: JournalQuery): Promise<JournalEntry[]> {
const { data } = await api.get(`/entries`, { params: q });
return data;
}


export async function getNextVoucherNo(): Promise<{ voucherNo: string }> {
const { data } = await api.get(`/entries/next-no`);
return data;
}


export async function getJournalEntry(voucherNo: string): Promise<JournalEntry> {
const { data } = await api.get(`/entries/${voucherNo}`);
return data;
}


export async function createJournalEntry(payload: JournalEntry): Promise<JournalEntry> {
const { data } = await api.post(`/entries`, payload);
return data;
}


export async function updateJournalEntry(voucherNo: string, payload: Partial<JournalEntry>): Promise<JournalEntry> {
const { data } = await api.put(`/entries/${voucherNo}`, payload);
return data;
}


export async function postJournalEntry(voucherNo: string): Promise<{ ok: true }>{
const { data } = await api.post(`/entries/${voucherNo}/post`);
return data;
}


// === Ledger / Journal Book ===
export async function getJournalBook(params: { account?: string; from?: string; to?: string; page?: number; pageSize?: number }): Promise<PagedResult> {
const { data } = await api.get(`/journals`, { params });
return data;
}