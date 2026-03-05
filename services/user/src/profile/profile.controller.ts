import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { Service } from '@rapid-guide-io/decorators';
import { InternalServiceGuard } from '@rapid-guide-io/guards';
import { UserService } from './profile.service';
import { GetProfilesMeResponseDto } from '@rapid-guide-io/contracts';

@Controller('profile')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  async me(@Request() req: Request): Promise<GetProfilesMeResponseDto> {
    const user = (req as any).user;
    if (!user || !user.id) {
      throw new Error('User information is missing from request');
    }
    const userProfiles = await this.userService.getProfilesByUserId(user.id);
    return userProfiles;
  }

  @Get('/:userId')
  @Service()
  @UseGuards(InternalServiceGuard)
  async getProfile(
    @Param('userId') userId: string,
  ): Promise<GetProfilesMeResponseDto> {
    const userProfiles = await this.userService.getProfilesByUserId(userId);
    return userProfiles;
  }
}
