import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { normalizePagePagination, buildPagedResponse } from '../common/utils/pagination.util';


@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  
  create(@Body() createCommentDto: CreateCommentDto, @Request() req) {
    return this.commentsService.create(
      createCommentDto,
      req.user.id,
      req.user.display_name || null,
    );
  }

  @Get()
  async findAll(
    @Query('postId') postId?: string,
    @Query('personHandle') personHandle?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pagination = normalizePagePagination(page, limit);
    const items = await this.commentsService.findAll(
      postId,
      personHandle,
      pagination.limit,
      pagination.offset,
    );
    return buildPagedResponse(items, pagination.page, pagination.limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @Patch(':id')
  
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(id, updateCommentDto);
  }

  @Delete(':id')
  
  remove(@Param('id') id: string) {
    return this.commentsService.remove(id);
  }
}
