import { BaseApi } from './base';
import { UserApi } from './user';
import { TourApi } from './tour';
import { AuthApi } from './auth';
import { BookingApi } from './booking';
import { useJwtTokenStore } from '@/store/useJwtToken';

// Main Api class that composes all API modules
export default class Api extends BaseApi {
  public user: UserApi;
  public tour: TourApi;
  public auth: AuthApi;
  public booking: BookingApi;

  constructor(accessToken?: string | null) {
    // Choose between provided token and zustand state
    const token = accessToken ?? useJwtTokenStore.getState().getToken() ?? '';
    super(token);
    // Share the same axios instance across all modules
    this.user = new UserApi(token, this.axios);
    this.tour = new TourApi(token, this.axios);
    this.auth = new AuthApi(token, this.axios);
    this.booking = new BookingApi(token, this.axios);
  }
}

