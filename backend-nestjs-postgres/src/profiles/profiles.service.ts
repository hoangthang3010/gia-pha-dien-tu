import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profilesRepository: Repository<Profile>,
  ) { }

  create(payload: any) {
    const profile = this.profilesRepository.create(payload);
    return this.profilesRepository.save(profile);
  }

  async findAll(status?: string, clanId?: string) {
    const qb = this.profilesRepository.createQueryBuilder('profile');

    if (clanId) {
      qb.innerJoin('profile.clan_memberships', 'cm')
        .andWhere('cm.clan_id = :clanId', { clanId });
    }

    if (status) {
      qb.andWhere('profile.status = :status', { status });
    }

    return qb.orderBy('profile.created_at', 'DESC').getMany();
  }

  async findProfilesInSameClan(clanId: string, status?: string) {
    const qb = this.profilesRepository
      .createQueryBuilder('profile')
      .innerJoin('profile.clan_memberships', 'cm')
      .where('cm.clan_id = :clanId', { clanId });

    if (status) {
      qb.andWhere('profile.status = :status', { status });
    }

    return qb.orderBy('profile.created_at', 'DESC').getMany();
  }

  async findOne(id: string) {
    const profile = await this.profilesRepository.findOneBy({ id });
    if (!profile) throw new NotFoundException();
    return profile;
  }

  async update(id: string, payload: any) {
    const profile = await this.findOne(id);
    Object.assign(profile, payload);
    return this.profilesRepository.save(profile);
  }

  async remove(id: string) {
    const profile = await this.findOne(id);
    return this.profilesRepository.remove(profile);
  }
}
