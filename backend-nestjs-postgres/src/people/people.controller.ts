import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { PeopleService } from './people.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { ClanId } from '../common/decorators/clan-id.decorator';
import { LoadClanIdsGuard } from '../common/guards/load-clan-ids.guard';
import { normalizePagePagination, buildPagedResponse } from '../common/utils/pagination.util';


@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Post()
  
  create(@Body() createPersonDto: CreatePersonDto, @Request() req) {
    return this.peopleService.create(createPersonDto, req.user.id);
  }

  @Get()
  @UseGuards(LoadClanIdsGuard)
  async findAll(
    @ClanId() clanId: string,
    @Query('limit') limit?: string,
    @Query('page') page?: string,
  ) {
    const pagination = normalizePagePagination(page, limit);
    const items = await this.peopleService.findAll(clanId, pagination.limit, pagination.offset);
    return buildPagedResponse(items, pagination.page, pagination.limit);
  }

  @Get(':handle')
  findOne(@Param('handle') handle: string) {
    return this.peopleService.findOne(handle);
  }

  @Patch(':handle')
  
  update(@Param('handle') handle: string, @Body() updatePersonDto: UpdatePersonDto) {
    return this.peopleService.update(handle, updatePersonDto);
  }

  @Delete(':handle')
  
  remove(@Param('handle') handle: string) {
    return this.peopleService.remove(handle);
  }
}
