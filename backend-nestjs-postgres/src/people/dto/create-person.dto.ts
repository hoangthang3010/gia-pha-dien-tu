import { IsBoolean, IsNumber, IsOptional, IsString, IsArray, IsUUID, IsNotEmpty } from 'class-validator';

export class CreatePersonDto {
  @IsNotEmpty() @IsString() handle: string;
  @IsOptional() @IsString() gramps_id?: string;
  @IsOptional() @IsNumber() gender?: number;
  @IsNotEmpty() @IsString() display_name: string;
  @IsOptional() @IsString() surname?: string;
  @IsOptional() @IsString() first_name?: string;
  @IsOptional() @IsNumber() generation?: number;
  @IsOptional() @IsNumber() chi?: number;
  @IsOptional() @IsNumber() birth_year?: number;
  @IsOptional() @IsString() birth_date?: string;
  @IsOptional() @IsString() birth_place?: string;
  @IsOptional() @IsNumber() death_year?: number;
  @IsOptional() @IsString() death_date?: string;
  @IsOptional() @IsString() death_place?: string;
  @IsOptional() @IsBoolean() is_living?: boolean;
  @IsOptional() @IsBoolean() is_privacy_filtered?: boolean;
  @IsOptional() @IsBoolean() is_patrilineal?: boolean;
  @IsOptional() @IsArray() @IsString({ each: true }) families?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) parent_families?: string[];
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() zalo?: string;
  @IsOptional() @IsString() facebook?: string;
  @IsOptional() @IsString() current_address?: string;
  @IsOptional() @IsString() hometown?: string;
  @IsOptional() @IsString() occupation?: string;
  @IsOptional() @IsString() company?: string;
  @IsOptional() @IsString() education?: string;
  @IsOptional() @IsString() nick_name?: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsUUID() clan_id?: string;
}
