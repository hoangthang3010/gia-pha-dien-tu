import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMediaDto {
  @IsNotEmpty()
  @IsString()
  file_name: string;

  @IsOptional()
  @IsString()
  mime_type?: string;

  @IsOptional()
  @IsNumber()
  file_size?: number;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
