import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationsStreamService } from './notifications-stream.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
    private readonly notificationsStreamService: NotificationsStreamService,
  ) {}

  async createNotification(
    userId: string,
    type: string,
    title: string,
    message: string,
    linkUrl?: string,
  ) {
    const notification = new Notification();
    notification.user_id = userId;
    notification.type = type;
    notification.title = title;
    notification.message = message;
    notification.link_url = linkUrl ?? null;
    notification.is_read = false;

    const savedNotification = await this.notificationsRepository.save(notification);
    await this.emitUnreadCount(userId, savedNotification);
    return savedNotification;
  }

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
    const result = await this.notificationsRepository.update(
      { id, user_id: userId },
      { is_read: true },
    );
    await this.emitUnreadCount(userId);
    return result;
  }

  async markAllAsRead(userId: string) {
    const result = await this.notificationsRepository.update(
      { user_id: userId, is_read: false },
      { is_read: true },
    );
    await this.emitUnreadCount(userId);
    return result;
  }

  private async emitUnreadCount(userId: string, notification?: Notification) {
    const { count } = await this.getUnreadCount(userId);
    this.notificationsStreamService.notifyCountChange(userId, count, notification ? {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      link_url: notification.link_url,
      is_read: notification.is_read,
      created_at: notification.created_at.toISOString(),
    } : undefined);
  }
}
