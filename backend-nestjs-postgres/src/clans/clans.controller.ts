import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ForbiddenException } from '@nestjs/common';
import { ClansService } from './clans.service';
import { CreateClanDto } from './dto/create-clan.dto';
import { UpdateClanDto } from './dto/update-clan.dto';

@Controller('clans')
export class ClansController {
  constructor(private readonly clansService: ClansService) { }

  @Post()
  create(@Body() createClanDto: CreateClanDto) {
    return this.clansService.create(createClanDto);
  }

  @Get()
  findAll() {
    return this.clansService.findAll();
  }

  @Get(':id/stats')
  getStats(@Param('id') id: string, @Req() req) {
    const isAdmin = req.user.role === 'admin';
    if (!isAdmin && !req.user.clanIds.includes(id)) {
      throw new ForbiddenException();
    }
    return this.clansService.getStats(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clansService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClanDto: UpdateClanDto) {
    return this.clansService.update(id, updateClanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clansService.remove(id);
  }
}

