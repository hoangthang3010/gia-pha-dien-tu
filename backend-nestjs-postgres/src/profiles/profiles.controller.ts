import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ForbiddenException, UseGuards } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ClanId } from '../common/decorators/clan-id.decorator';
import { User } from '../common/decorators/user.decorator';
import { LoadClanIdsGuard } from '../common/guards/load-clan-ids.guard';
import { isAdmin } from '../common/utils/authorization.util';
import { normalizePagePagination, buildPagedResponse } from '../common/utils/pagination.util';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) { }

  @Post()
  create(@Body() payload: any) {
    return this.profilesService.create(payload);
  }

  @Get()
  @UseGuards(LoadClanIdsGuard)
  async findAll(
    @User() user: any,
    @Query('status') status?: string,
    @ClanId() clanId?: string,
    @Query('limit') limit?: string,
    @Query('page') page?: string,
  ) {
    const { clanIds } = user;
    const pagination = normalizePagePagination(page, limit);

    if (!isAdmin(user)) {
      if (clanId && !clanIds.includes(clanId)) {
        throw new ForbiddenException('Not allowed to access this clan');
      }

      const items = await this.profilesService.findProfilesInSameClan(
        clanId ?? clanIds[0],
        status,
        pagination.limit,
        pagination.offset,
      );
      return buildPagedResponse(items, pagination.page, pagination.limit);
    }

    const items = await this.profilesService.findAll(status, clanId, pagination.limit, pagination.offset);
    return buildPagedResponse(items, pagination.page, pagination.limit);
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
