import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { normalizePagePagination, buildPagedResponse } from '../common/utils/pagination.util';


@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  
  create(@Body() createMediaDto: CreateMediaDto, @Request() req) {
    return this.mediaService.create(createMediaDto, req.user.id);
  }

  @Get()
  async findAll(
    @Query('state') state?: string,
    @Query('limit') limit?: string,
    @Query('page') page?: string,
  ) {
    const pagination = normalizePagePagination(page, limit);
    const items = await this.mediaService.findAll(state, pagination.limit, pagination.offset);
    return buildPagedResponse(items, pagination.page, pagination.limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mediaService.findOne(id);
  }

  @Patch(':id')
  
  update(@Param('id') id: string, @Body() updateMediaDto: UpdateMediaDto) {
    return this.mediaService.update(id, updateMediaDto);
  }

  @Delete(':id')
  
  remove(@Param('id') id: string) {
    return this.mediaService.remove(id);
  }
}
