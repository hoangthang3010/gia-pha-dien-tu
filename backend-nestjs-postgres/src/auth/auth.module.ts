import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '../profiles/entities/profile.entity';
import { Session } from '../sessions/entities/session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, Session])],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
