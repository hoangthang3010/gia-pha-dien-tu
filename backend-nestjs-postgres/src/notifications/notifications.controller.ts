import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Request,
  Res,
  Req,
} from '@nestjs/common';
import type { Response, Request as ExpressRequest } from 'express';
import { NotificationsService } from './notifications.service';
import { NotificationsStreamService } from './notifications-stream.service';

type AuthRequest = ExpressRequest & { user: { id: string } };

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly notificationsStreamService: NotificationsStreamService,
  ) {}

  @Get()
  findAll(@Request() req: AuthRequest) {
    return this.notificationsService.findAll(req.user.id);
  }

  @Get('unread-count')
  getUnreadCount(@Request() req: AuthRequest) {
    return this.notificationsService.getUnreadCount(req.user.id);
  }

  @Get('stream')
  async stream(@Req() req: AuthRequest, @Res() res: Response) {
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    res.flushHeaders?.();

    const sendPayload = (payload: { type: 'count' | 'notification'; count: number; notification?: any }) => {
      const data = JSON.stringify(payload);
      res.write(`data: ${data}\n\n`);
    };

    const unsubscribe = this.notificationsStreamService.subscribe(
      req.user.id,
      sendPayload,
    );

    req.on('close', () => {
      unsubscribe();
      res.end();
    });

    const { count } = await this.notificationsService.getUnreadCount(
      req.user.id,
    );
    sendPayload({ type: 'count', count });
  }

  @Post('mark-all-read')
  markAllAsRead(@Request() req: AuthRequest) {
    return this.notificationsService.markAllAsRead(req.user.id);
  }

  @Patch(':id')
  markAsRead(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.notificationsService.markAsRead(id, req.user.id);
  }
}
