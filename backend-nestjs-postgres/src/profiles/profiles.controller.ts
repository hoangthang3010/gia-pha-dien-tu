import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ForbiddenException, UseGuards } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ClanId } from '../common/decorators/clan-id.decorator';
import { User } from '../common/decorators/user.decorator';
import { LoadClanIdsGuard } from '../common/guards/load-clan-ids.guard';
import { isAdmin } from '../common/utils/authorization.util';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) { }

  @Post()
  create(@Body() payload: any) {
    return this.profilesService.create(payload);
  }

  @Get()
  @UseGuards(LoadClanIdsGuard)
  findAll(@User() user: any, @Query('status') status?: string, @ClanId() clanId?: string) {
    const { clanIds } = user;

    if (!isAdmin(user)) {
      if (clanId && !clanIds.includes(clanId)) {
        throw new ForbiddenException('Not allowed to access this clan');
      }

      return this.profilesService.findProfilesInSameClan(
        clanId ?? clanIds[0],
        status,
      );
    }

    return this.profilesService.findAll(status, clanId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profilesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: any) {
    return this.profilesService.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profilesService.remove(id);
  }
}
