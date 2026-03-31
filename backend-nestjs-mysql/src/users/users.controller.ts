import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from './user.entity';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  @Get('me')
  getMe(@CurrentUser() user: User) {
    return { user };
  }
}
