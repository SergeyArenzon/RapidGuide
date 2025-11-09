import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor() {}
}
