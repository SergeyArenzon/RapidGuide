import { BaseApi } from './base';
import { ProfileApi } from './profile';
import { TourApi } from './tour';
import { AuthApi } from './auth';

// Main Api class that composes all API modules
export default class Api extends BaseApi {
  public profile: ProfileApi;
  public tour: TourApi;
  public auth: AuthApi;

  constructor(accessToken: string) {
    super(accessToken);
    // Share the same axios instance across all modules
    this.profile = new ProfileApi(accessToken, this.axios);
    this.tour = new TourApi(accessToken, this.axios);
    this.auth = new AuthApi(accessToken, this.axios);
  }
}

