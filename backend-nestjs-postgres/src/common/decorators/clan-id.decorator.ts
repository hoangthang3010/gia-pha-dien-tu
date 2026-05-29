import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';

export const ClanId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const clanId = request.cookies?.clanId;
  console.log(request, clanId);
  

  if (!clanId) {
    throw new BadRequestException('clanId cookie is required');
  }

  // Validate that the user has access to this clan
  if (!request.user?.clanIds?.includes(clanId) && request.user?.role !== 'admin') {
    throw new BadRequestException('User does not have access to this clan');
  }

  return clanId;
});
