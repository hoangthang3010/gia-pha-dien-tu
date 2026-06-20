import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { Post } from '../posts/entities/post.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    private readonly notificationsService: NotificationsService,
  ) { }

  async create(
    createCommentDto: CreateCommentDto,
    authorId: string,
    authorName: string | null,
  ): Promise<Comment> {
    const post = await this.postsRepository.findOne({
      where: { id: createCommentDto.post_id },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${createCommentDto.post_id} not found`);
    }

    const newComment = this.commentsRepository.create({
      ...createCommentDto,
      author_id: authorId,
    });

    const savedComment = await this.commentsRepository.save(newComment);

    if (post.author_id && post.author_id !== authorId) {
      const displayName = authorName || 'Người dùng';
      await this.notificationsService.createNotification(
        post.author_id,
        'NEW_COMMENT',
        'Bình luận mới',
        `${displayName} đã bình luận trên bài viết của bạn.`,
        `/posts/${post.id}`,
      );
    }

    return savedComment;
  }

  async findAll(postId?: string, personHandle?: string, limit = 50, offset = 0): Promise<Comment[]> {
    const query = this.commentsRepository.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'author')
      .orderBy('comment.created_at', 'ASC')
      .skip(offset)
      .take(limit);

    if (postId) {
      query.where('comment.post_id = :postId', { postId });
    } else if (personHandle) {
      query.where('comment.person_handle = :personHandle', { personHandle });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    return comment;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.findOne(id);
    Object.assign(comment, updateCommentDto);
    return this.commentsRepository.save(comment);
  }

  async remove(id: string): Promise<void> {
    const comment = await this.findOne(id);
    await this.commentsRepository.remove(comment);
  }
}
