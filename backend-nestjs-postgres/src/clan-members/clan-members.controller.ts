import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ClanMembersService } from './clan-members.service';
import { CreateClanMemberDto } from './dto/create-clan-member.dto';
import { UpdateClanMemberDto } from './dto/update-clan-member.dto';
import { isAdmin } from '../common/utils/authorization.util';
import { User } from '../common/decorators/user.decorator';
import { normalizeOffsetPagination } from '../common/utils/pagination.util';

@Controller('clan-members')
export class ClanMembersController {
  constructor(private readonly clanMembersService: ClanMembersService) { }

  @Post()
  create(@Body() createClanMemberDto: CreateClanMemberDto) {
    return this.clanMembersService.create(createClanMemberDto);
  }

  @Get()
  findAll(
    @User() user: any,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const pagination = normalizeOffsetPagination(limit, offset);
    if (!isAdmin(user)) {
      return this.clanMembersService.findAllByUserId(user.id, pagination.limit, pagination.offset);
    }
    return this.clanMembersService.findAll(pagination.limit, pagination.offset);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clanMembersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClanMemberDto: UpdateClanMemberDto) {
    return this.clanMembersService.update(+id, updateClanMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clanMembersService.remove(+id);
  }
}
