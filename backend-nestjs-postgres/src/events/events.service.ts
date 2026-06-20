import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { EventRsvp } from './entities/event-rsvp.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
    @InjectRepository(EventRsvp)
    private readonly rsvpRepository: Repository<EventRsvp>,
  ) {}

  async create(createEventDto: CreateEventDto, creatorId: string): Promise<Event> {
    const newEvent = this.eventsRepository.create({
      ...createEventDto,
      creator_id: creatorId,
    });
    return this.eventsRepository.save(newEvent);
  }

  async findAll(clanId?: string, limit = 50, offset = 0): Promise<Event[]> {
    const query = this.eventsRepository.createQueryBuilder('event')
      .leftJoinAndSelect('event.creator', 'creator')
      .orderBy('event.start_at', 'DESC')
      .skip(offset)
      .take(limit);

    if (clanId) {
      query.where('event.clan_id = :clanId', { clanId });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<any> {
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['creator'],
    });
    
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    const rsvps = await this.rsvpRepository.find({
      where: { event_id: id },
      relations: ['user']
    });

    return { ...event, rsvps };
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.eventsRepository.findOne({ where: { id } });
    if (!event) throw new NotFoundException();
    Object.assign(event, updateEventDto);
    return this.eventsRepository.save(event);
  }

  async remove(id: string): Promise<void> {
    const event = await this.eventsRepository.findOne({ where: { id } });
    if (!event) throw new NotFoundException();
    await this.eventsRepository.remove(event);
  }

  async rsvp(eventId: string, userId: string, status: string, clanId?: string): Promise<EventRsvp> {
    let rsvp = await this.rsvpRepository.findOne({
      where: { event_id: eventId, user_id: userId }
    });

    if (rsvp) {
      rsvp.status = status;
    } else {
      rsvp = this.rsvpRepository.create({
        event_id: eventId,
        user_id: userId,
        status,
        clan_id: clanId
      });
    }

    return this.rsvpRepository.save(rsvp);
  }
}
