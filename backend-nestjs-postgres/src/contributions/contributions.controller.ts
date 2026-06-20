import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ContributionsService } from './contributions.service';
import { normalizePagePagination, buildPagedResponse } from '../common/utils/pagination.util';

@Controller('contributions')
export class ContributionsController {
  constructor(private readonly contributionsService: ContributionsService) {}

  @Post()
  create(@Body() createContributionDto: any, @Request() req) {
    return this.contributionsService.create(createContributionDto, req.user.id);
  }

  @Get()
  async findAll(
    @Query('status') status?: string,
    @Query('limit') limit?: string,
    @Query('page') page?: string,
  ) {
    const pagination = normalizePagePagination(page, limit);
    const items = await this.contributionsService.findAll(status, pagination.limit, pagination.offset);
    return buildPagedResponse(items, pagination.page, pagination.limit);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: any) {
    return this.contributionsService.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contributionsService.remove(id);
  }
}
