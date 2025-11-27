import { z } from 'zod';
import { 
  guideSchema
} from '@rapid-guide-io/contracts';
import type { 
  CreateGuideDto, 
  GuideDto, 
  UserDto
} from '@rapid-guide-io/contracts';
import { BaseApi } from './base';

export class UserApi extends BaseApi {
  async createGuide(guide: CreateGuideDto): Promise<GuideDto> {
    return this.validateResponse(
      () => this.axios.post('/user/guide', guide),
      guideSchema
    );
  }

  async getGuide(userId: UserDto["id"]): Promise<GuideDto> {
    return this.validateResponse(
      () => this.axios.get(`/user/user/${userId}/guide`),
      guideSchema
    );
  }
}

