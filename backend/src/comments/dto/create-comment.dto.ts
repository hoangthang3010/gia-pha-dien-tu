import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsUUID()
  post_id: string;

  @IsNotEmpty()
  @IsString()
  body: string;

  @IsOptional()
  @IsUUID()
  clan_id?: string;
}
