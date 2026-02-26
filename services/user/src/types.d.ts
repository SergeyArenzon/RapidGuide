import { UserDto } from './dtos';

declare global {
  namespace Express {
    interface Request {
      user: UserDto;
    }
  }
}
