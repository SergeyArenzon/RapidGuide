import { BaseApi } from './base';
import { ProfileApi } from './profile';
import { TourApi } from './tour';
import { UserApi } from './user';
import { AuthApi } from './auth';

// Re-export types and classes
export { BaseApi } from './base';
export { ProfileApi } from './profile';
export { TourApi } from './tour';
export { UserApi } from './user';
export { AuthApi } from './auth';

// Main Api class that composes all API modules
export default class Api extends BaseApi {
  public profile: ProfileApi;
  public tour: TourApi;
  public user: UserApi;
  public auth: AuthApi;

  constructor(accessToken: string) {
    super(accessToken);
    // Share the same axios instance across all modules
    this.profile = new ProfileApi(accessToken, this.axios);
    this.tour = new TourApi(accessToken, this.axios);
    this.user = new UserApi(accessToken, this.axios);
    this.auth = new AuthApi(accessToken, this.axios);
  }

  // Convenience methods for backward compatibility
  // Profile methods
  async getLanguages() {
    return this.profile.getLanguages();
  }

  async getCountries() {
    return this.profile.getCountries();
  }

  async getCities() {
    return this.profile.getCities();
  }

  async getMe() {
    return this.profile.getMe();
  }

  // Tour methods (commented out in original, keeping for future use)
  // async getSubCategories() {
  //   return this.tour.getSubCategories();
  // }

  // async getCategories() {
  //   return this.tour.getCategories();
  // }

  // User methods (commented out in original, keeping for future use)
  // async createGuide(guide: CreateGuideDto) {
  //   return this.user.createGuide(guide);
  // }

  // async getGuide(userId: UserDto["id"]) {
  //   return this.user.getGuide(userId);
  // }

  // Auth methods (commented out in original, keeping for future use)
  // async logout() {
  //   return this.auth.logout();
  // }
}

