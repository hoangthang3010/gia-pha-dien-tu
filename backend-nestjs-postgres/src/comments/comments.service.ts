import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
  ) { }

  async create(createCommentDto: CreateCommentDto, authorId: string): Promise<Comment> {
    const newComment = this.commentsRepository.create({
      ...createCommentDto,
      author_id: authorId,
    });

    return this.commentsRepository.save(newComment);
  }

  async findAll(postId?: string, personHandle?: string): Promise<Comment[]> {
    const query = this.commentsRepository.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'author')
      .orderBy('comment.created_at', 'ASC');

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
