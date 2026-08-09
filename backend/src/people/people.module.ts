import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeopleService } from './people.service';
import { PeopleController } from './people.controller';
import { Person } from './entities/person.entity';
import { Family } from '../families/entities/family.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Person, Family])],
  controllers: [PeopleController],
  providers: [PeopleService],
  exports: [PeopleService]
})
export class PeopleModule {}
