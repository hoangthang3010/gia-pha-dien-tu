import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InviteLink } from './entities/invite-link.entity';

@Injectable()
export class InviteLinksService {
  constructor(
    @InjectRepository(InviteLink)
    private readonly inviteLinksRepository: Repository<InviteLink>,
  ) {}

  create(payload: any) {
    const link = this.inviteLinksRepository.create(payload);
    return this.inviteLinksRepository.save(link);
  }

  findAll(limit = 50, offset = 0) {
    return this.inviteLinksRepository.find({
      order: { created_at: 'DESC' },
      skip: offset,
      take: limit,
    });
  }

  async remove(id: string) {
    const link = await this.inviteLinksRepository.findOneBy({ id });
    if (!link) throw new NotFoundException();
    return this.inviteLinksRepository.remove(link);
  }
}
