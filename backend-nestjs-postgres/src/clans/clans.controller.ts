import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ForbiddenException, Res } from '@nestjs/common';
import { ClansService } from './clans.service';
import { CreateClanDto } from './dto/create-clan.dto';
import { UpdateClanDto } from './dto/update-clan.dto';
import { Response } from 'express';

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

  @Post(':id/select')
  selectClan(@Param('id') id: string, @Req() req, @Res() res: Response) {
    const isAdmin = req.user.role === 'admin';
    if (!isAdmin && !req.user.clanIds.includes(id)) {
      throw new ForbiddenException('You do not have access to this clan');
    }
    
    res.cookie('clanId', id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(200).json({ message: `Clan ${id} selected`, clanId: id });
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

