import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClansService } from './clans.service';
import { ClansController } from './clans.controller';
import { Clan } from './entities/clan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Clan])],
  controllers: [ClansController],
  providers: [ClansService],
  exports: [ClansService],
})
export class ClansModule {}
