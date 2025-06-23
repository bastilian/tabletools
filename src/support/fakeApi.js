import { jsonquery } from '@jsonquerylang/jsonquery';

import itemsFactory from '~/support/factories/items';
import { buildTree } from '~/support/factories/tableTree';
const DEFAULT_LIMIT = 10;
const DEFAULT_ITEM_TOTAL = 2048;

const items = itemsFactory(DEFAULT_ITEM_TOTAL);

const buildQuery = (filters, sort) => {
  const [sortAttribute, sortDirection] = sort?.split(':') || ['id', 'asc'];
  const query = [
    ...(filters ? [`filter(${filters})`] : []),
    ...(sortAttribute && sortDirection
      ? [`sort(.${sortAttribute}, "${sortDirection}")`]
      : []),
  ].join(' | ');
  console.log('[API][JSONQuery]:', query);

  return query;
};

/**
 *
 * This function serves as an "API" for examples and tests
 *
 */
export const fakeApi = (
  endpoint,
  { filters, sort, offset = 0, limit = DEFAULT_LIMIT } = {},
) => {
  const query = buildQuery(filters, sort);
  const queriedItems = query.length ? jsonquery(items, query) : items;
  const actualLimit = limit === 'max' ? items.length : limit;

  return {
    data: queriedItems.slice(offset, offset + actualLimit),
    meta: {
      total: queriedItems.length,
    },
  };
};

export const fakePlasticTreeApi = async () => buildTree({ items });
