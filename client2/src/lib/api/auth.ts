import { BaseApi } from './base';

export class AuthApi extends BaseApi {
  async logout(): Promise<void> {
    try {
      await this.axios.post('/auth/logout');
    } catch (error) {
      console.error('Logout request failed:', error);
      throw error;
    }
  }
}

