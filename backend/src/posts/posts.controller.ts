import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ClanId } from '../common/decorators/clan-id.decorator';
import { LoadClanIdsGuard } from '../common/guards/load-clan-ids.guard';
import { normalizePagePagination, buildPagedResponse } from '../common/utils/pagination.util';


@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  
  create(@Body() createPostDto: CreatePostDto, @Request() req) {
    return this.postsService.create(createPostDto, req.user.id);
  }

  @Get()
  @UseGuards(LoadClanIdsGuard)
  async findAll(
    @ClanId() clanId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pagination = normalizePagePagination(page, limit);
    const items = await this.postsService.findAll(clanId, pagination.limit, pagination.offset);
    return buildPagedResponse(items, pagination.page, pagination.limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
