import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ClanMembersService } from './clan-members.service';
import { CreateClanMemberDto } from './dto/create-clan-member.dto';
import { UpdateClanMemberDto } from './dto/update-clan-member.dto';
import { isAdmin } from '../common/utils/authorization.util';
import { User } from '../common/decorators/user.decorator';
import { normalizePagePagination, buildPagedResponse } from '../common/utils/pagination.util';
import { ClansService } from '../clans/clans.service';

@Controller('clan-members')
export class ClanMembersController {
  constructor(
    private readonly clanMembersService: ClanMembersService,
    private readonly clansService: ClansService,

  ) { }

  @Post()
  create(@Body() createClanMemberDto: CreateClanMemberDto) {
    return this.clanMembersService.create(createClanMemberDto);
  }

  @Get()
  async findAll(
    @User() user: any,
    @Query('limit') limit?: string,
    @Query('page') page?: string,
  ) {
    const pagination = normalizePagePagination(page, limit);
    let data: any[];
    if (!isAdmin(user)) {
      data = await this.clanMembersService.findAllByUserId(user.id, pagination.limit, pagination.offset);
      return buildPagedResponse(data, pagination.page, pagination.limit);
    }
    data = await this.clansService.findAll(pagination.limit, pagination.offset);
    data = data.map(item => (
      {
        user_id: user.id,
        role: user.role,
        clan_id: item.clan_id,
        clan: item,
      }
    ))
    return buildPagedResponse(data, pagination.page, pagination.limit);
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
