export function normalizePagePagination(page?: string | number, limit?: string | number) {
  const parsedPage = typeof page === 'string' ? parseInt(page, 10) : Number(page ?? 1);
  const parsedLimit = typeof limit === 'string' ? parseInt(limit, 10) : Number(limit ?? 50);

  const normalizedLimit = Number.isNaN(parsedLimit) ? 50 : Math.min(Math.max(parsedLimit, 1), 200);
  const normalizedPage = Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : Math.max(parsedPage, 1);

  return {
    page: normalizedPage,
    limit: normalizedLimit,
    offset: (normalizedPage - 1) * normalizedLimit,
  };
}

export function buildPagedResponse<T>(items: T[], page: number, limit: number) {
  const pageSize = items.length;
  return {
    items,
    page,
    limit,
    pageSize,
    nextPage: pageSize === limit ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
  };
}
