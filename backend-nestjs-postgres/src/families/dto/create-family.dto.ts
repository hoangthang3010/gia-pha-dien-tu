import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateFamilyDto {
  @IsString()
  handle: string;

  @IsOptional()
  @IsString()
  father_handle?: string;

  @IsOptional()
  @IsString()
  mother_handle?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  children?: string[];

  @IsOptional()
  @IsUUID()
  clan_id?: string;
}
