import { BaseApi } from './base';

export class AuthApi extends BaseApi {
  static readonly baseUrl = '/auth';

  async logout(): Promise<void> {
    try {
      await this.axios.post(`${AuthApi.baseUrl}/logout`);
    } catch (error) {
      console.error('Logout request failed:', error);
      throw error;
    }
  }
}

