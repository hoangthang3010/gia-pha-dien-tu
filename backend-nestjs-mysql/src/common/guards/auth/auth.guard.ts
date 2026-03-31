import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { User } from '../../../users/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const token = authHeader?.split(' ')[1]; // Bearer <token>

    if (!token) {
      throw new UnauthorizedException('Không tìm thấy access token');
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
        userId: number;
      };

      const user = await this.userRepository.findOne({
        where: { id: Number(decoded.userId) },
      });

      if (!user) {
        throw new NotFoundException('người dùng không tồn tại.');
      }

      const { hashedPassword: _hidden, ...safeUser } = user;
      request.user = safeUser;
      return true;
    } catch (err) {
      if (
        err instanceof UnauthorizedException ||
        err instanceof NotFoundException
      ) {
        throw err;
      }
      throw new ForbiddenException('Access token hết hạn hoặc không đúng');
    }
  }
}
