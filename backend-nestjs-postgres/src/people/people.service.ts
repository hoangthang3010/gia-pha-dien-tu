import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Person } from './entities/person.entity';

@Injectable()
export class PeopleService {
  constructor(
    @InjectRepository(Person)
    private readonly peopleRepository: Repository<Person>,
  ) {}

  async create(createPersonDto: CreatePersonDto, creatorId: string): Promise<Person> {
    const person = this.peopleRepository.create({
      ...createPersonDto,
      created_by: creatorId,
    });
    return this.peopleRepository.save(person);
  }

  async findAll(clanId?: string, limit = 50, offset = 0): Promise<Person[]> {
    const findOptions: any = {
      order: { created_at: 'DESC' },
      skip: offset,
      take: limit,
    };

    if (clanId) {
      findOptions.where = { clan_id: clanId };
    }

    return this.peopleRepository.find(findOptions);
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
