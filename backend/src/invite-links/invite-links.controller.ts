import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { InviteLinksService } from './invite-links.service';
import { normalizePagePagination, buildPagedResponse } from '../common/utils/pagination.util';

@Controller('invite-links')
export class InviteLinksController {
  constructor(private readonly inviteLinksService: InviteLinksService) {}

  @Post()
  create(@Body() payload: any) {
    return this.inviteLinksService.create(payload);
  }

  @Get()
  async findAll(@Query('limit') limit?: string, @Query('page') page?: string) {
    const pagination = normalizePagePagination(page, limit);
    const items = await this.inviteLinksService.findAll(pagination.limit, pagination.offset);
    return buildPagedResponse(items, pagination.page, pagination.limit);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inviteLinksService.remove(id);
  }
}
