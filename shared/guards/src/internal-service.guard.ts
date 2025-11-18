import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class InternalServiceGuard implements CanActivate {
  private readonly token: string;

  constructor() {
    this.token = process.env.INTERNAL_SERVICE_TOKEN;
    
    
    if (!this.token) {
      console.warn(
        'INTERNAL_SERVICE_TOKEN environment variable is not set. Service-to-service authentication will fail.',
      );
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const serviceTokenHeader = req.headers['x-service-token'];

    if (!serviceTokenHeader) {
      throw new UnauthorizedException(
        'Missing service token. Use X-Service-Token header',
      );
    }

    if (serviceTokenHeader !== this.token) {
      throw new UnauthorizedException('Invalid service token');
    }

    return true;
  }
}

