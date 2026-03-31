import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostEntity } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>,
  ) {}

  async create(createPostDto: CreatePostDto, authorId: string): Promise<PostEntity> {
    const newPost = this.postsRepository.create({
      ...createPostDto,
      author_id: authorId,
    });
    return this.postsRepository.save(newPost);
  }

  async findAll(clanId?: string): Promise<PostEntity[]> {
    const query = this.postsRepository.createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .loadRelationCountAndMap('post.comment_count', 'post.comments')
      .orderBy('post.is_pinned', 'DESC')
      .addOrderBy('post.created_at', 'DESC');

    if (clanId) {
      query.where('post.clan_id = :clanId', { clanId });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<PostEntity> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author', 'comments', 'comments.author'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<PostEntity> {
    const post = await this.postsRepository.findOne({ where: { id } });
    if (!post) throw new NotFoundException();
    Object.assign(post, updatePostDto);
    return this.postsRepository.save(post);
  }

  async remove(id: string): Promise<void> {
    const post = await this.postsRepository.findOne({ where: { id } });
    if (!post) throw new NotFoundException();
    await this.postsRepository.remove(post);
  }
}
