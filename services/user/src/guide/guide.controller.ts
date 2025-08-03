import { Controller, Post, Body, Req, Get, Param } from '@nestjs/common';
import { GuideService } from './guide.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { Request } from 'express';
import {
  CreateGuideDto,
  createGuideSchema,
  GuideDto,
} from '@rapid-guide-io/shared';

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

  @Get(':id')
  async getGuide(@Param('id') id: string): Promise<GuideDto> {
    return await this.guideService.getGuide(id);
  }
}
