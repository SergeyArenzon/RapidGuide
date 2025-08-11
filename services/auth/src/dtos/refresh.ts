import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class RefreshTokenDto {
  @IsUUID()
  @IsNotEmpty()
  refreshToken: string;
}
