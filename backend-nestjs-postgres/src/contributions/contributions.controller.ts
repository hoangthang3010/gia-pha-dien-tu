import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ContributionsService } from './contributions.service';
import { normalizeOffsetPagination } from '../common/utils/pagination.util';

@Controller('contributions')
export class ContributionsController {
  constructor(private readonly contributionsService: ContributionsService) {}

  @Post()
  create(@Body() createContributionDto: any, @Request() req) {
    return this.contributionsService.create(createContributionDto, req.user.id);
  }

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const pagination = normalizeOffsetPagination(limit, offset);
    return this.contributionsService.findAll(status, pagination.limit, pagination.offset);
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
