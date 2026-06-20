import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { ProfilesModule } from './profiles/profiles.module';
import { ClansModule } from './clans/clans.module';
import { ClanMembersModule } from './clan-members/clan-members.module';
import { PeopleModule } from './people/people.module';
import { FamiliesModule } from './families/families.module';
import { ContributionsModule } from './contributions/contributions.module';
import { EventsModule } from './events/events.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { MediaModule } from './media/media.module';
import { NotificationsModule } from './notifications/notifications.module';
import { InviteLinksModule } from './invite-links/invite-links.module';
import { SessionsModule } from './sessions/sessions.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './common/guards/auth.guard';
import { Profile } from './profiles/entities/profile.entity';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...(process.env.DATABASE_URL
        ? { url: process.env.DATABASE_URL }
        : {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
            username: process.env.DB_USERNAME || 'postgres',
            password: process.env.DB_PASSWORD || 'password',
            database: process.env.DB_NAME || 'gia_pha',
          }),
      ssl:
        process.env.DB_SSL === 'true'
          ? { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false' }
          : false,
      autoLoadEntities: true,
      synchronize: true, // Note: Set to false in production
    }),
    TypeOrmModule.forFeature([Profile]),
    ProfilesModule,
    ClansModule,
    ClanMembersModule,
    PeopleModule,
    FamiliesModule,
    ContributionsModule,
    EventsModule,
    PostsModule,
    CommentsModule,
    MediaModule,
    NotificationsModule,
    InviteLinksModule,
    SessionsModule,
    AuthModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
