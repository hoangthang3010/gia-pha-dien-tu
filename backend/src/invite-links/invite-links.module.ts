import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InviteLinksService } from './invite-links.service';
import { InviteLinksController } from './invite-links.controller';
import { InviteLink } from './entities/invite-link.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InviteLink])],
  controllers: [InviteLinksController],
  providers: [InviteLinksService],
  exports: [InviteLinksService],
})
export class InviteLinksModule {}
