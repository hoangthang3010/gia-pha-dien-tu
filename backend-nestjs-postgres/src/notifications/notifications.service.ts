import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
  ) {}

  async findAll(userId: string) {
    return this.notificationsRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
      take: 50,
    });
  }

  async getUnreadCount(userId: string) {
    const count = await this.notificationsRepository.count({
      where: { user_id: userId, is_read: false }
    });
    return { count };
  }

  async markAsRead(id: string, userId: string) {
    return this.notificationsRepository.update({ id, user_id: userId }, { is_read: true });
  }

  async markAllAsRead(userId: string) {
    return this.notificationsRepository.update({ user_id: userId, is_read: false }, { is_read: true });
  }
}
