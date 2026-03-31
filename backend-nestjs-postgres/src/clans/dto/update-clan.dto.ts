import { PartialType } from '@nestjs/mapped-types';
import { CreateClanDto } from './create-clan.dto';

export class UpdateClanDto extends PartialType(CreateClanDto) {}
