import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FamiliesService } from './families.service';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { ClanId } from '../common/decorators/clan-id.decorator';


@Controller('families')
export class FamiliesController {
  constructor(private readonly familiesService: FamiliesService) {}

  @Post()
  
  create(@Body() createFamilyDto: CreateFamilyDto) {
    return this.familiesService.create(createFamilyDto);
  }

  @Get()
  findAll(@ClanId() clanId: string) {
    return this.familiesService.findAll(clanId);
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
