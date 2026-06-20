import { Controller, Get, Post, Body, Patch, Param, Delete, ForbiddenException, Res, UseGuards, Query } from '@nestjs/common';
import { ClansService } from './clans.service';
import { CreateClanDto } from './dto/create-clan.dto';
import { UpdateClanDto } from './dto/update-clan.dto';
import type { Response } from 'express';
import { hasClanAccess } from '../common/utils/authorization.util';
import { User } from '../common/decorators/user.decorator';
import { LoadClanIdsGuard } from '../common/guards/load-clan-ids.guard';
import { normalizeOffsetPagination } from '../common/utils/pagination.util';

@Controller('clans')
export class ClansController {
  constructor(private readonly clansService: ClansService) { }

  @Post()
  create(@Body() createClanDto: CreateClanDto) {
    return this.clansService.create(createClanDto);
  }

  @Get()
  findAll(@Query('limit') limit?: string, @Query('offset') offset?: string) {
    const pagination = normalizeOffsetPagination(limit, offset);
    return this.clansService.findAll(pagination.limit, pagination.offset);
  }

  @Post(':id/select')
  @UseGuards(LoadClanIdsGuard)
  selectClan(@Param('id') id: string, @User() user: any, @Res() res: Response) {
    if (!hasClanAccess(user, id)) {
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
  @UseGuards(LoadClanIdsGuard)
  getStats(@Param('id') id: string, @User() user: any) {
    if (!hasClanAccess(user, id)) {
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

