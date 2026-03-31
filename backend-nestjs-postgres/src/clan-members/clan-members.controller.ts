import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ClanMembersService } from './clan-members.service';
import { CreateClanMemberDto } from './dto/create-clan-member.dto';
import { UpdateClanMemberDto } from './dto/update-clan-member.dto';

@Controller('clan-members')
export class ClanMembersController {
  constructor(private readonly clanMembersService: ClanMembersService) { }

  @Post()
  create(@Body() createClanMemberDto: CreateClanMemberDto) {
    return this.clanMembersService.create(createClanMemberDto);
  }

  @Get()
  findAll(@Req() req) {
    const isAdmin = req.user.role === 'admin';
    if (!isAdmin) {
      return this.clanMembersService.findAllByUserId(req.user.id);
    }
    return this.clanMembersService.findAll();
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
