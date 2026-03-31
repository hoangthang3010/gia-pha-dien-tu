import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ContributionsService } from './contributions.service';

@Controller('contributions')
export class ContributionsController {
  constructor(private readonly contributionsService: ContributionsService) {}

  @Post()
  create(@Body() createContributionDto: any, @Request() req) {
    return this.contributionsService.create(createContributionDto, req.user.id);
  }

  @Get()
  findAll(@Query('status') status?: string) {
    return this.contributionsService.findAll(status);
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
