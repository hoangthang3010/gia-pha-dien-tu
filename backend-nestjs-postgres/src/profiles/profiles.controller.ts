import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, ForbiddenException } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ClanId } from '../common/decorators/clan-id.decorator';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) { }

  @Post()
  create(@Body() payload: any) {
    return this.profilesService.create(payload);
  }

  @Get()
  findAll(@Req() req, @Query('status') status?: string, @ClanId() clanId?: string) {
    const { role, clanIds, id } = req.user;

    if (role !== 'admin') {
      // user chỉ được xem clan của mình
      if (clanId && !clanIds.includes(clanId)) {
        throw new ForbiddenException('Not allowed to access this clan');
      }

      return this.profilesService.findProfilesInSameClan(
        clanId ?? clanIds[0],
        status,
      );
    }

    // admin
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
