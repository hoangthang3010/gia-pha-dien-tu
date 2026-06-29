import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';

export interface NotificationStreamPayload {
  type: 'count' | 'notification';
  count: number;
  notification?: {
    id: string;
    type: string;
    title: string;
    message: string;
    link_url: string | null;
    is_read: boolean;
    created_at: string;
  };
}

@Injectable()
export class NotificationsStreamService {
  private emitter = new EventEmitter();

  constructor() {
    this.emitter.setMaxListeners(0);
  }

  notifyCountChange(userId: string, count: number, notification?: NotificationStreamPayload['notification']) {
    const payload: NotificationStreamPayload = {
      type: notification ? 'notification' : 'count',
      count,
      notification,
    };
    this.emitter.emit(userId, payload);
  }

  subscribe(userId: string, listener: (payload: NotificationStreamPayload) => void) {
    this.emitter.on(userId, listener);
    return () => this.emitter.off(userId, listener);
  }
}
