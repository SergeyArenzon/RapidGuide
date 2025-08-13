import {
  Controller,
  Post,
  Body,
  HttpCode,
  Logger,
  Get,
  Param,
  ForbiddenException,
} from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { CreateUserDto, UserDto } from '@rapid-guide-io/dto';
import { UserService } from './user.service';
// import { EventPattern, Payload } from '@nestjs/microservices';
import { Public } from 'src/decorators/public.decorator';
import { GuideService } from 'src/guide/guide.service';

@Controller()
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private usersService: UserService,
    private guideService: GuideService,
  ) {}

  @Public()
  @Post('/user')
  @HttpCode(200)
  async createOrFind(@Body() body: CreateUserDto): Promise<UserDto> {
    return await this.usersService.createOrFind(body);
  }

  @Get(':userId/guide')
  async getUserGuide(@Param('userId') userId: string, @User() user: UserDto) {
    if (userId !== user.id) {
      throw new ForbiddenException(
        'You can only access your own guide information',
      );
    }
    return this.guideService.findByUserId(userId);
  }

  // findUser() {
  //   return { first_name: 'John', last_name: 'Doe' };
  // }

  // @Get('/:id')
  // getUserById(@Param('id') id: string) {
  //   const user = this.usersService.findOne(id);
  //   return user;
  // }

  // @Post()
  // @UsePipes(ValidationPipe)
  // @HttpCode(201)
  // createUser(@Body() body: CreateUserDto) {
  //   this.usersService.create(body);
  // }

  // // EVENTS
  // @EventPattern('user_create')
  // @UsePipes(ValidationPipe)
  // async createUserEvent(@Payload() user: CreateUserDto) {
  //   this.usersService.create(user);
  // }
}
