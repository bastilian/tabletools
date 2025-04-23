import { jsonquery } from '@jsonquerylang/jsonquery';

const DEFAULT_LIMIT = 10;

const buildQuery = (filters, sort) => {
  const [sortAttribute, sortDirection] = sort?.split(':') || ['id', 'asc'];
  const query = [
    ...(filters ? [`filter(${filters})`] : []),
    ...(sortAttribute && sortDirection
      ? [`sort(.${sortAttribute}, "${sortDirection}")`]
      : []),
  ].join(' | ');

  return query;
};

const queryItems = (
  items,
  { filters, sort, offset = 0, limit = DEFAULT_LIMIT } = {}
) => {
  const query = buildQuery(filters, sort);
  const queriedItems = query.length ? jsonquery(items, query) : items;
  const actualLimit = limit === 'max' ? items.length : limit;

  return queriedItems.slice(offset, offset + actualLimit);
};

export default queryItems;
