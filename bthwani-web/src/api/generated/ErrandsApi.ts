import axios from 'axios';

export class ErrandsApi {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || import.meta.env.VITE_API_URL || "http://localhost:3000";
  }

  async errands_controller_create_errand_order(data?: any): Promise<any> {
    const url = `/errands/order`;
    const config = {};

    return axios.post(url, data, config);
  }

  async errands_controller_get_user_errands(id: string, params?: { status?: any }): Promise<any> {
    const url = `/errands/user/${id}`;
    const config = { params };

    return axios.get(url, config);
  }

  async errands_controller_get_errand_categories(): Promise<any> {
    const url = `/errands/categories`;
    const config = {};

    return axios.get(url, config);
  }

  async errands_controller_get_available_drivers(params?: { lat?: any, lng?: any }): Promise<any> {
    const url = `/errands/drivers/available`;
    const config = { params };

    return axios.get(url, config);
  }

  async errands_controller_get_errand(id: string): Promise<any> {
    const url = `/errands/${id}`;
    const config = {};

    return axios.get(url, config);
  }
}