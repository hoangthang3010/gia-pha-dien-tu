import { Injectable } from '@nestjs/common';
import { CreateClanMemberDto } from './dto/create-clan-member.dto';
import { UpdateClanMemberDto } from './dto/update-clan-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClanMember } from './entities/clan-member.entity';
import { Clan } from '../clans/entities/clan.entity';

@Injectable()
export class ClanMembersService {
  constructor(
    @InjectRepository(ClanMember)
    private clanMemberRepository: Repository<ClanMember>,
  ) { }

  create(createClanMemberDto: CreateClanMemberDto) {
    return 'This action adds a new clanMember';
  }

  async findAll(limit = 50, offset = 0) {
    return await this.clanMemberRepository.find({
      relations: ['clan'],
      order: { clan_id: 'DESC' },
      skip: offset,
      take: limit,
    });
  }

  async findAllByUserId(userId: string, limit = 50, offset = 0) {
    return await this.clanMemberRepository.find({
      where: { user_id: userId },
      relations: ['clan'],
      order: { clan_id: 'DESC' },
      skip: offset,
      take: limit,
    });
  }

  async findAllClansAsMemberships(userId: string, limit = 50, offset = 0) {
    const clans = await this.clanMemberRepository.manager.find(Clan, {
      order: { created_at: 'DESC' },
      skip: offset,
      take: limit,
    });
    return clans.map(clan => ({
      clan_id: clan.id,
      user_id: userId,
      role: 'admin',
      clan,
    }));
  }

  findOne(id: number) {
    return `This action returns a #${id} clanMember`;
  }

  update(id: number, updateClanMemberDto: UpdateClanMemberDto) {
    return `This action updates a #${id} clanMember`;
  }

  remove(id: number) {
    return `This action removes a #${id} clanMember`;
  }
}
