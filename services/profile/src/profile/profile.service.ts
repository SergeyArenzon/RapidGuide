import { Injectable } from '@nestjs/common';
import { GuideService } from '../guide/guide.service';
import { GetProfilesResponseDto } from '@rapid-guide-io/contracts';

@Injectable()
export class ProfileService {
  constructor(
    private readonly guideService: GuideService,
    // private readonly travellerService: TravellerService,
  ) {}

  async getProfile(userId: string) {
    return { userId };
  }

  async getProfilesByUserId(userId: string): Promise<GetProfilesResponseDto> {
    const guide = await this.guideService.findByUserId(userId);

    return {
      guide,
      // traveller,
    };
  }
}
