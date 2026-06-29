import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class LoadClanIdsGuard implements CanActivate {
  constructor(private readonly dataSource: DataSource) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.id || user?.clanIds) {
      return true;
    }

    const clans = await this.dataSource.query(
      `SELECT clan_id FROM clan_members WHERE user_id = $1`,
      [user.id],
    );
    request.user.clanIds = clans.map((c) => c.clan_id);
    return true;
  }
}
