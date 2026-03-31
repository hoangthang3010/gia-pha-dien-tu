import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { Media } from './entities/media.entity';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  async create(createMediaDto: CreateMediaDto, uploaderId: string): Promise<Media> {
    const newMedia = this.mediaRepository.create({
      ...createMediaDto,
      uploader_id: uploaderId,
    });
    return this.mediaRepository.save(newMedia);
  }

  async findAll(state?: string): Promise<Media[]> {
    const query = this.mediaRepository.createQueryBuilder('media')
      .leftJoinAndSelect('media.uploader', 'uploader')
      .orderBy('media.created_at', 'DESC');

    if (state && state.toLowerCase() !== 'all') {
      query.where('media.state = :state', { state });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Media> {
    const media = await this.mediaRepository.findOne({
      where: { id },
      relations: ['uploader'],
    });

    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }
    return media;
  }

  async update(id: string, updateMediaDto: UpdateMediaDto): Promise<Media> {
    const media = await this.findOne(id);
    Object.assign(media, updateMediaDto);
    return this.mediaRepository.save(media);
  }

  async remove(id: string): Promise<void> {
    const media = await this.findOne(id);
    await this.mediaRepository.remove(media);
  }
}
