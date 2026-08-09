import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Person } from './entities/person.entity';
import { Family } from '../families/entities/family.entity';

@Injectable()
export class PeopleService {
  constructor(
    @InjectRepository(Person)
    private readonly peopleRepository: Repository<Person>,
    @InjectRepository(Family)
    private readonly familiesRepository: Repository<Family>,
  ) {}

  async create(createPersonDto: CreatePersonDto, creatorId: string): Promise<Person> {
    const person = this.peopleRepository.create({
      ...createPersonDto,
      created_by: creatorId,
    });
    return this.peopleRepository.save(person);
  }

  async findAll(
    clanId?: string,
    limit = 50,
    offset = 0,
    search?: string,
    gender?: number,
    isLiving?: boolean,
  ): Promise<Person[]> {
    const findOptions: any = {
      order: { created_at: 'DESC' },
      skip: offset,
      take: limit,
    };

    const where: any = {};
    if (clanId) {
      where.clan_id = clanId;
    }
    if (search) {
      where.display_name = ILike(`%${search}%`);
    }
    if (gender !== undefined && gender !== null) {
      where.gender = gender;
    }
    if (isLiving !== undefined && isLiving !== null) {
      where.is_living = isLiving;
    }

    findOptions.where = where;
    return this.peopleRepository.find(findOptions);
  }

  async findTreeData(clanId?: string): Promise<{ people: Person[]; families: Family[] }> {
    const where = clanId ? { clan_id: clanId } : {};

    const [people, families] = await Promise.all([
      this.peopleRepository.find({ where, order: { created_at: 'DESC' } }),
      this.familiesRepository.find({ where, order: { created_at: 'DESC' } }),
    ]);

    return { people, families };
  }

  async findOne(handle: string): Promise<Person> {
    const person = await this.peopleRepository.findOne({ where: { handle } });
    if (!person) throw new NotFoundException(`Person with handle ${handle} not found`);
    return person;
  }

  async update(handle: string, updatePersonDto: UpdatePersonDto): Promise<Person> {
    const person = await this.findOne(handle);
    Object.assign(person, updatePersonDto);
    return this.peopleRepository.save(person);
  }

  async remove(handle: string): Promise<void> {
    const person = await this.findOne(handle);
    await this.peopleRepository.remove(person);
  }
}
