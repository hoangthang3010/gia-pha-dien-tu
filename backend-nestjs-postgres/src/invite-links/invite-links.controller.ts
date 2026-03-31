import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InviteLinksService } from './invite-links.service';

@Controller('invite-links')
export class InviteLinksController {
  constructor(private readonly inviteLinksService: InviteLinksService) {}

  @Post()
  create(@Body() payload: any) {
    return this.inviteLinksService.create(payload);
  }

  @Get()
  findAll() {
    return this.inviteLinksService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inviteLinksService.remove(id);
  }
}
