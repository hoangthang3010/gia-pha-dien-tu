import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { InviteLinksService } from './invite-links.service';
import { normalizeOffsetPagination } from '../common/utils/pagination.util';

@Controller('invite-links')
export class InviteLinksController {
  constructor(private readonly inviteLinksService: InviteLinksService) {}

  @Post()
  create(@Body() payload: any) {
    return this.inviteLinksService.create(payload);
  }

  @Get()
  findAll(@Query('limit') limit?: string, @Query('offset') offset?: string) {
    const pagination = normalizeOffsetPagination(limit, offset);
    return this.inviteLinksService.findAll(pagination.limit, pagination.offset);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inviteLinksService.remove(id);
  }
}
