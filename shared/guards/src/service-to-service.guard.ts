import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class ServiceToServiceGuard implements CanActivate {
  private readonly serviceToken: string;

  constructor() {
    this.serviceToken = process.env.SERVICE_TO_SERVICE_TOKEN;
    
    
    if (!this.serviceToken) {
      console.warn(
        'SERVICE_TO_SERVICE_TOKEN environment variable is not set. Service-to-service authentication will fail.',
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

    if (serviceTokenHeader !== this.serviceToken) {
      throw new UnauthorizedException('Invalid service token');
    }

    return true;
  }
}

