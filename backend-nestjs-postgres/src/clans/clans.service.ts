import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Clan } from './entities/clan.entity';
import { CreateClanDto } from './dto/create-clan.dto';
import { UpdateClanDto } from './dto/update-clan.dto';

@Injectable()
export class ClansService {
  constructor(
    @InjectRepository(Clan)
    private clanRepository: Repository<Clan>,
    private dataSource: DataSource,
  ) { }

  create(createClanDto: CreateClanDto) {
    return 'This action adds a new clan';
  }

  async findAll(limit = 50, offset = 0) {
    return await this.clanRepository.find({
      order: { created_at: 'DESC' },
      skip: offset,
      take: limit,
    });
  }

  findOne(id: string) {
    return `This action returns a #${id} clan`;
  }

  async getStats(clanId?: string) {
    const tables = [
      'people',
      'families',
      'posts',
      'events',
      'clan_members',
    ];

    const stats: Record<string, number> = {};

    for (const table of tables) {
      let query = `SELECT COUNT(*) as count FROM ${table}`;
      let params: any[] = [];

      if (clanId) {
        query += ` WHERE clan_id = $1`;
        params = [clanId];
      }

      const result = await this.dataSource.query(query, params);
      stats[table] = parseInt(result[0].count, 10);
    }

    return stats;
  }

  update(id: string, updateClanDto: UpdateClanDto) {
    return `This action updates a #${id} clan`;
  }

  remove(id: string) {
    return `This action removes a #${id} clan`;
  }
}
