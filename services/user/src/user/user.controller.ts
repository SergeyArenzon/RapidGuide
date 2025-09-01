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
import { Scopes } from 'src/decorators/scope.decorator';
import { ScopesGuard } from 'src/guards/scope.guard';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { AllowedRoles } from 'src/decorators/allowed-roles.decorator';
import { Subject } from 'src/decorators/subject.decorator';

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
  @UseGuards(ScopesGuard)
  @Scopes(['read:user'])
  getUserById(@Param('id') id: string) {
    const user = this.usersService.findOne(id);
    return user;
  }
}
