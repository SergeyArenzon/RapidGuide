import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { Service } from '@rapid-guide-io/decorators';
import { InternalServiceGuard } from '@rapid-guide-io/guards';
import { ProfileService } from './profile.service';
import { GetProfilesResponseDto } from '@rapid-guide-io/contracts';

@Controller("profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('/me')
  async me(@Request() req: Request): Promise<GetProfilesResponseDto> {
    const user = (req as any).user;
    if (!user || !user.id) {
      throw new Error('User information is missing from request');
    }
    const userProfiles = await this.profileService.getProfilesByUserId(user.id);
    return userProfiles;
  }

  @Get('/:userId')
  @Service()
  @UseGuards(InternalServiceGuard)
  async root(@Param('userId') userId: string): Promise<GetProfilesResponseDto> {
    const userProfiles = await this.profileService.getProfilesByUserId(userId);
    return userProfiles;
  }
}

