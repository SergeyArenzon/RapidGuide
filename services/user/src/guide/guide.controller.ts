import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { GuideService } from './guide.service';
import { CreateGuideDto, ResponseGuideDto } from './dto/guide.dto';
import { AuthGuard } from '../guards/auth.guard';

@Controller('guide')
// @UseGuards(AuthGuard)
export class GuideController {
  constructor(private guideService: GuideService) {}

  @HttpCode(201)
  @Post('/')
  async create(
    @Request() req,
    @Body() body: CreateGuideDto,
  ): Promise<ResponseGuideDto> {
    return this.guideService.create({
      ...body,
      user_id: "req.user.id",
    });
  }
}
