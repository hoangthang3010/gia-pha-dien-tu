import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClanMembersService } from './clan-members.service';
import { ClanMembersController } from './clan-members.controller';
import { ClanMember } from './entities/clan-member.entity';
import { ClansModule } from '../clans/clans.module';

@Module({
  imports: [TypeOrmModule.forFeature([ClanMember]), ClansModule],
  controllers: [ClanMembersController],
  providers: [ClanMembersService],
  exports: [ClanMembersService],
})
export class ClanMembersModule { }
