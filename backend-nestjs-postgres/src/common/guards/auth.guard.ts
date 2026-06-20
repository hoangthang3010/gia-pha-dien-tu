import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { Profile } from '../../profiles/entities/profile.entity';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly dataSource: DataSource,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    let token = authHeader?.split(' ')[1]; // Bearer <token>

    if (!token) {
      const queryToken = request.query?.token;
      if (Array.isArray(queryToken)) {
        token = queryToken[0];
      } else if (typeof queryToken === 'string') {
        token = queryToken;
      }
    }

    if (!token) {
      throw new UnauthorizedException('Access token missing');
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'fallback_secret') as {
        userId: string;
      };

      const profile = await this.profileRepository.findOne({
        where: { id: decoded.userId },
      });

      if (!profile) {
        throw new NotFoundException('User does not exist');
      }

      const { hashed_password: _hidden, ...safeProfile } = profile;
      request.user = {
        ...safeProfile,
      };

      const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (requiredRoles && requiredRoles.length > 0 && !requiredRoles.includes(request.user.role)) {
        throw new ForbiddenException('Insufficient permissions');
      }

      return true;
    } catch (err) {
      if (
        err instanceof UnauthorizedException ||
        err instanceof NotFoundException
      ) {
        throw err;
      }
      throw new ForbiddenException('Access token expired or invalid');
    }
  }
}
