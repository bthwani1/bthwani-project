import axios from 'axios';

export class AdminApi {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.REACT_APP_API_URL || "http://localhost:3000";
  }

  async admin_controller_getCurrentAdminUser(): Promise<any> {
    const url = `/admin/me`;
    const config = {};

    return axios.get(url, config);
  }

  async admin_controller_getAdminUsersList(params?: { page?: number, limit?: number, search?: string }): Promise<any> {
    const url = `/admin/users/list`;
    const config = { params };

    return axios.get(url, config);
  }

  async admin_controller_getModules(): Promise<any> {
    const url = `/admin/modules`;
    const config = {};

    return axios.get(url, config);
  }

  async admin_controller_getAdminsList(params?: { page?: number, limit?: number }): Promise<any> {
    const url = `/admin/list`;
    const config = { params };

    return axios.get(url, config);
  }

  async admin_controller_createAdmin(data?: any): Promise<any> {
    const url = `/admin/create`;
    const config = {};

    return axios.post(url, data, config);
  }

  async admin_controller_getDriversFinance(params?: { startDate?: string, endDate?: string, page?: number, limit?: number }): Promise<any> {
    const url = `/admin/drivers/finance`;
    const config = { params };

    return axios.get(url, config);
  }

  async admin_controller_runFinanceCalculations(data?: any): Promise<any> {
    const url = `/admin/drivers/finance/run`;
    const config = {};

    return axios.post(url, data, config);
  }

  async admin_controller_getAllDriversAttendance(params?: { date?: string, page?: number, limit?: number }): Promise<any> {
    const url = `/admin/drivers/attendance`;
    const config = { params };

    return axios.get(url, config);
  }

  async admin_controller_getVendorsList(params?: { status?: string, page?: number, limit?: number }): Promise<any> {
    const url = `/admin/vendors`;
    const config = { params };

    return axios.get(url, config);
  }

  async admin_controller_getAppearanceSettings(): Promise<any> {
    const url = `/admin/settings/appearance`;
    const config = {};

    return axios.get(url, config);
  }

  async admin_controller_updateAppearanceSettings(data?: any): Promise<any> {
    const url = `/admin/settings/appearance`;
    const config = {};

    return axios.put(url, data, config);
  }

  async admin_controller_getSupportStats(params?: { startDate?: string, endDate?: string }): Promise<any> {
    const url = `/admin/support/stats`;
    const config = { params };

    return axios.get(url, config);
  }

  async admin_controller_getAuditLogsStats(params?: { startDate?: string, endDate?: string }): Promise<any> {
    const url = `/admin/audit-logs/stats`;
    const config = { params };

    return axios.get(url, config);
  }

  async admin_controller_getMyAuditActions(params?: { limit?: number }): Promise<any> {
    const url = `/admin/audit-logs/my-actions`;
    const config = { params };

    return axios.get(url, config);
  }

  async admin_controller_getPendingActivations(params?: { type?: string, page?: number, limit?: number }): Promise<any> {
    const url = `/admin/pending-activations`;
    const config = { params };

    return axios.get(url, config);
  }

  async admin_controller_getDriversDocuments(params?: { status?: string, page?: number, limit?: number }): Promise<any> {
    const url = `/admin/drivers/docs`;
    const config = { params };

    return axios.get(url, config);
  }

  async admin_controller_getDriversPayouts(params?: { status?: string, page?: number, limit?: number }): Promise<any> {
    const url = `/admin/drivers/payouts`;
    const config = { params };

    return axios.get(url, config);
  }

  async admin_controller_getDriversShifts(params?: { status?: string, date?: string, page?: number, limit?: number }): Promise<any> {
    const url = `/admin/drivers/shifts`;
    const config = { params };

    return axios.get(url, config);
  }

  async admin_controller_getDriversVacationsStats(params?: { year?: number }): Promise<any> {
    const url = `/admin/drivers/vacations/stats`;
    const config = { params };

    return axios.get(url, config);
  }

  async admin_controller_getWalletCoupons(params?: { status?: string, page?: number, limit?: number }): Promise<any> {
    const url = `/admin/wallet/coupons`;
    const config = { params };

    return axios.get(url, config);
  }

  async admin_controller_getOpsDriversRealtime(params?: { area?: string, status?: string }): Promise<any> {
    const url = `/admin/ops/drivers/realtime`;
    const config = { params };

    return axios.get(url, config);
  }

  async admin_controller_getOpsHeatmap(params?: { hours?: number, resolution?: string }): Promise<any> {
    const url = `/admin/ops/heatmap`;
    const config = { params };

    return axios.get(url, config);
  }

  async admin_controller_createCommissionPlan(data?: any): Promise<any> {
    const url = `/admin/commission-plans`;
    const config = {};

    return axios.post(url, data, config);
  }
}
