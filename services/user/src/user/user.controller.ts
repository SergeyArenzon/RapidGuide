import {
  Controller,
  Post,
  Body,
  HttpCode,
  Logger,
  Get,
  Param,
  ForbiddenException,
  Headers,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CreateUserDto, UserDto } from '@rapid-guide-io/dto';
import { UserService } from './user.service';
// import { EventPattern, Payload } from '@nestjs/microservices';
import { GuideService } from 'src/guide/guide.service';
import { Scopes, Subject, AllowedRoles, Roles } from '@rapid-guide-io/decorators';
import { ScopesGuard, RolesGuard } from '@rapid-guide-io/guards';
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private usersService: UserService,
    private guideService: GuideService,
  ) {}

  @Post()
  @UseGuards(RolesGuard, ScopesGuard)
  @Roles('admin')
  @Scopes(['user:read', 'user:write'])
  async createOrFind(
    @Body() body: CreateUserDto,
    @AllowedRoles() roles: string[],
    @Subject() subject: string,
  ): Promise<UserDto> {
    return await this.usersService.createOrFind(body);
  }

  @Get('/:id')
  @UseGuards(ScopesGuard, RolesGuard)
  @Roles('admin')
  @Scopes(['user:read'])
  getUserById(@Param('id') id: string) {
    const user = this.usersService.findOne(id);
    return user;
  }
}
