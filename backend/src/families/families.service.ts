import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { Family } from './entities/family.entity';

@Injectable()
export class FamiliesService {
  constructor(
    @InjectRepository(Family)
    private readonly familiesRepository: Repository<Family>,
  ) {}

  async create(createFamilyDto: CreateFamilyDto): Promise<Family> {
    const family = this.familiesRepository.create(createFamilyDto);
    return this.familiesRepository.save(family);
  }

  async findAll(clanId?: string, limit = 50, offset = 0): Promise<Family[]> {
    const query = this.familiesRepository.createQueryBuilder('family')
      .orderBy('family.created_at', 'DESC')
      .skip(offset)
      .take(limit);

    if (clanId) {
      query.where('family.clan_id = :clanId', { clanId });
    }

    return query.getMany();
  }

  async findOne(handle: string): Promise<Family> {
    const family = await this.familiesRepository.findOne({ where: { handle } });
    if (!family) throw new NotFoundException(`Family with handle ${handle} not found`);
    return family;
  }

  async update(handle: string, updateFamilyDto: UpdateFamilyDto): Promise<Family> {
    const family = await this.findOne(handle);
    Object.assign(family, updateFamilyDto);
    return this.familiesRepository.save(family);
  }

  async moveChild(childHandle: string, fromFamilyHandle: string, toFamilyHandle: string): Promise<void> {
    const fromFamily = await this.findOne(fromFamilyHandle);
    const toFamily = await this.findOne(toFamilyHandle);

    if (fromFamily.children) {
      fromFamily.children = fromFamily.children.filter(h => h !== childHandle);
      await this.familiesRepository.save(fromFamily);
    }
    
    if (toFamily) {
      const children = toFamily.children || [];
      if (!children.includes(childHandle)) {
        toFamily.children = [...children, childHandle];
        await this.familiesRepository.save(toFamily);
      }
    }
  }

  async removeChild(childHandle: string, familyHandle: string): Promise<void> {
    const family = await this.findOne(familyHandle);
    if (family.children) {
      family.children = family.children.filter(h => h !== childHandle);
      await this.familiesRepository.save(family);
    }
  }

  async remove(handle: string): Promise<void> {
    const family = await this.findOne(handle);
    await this.familiesRepository.remove(family);
  }
}
