import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';


@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  
  create(@Body() createEventDto: CreateEventDto, @Request() req) {
    return this.eventsService.create(createEventDto, req.user.id);
  }

  @Get()
  findAll(@Query('clanId') clanId?: string) {
    return this.eventsService.findAll(clanId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }

  @Post(':id/rsvp')
  
  rsvp(@Param('id') id: string, @Body() body: { status: string, clanId?: string }, @Request() req) {
    return this.eventsService.rsvp(id, req.user.id, body.status, body.clanId);
  }
}
