import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { FamiliesService } from './families.service';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { ClanId } from '../common/decorators/clan-id.decorator';
import { LoadClanIdsGuard } from '../common/guards/load-clan-ids.guard';
import { normalizePagePagination, buildPagedResponse } from '../common/utils/pagination.util';



@Controller('families')
export class FamiliesController {
  constructor(private readonly familiesService: FamiliesService) {}

  @Post()
  
  create(@Body() createFamilyDto: CreateFamilyDto) {
    return this.familiesService.create(createFamilyDto);
  }

  @Get()
  @UseGuards(LoadClanIdsGuard)
  async findAll(
    @ClanId() clanId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pagination = normalizePagePagination(page, limit);
    const items = await this.familiesService.findAll(clanId, pagination.limit, pagination.offset);
    return buildPagedResponse(items, pagination.page, pagination.limit);
  }

  @Post('move-child')
  
  moveChild(@Body() body: { childHandle: string; fromFamilyHandle: string; toFamilyHandle: string }) {
    return this.familiesService.moveChild(body.childHandle, body.fromFamilyHandle, body.toFamilyHandle);
  }

  @Post('remove-child')
  
  removeChild(@Body() body: { childHandle: string; familyHandle: string }) {
    return this.familiesService.removeChild(body.childHandle, body.familyHandle);
  }

  @Get(':handle')
  findOne(@Param('handle') handle: string) {
    return this.familiesService.findOne(handle);
  }

  @Patch(':handle')
  
  update(@Param('handle') handle: string, @Body() updateFamilyDto: UpdateFamilyDto) {
    return this.familiesService.update(handle, updateFamilyDto);
  }

  @Delete(':handle')
  
  remove(@Param('handle') handle: string) {
    return this.familiesService.remove(handle);
  }
}
