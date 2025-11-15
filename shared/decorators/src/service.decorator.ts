import { SetMetadata } from '@nestjs/common';

export const IS_SERVICE_KEY = 'isService';
export const Service = () => SetMetadata(IS_SERVICE_KEY, true);

