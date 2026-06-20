export function normalizeOffsetPagination(limit?: string | number, offset?: string | number) {
  const parsedLimit = typeof limit === 'string' ? parseInt(limit, 10) : Number(limit ?? 50);
  const parsedOffset = typeof offset === 'string' ? parseInt(offset, 10) : Number(offset ?? 0);

  return {
    limit: Number.isNaN(parsedLimit) ? 50 : Math.min(Math.max(parsedLimit, 1), 200),
    offset: Number.isNaN(parsedOffset) ? 0 : Math.max(parsedOffset, 0),
  };
}
