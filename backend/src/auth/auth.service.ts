import {
  Injectable,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { Response } from 'express';
import { Repository } from 'typeorm';
import { Profile } from '../profiles/entities/profile.entity';
import { Session } from '../sessions/entities/session.entity';

const ACCESS_TOKEN_TTL = '15m'; // using 15 mins for better UX than 2m
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 days

const isProd = process.env.NODE_ENV === 'production';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Profile) private readonly profileRepository: Repository<Profile>,
    @InjectRepository(Session) private readonly sessionRepository: Repository<Session>,
  ) {}

  async signUp(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<void> {
    if (!email || !password || !firstName || !lastName) {
      throw new BadRequestException(
        'Missing required fields: email, password, firstName, lastName',
      );
    }

    const duplicate = await this.profileRepository.findOne({ where: { email } });
    if (duplicate) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const profile = this.profileRepository.create({
      email,
      hashed_password: hashedPassword,
      display_name: `${lastName} ${firstName}`.trim(), // Vietnamese naming convention
      role: 'member',
      status: 'active',
    });
    
    await this.profileRepository.save(profile);
  }

  async signIn(email: string, password: string, res: Response): Promise<void> {
    if (!email || !password) {
      throw new BadRequestException('Missing email or password');
    }

    const profile = await this.profileRepository.findOne({ where: { email } });
    if (!profile || !profile.hashed_password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordCorrect = await bcrypt.compare(password, profile.hashed_password);
    if (!passwordCorrect) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = jwt.sign(
      { userId: profile.id, role: profile.role }, 
      process.env.ACCESS_TOKEN_SECRET || 'fallback_secret', 
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    const refreshToken = crypto.randomBytes(64).toString('hex');

    const session = this.sessionRepository.create({
      user_id: profile.id,
      refresh_token: refreshToken,
      expires_at: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });
    await this.sessionRepository.save(session);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax', // Use 'lax' for local development unless strict cross-origin frontend
      maxAge: REFRESH_TOKEN_TTL,
    });

    res.status(200).json({
      message: `User ${profile.display_name} has logged in`,
      accessToken,
      user: {
        id: profile.id,
        email: profile.email,
        display_name: profile.display_name,
        role: profile.role,
        avatar_url: profile.avatar_url,
      }
    });
  }

  async signOut(refreshToken: string | undefined, res: Response): Promise<void> {
    if (refreshToken) {
      await this.sessionRepository.delete({ refresh_token: refreshToken });
      res.clearCookie('refreshToken');
    }
    res.sendStatus(204);
  }

  async refresh(refreshToken: string | undefined, res: Response): Promise<void> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const session = await this.sessionRepository.findOne({
      where: { refresh_token: refreshToken },
      relations: ['user']
    });
    
    if (!session || !session.user) {
      res.clearCookie('refreshToken');
      throw new ForbiddenException('Invalid refresh token');
    }

    if (session.expires_at < new Date()) {
      await this.sessionRepository.delete({ id: session.id });
      res.clearCookie('refreshToken');
      throw new ForbiddenException('Refresh token expired');
    }

    const newRefreshToken = crypto.randomBytes(64).toString('hex');
    session.refresh_token = newRefreshToken;
    session.expires_at = new Date(Date.now() + REFRESH_TOKEN_TTL);
    await this.sessionRepository.save(session);

    const accessToken = jwt.sign(
      { userId: session.user.id, role: session.user.role }, 
      process.env.ACCESS_TOKEN_SECRET || 'fallback_secret', 
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: REFRESH_TOKEN_TTL,
    });

    res.status(200).json({ 
      accessToken,
      user: {
        id: session.user.id,
        email: session.user.email,
        display_name: session.user.display_name,
        role: session.user.role,
        avatar_url: session.user.avatar_url,
      }
    });
  }
}
