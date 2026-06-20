import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { Notification } from './entities/notification.entity';
import { NotificationsStreamService } from './notifications-stream.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsStreamService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
