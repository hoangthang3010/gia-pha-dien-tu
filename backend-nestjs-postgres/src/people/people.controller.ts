import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { PeopleService } from './people.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { ClanId } from '../common/decorators/clan-id.decorator';
import { LoadClanIdsGuard } from '../common/guards/load-clan-ids.guard';
import { normalizeOffsetPagination } from '../common/utils/pagination.util';


@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Post()
  
  create(@Body() createPersonDto: CreatePersonDto, @Request() req) {
    return this.peopleService.create(createPersonDto, req.user.id);
  }

  @Get()
  @UseGuards(LoadClanIdsGuard)
  findAll(
    @ClanId() clanId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const pagination = normalizeOffsetPagination(limit, offset);
    return this.peopleService.findAll(clanId, pagination.limit, pagination.offset);
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
