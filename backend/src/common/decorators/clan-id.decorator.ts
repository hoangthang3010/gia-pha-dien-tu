import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';
import { hasClanAccess } from '../utils/authorization.util';

export const ClanId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const clanId = request.cookies?.clanId;

  if (!clanId) {
    throw new BadRequestException('clanId cookie is required');
  }

  if (!hasClanAccess(request.user, clanId)) {
    throw new BadRequestException('User does not have access to this clan');
  }

  return clanId;
});
