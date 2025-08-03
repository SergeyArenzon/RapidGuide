import { Controller, Post, Body, Req } from '@nestjs/common';
import { GuideService } from './guide.service';
import { CreateGuideDto, createGuideSchema } from './dto/create-guide.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { Request } from 'express';
import { GuideDto } from './dto/guide.dto';

@Controller('guide')
export class GuideController {
  constructor(private readonly guideService: GuideService) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(createGuideSchema)) body: CreateGuideDto,
    @Req() req: Request,
  ): Promise<GuideDto> {
    const user = req['user'];
    return await this.guideService.create(user.id, body);
  }
}
