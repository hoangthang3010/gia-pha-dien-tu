import { PartialType } from '@nestjs/mapped-types';
import { CreateClanMemberDto } from './create-clan-member.dto';

export class UpdateClanMemberDto extends PartialType(CreateClanMemberDto) {}
