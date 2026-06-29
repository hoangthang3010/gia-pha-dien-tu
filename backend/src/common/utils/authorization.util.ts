export const isAdmin = (user: any) => user?.role === 'admin';

export const hasClanAccess = (user: any, clanId: string) =>
  isAdmin(user) || user?.clanIds?.includes(clanId);
