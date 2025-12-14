import { Injectable } from '@nestjs/common';
import { GuideService } from '../guide/guide.service';
import { GetProfilesMeResponseDto } from '@rapid-guide-io/contracts';
import { TravellerService } from 'src/traveller/traveller.service';

@Injectable()
export class ProfileService {
  constructor(
    private readonly guideService: GuideService,
    private readonly travellerService: TravellerService,
  ) {}

  async getProfile(userId: string) {
    return { userId };
  }

  async getProfilesByUserId(userId: string): Promise<GetProfilesMeResponseDto> {
    const guide = await this.guideService.findByUserId(userId);
    const traveller = await this.travellerService.findByUserId(userId);
    return {
      guide,
      traveller,
    };
  }
}
