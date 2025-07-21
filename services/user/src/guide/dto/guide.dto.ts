import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsDate,
  IsArray,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OmitType } from '@nestjs/mapped-types';
import { UserDto } from 'src/dtos';

export class GuideDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  bio: string;

  @IsUUID()
  @IsOptional()
  user_id?: string;

  @IsUUID()
  @IsNotEmpty()
  country_code: string;

  @IsUUID()
  @IsNotEmpty()
  city_id: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  language_ids: string[];

  @IsArray()
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  subcategory_ids: string[];

  @Type(() => UserDto)
  user: UserDto;

  @IsDate()
  @Type(() => Date)
  created_at: Date;

  @IsDate()
  @Type(() => Date)
  updated_at: Date;
}

export class CreateGuideDto extends OmitType(GuideDto, [
  'id',
  'created_at',
  'updated_at',
  'user',
] as const) {}

export class UpdateGuideDto extends OmitType(GuideDto, [
  'created_at',
  'updated_at',
] as const) {}

export class ResponseGuideDto extends GuideDto {}
