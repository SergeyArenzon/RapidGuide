import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ScopePermission,
  Scopes,
  CurrentUser,
} from '@rapid-guide-io/decorators';
import { ScopesGuard } from '@rapid-guide-io/guards';
import { ZodValidationPipe } from '@rapid-guide-io/pipes';
import { TravellerService } from './traveller.service';
import {
  CreateTravellerDto,
  createTravellerSchema,
  TravellerDto,
} from '@rapid-guide-io/contracts';

@Controller('traveller')
export class TravellerController {
  constructor(private readonly travellerService: TravellerService) {}

  @Post()
  @UseGuards(ScopesGuard)
  @Scopes([ScopePermission.TRAVELLER_CREATE])
  async create(
    @CurrentUser() user,
    @Body(new ZodValidationPipe(createTravellerSchema))
    body: CreateTravellerDto,
  ): Promise<TravellerDto> {
    return await this.travellerService.create(user.id, body);
  }
}
