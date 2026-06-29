import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contribution } from './entities/contribution.entity';

@Injectable()
export class ContributionsService {
  constructor(
    @InjectRepository(Contribution)
    private readonly contributionsRepository: Repository<Contribution>,
  ) {}

  async create(createContributionDto: any, authorId: string): Promise<any> {
    const newContrib = this.contributionsRepository.create({
      ...createContributionDto,
      author_id: authorId,
    });
    return this.contributionsRepository.save(newContrib);
  }

  findAll(status?: string, limit = 50, offset = 0) {
    const where = status ? { status } : {};
    return this.contributionsRepository.find({
      where,
      order: { created_at: 'DESC' },
      skip: offset,
      take: limit,
    });
  }

  async update(id: string, payload: any) {
    const contribution = await this.contributionsRepository.findOneBy({ id });
    if (!contribution) throw new NotFoundException();
    if (payload.status) contribution.status = payload.status;
    if (payload.admin_note !== undefined) contribution.admin_note = payload.admin_note;
    if (payload.reviewed_by) contribution.reviewed_by = payload.reviewed_by;
    if (payload.reviewed_at) contribution.reviewed_at = payload.reviewed_at;
    
    return this.contributionsRepository.save(contribution);
  }

  async remove(id: string) {
    const contribution = await this.contributionsRepository.findOneBy({ id });
    if (!contribution) throw new NotFoundException();
    return this.contributionsRepository.remove(contribution);
  }
}
