import { Injectable } from '@nestjs/common';
import { GuideService } from '../guide/guide.service';
import { GetProfilesMeResponseDto } from '@rapid-guide-io/contracts';
import { TravellerService } from '../traveller/traveller.service';

@Injectable()
export class UserService {
  constructor(
    private readonly guideService: GuideService,
    private readonly travellerService: TravellerService,
  ) {}

  async getProfilesByUserId(userId: string): Promise<GetProfilesMeResponseDto> {
    const guide = await this.guideService.findByUserId(userId);
    const traveller = await this.travellerService.findByUserId(userId);
    return {
      guide,
      traveller,
    };
  }
}
