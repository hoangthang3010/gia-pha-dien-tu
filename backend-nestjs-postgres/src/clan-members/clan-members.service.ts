import { Injectable } from '@nestjs/common';
import { CreateClanMemberDto } from './dto/create-clan-member.dto';
import { UpdateClanMemberDto } from './dto/update-clan-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClanMember } from './entities/clan-member.entity';

@Injectable()
export class ClanMembersService {
  constructor(
    @InjectRepository(ClanMember)
    private clanMemberRepository: Repository<ClanMember>,
  ) { }

  create(createClanMemberDto: CreateClanMemberDto) {
    return 'This action adds a new clanMember';
  }

  async findAll() {
    return await this.clanMemberRepository.find({
      relations: ['clan'],
    });
  }

  async findAllByUserId(userId: string) {
    return await this.clanMemberRepository.find({
      where: { user_id: userId },
      relations: ['clan'],
    });
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
