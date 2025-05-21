import { jsonquery } from '@jsonquerylang/jsonquery';

import itemsFactory from '~/support/factories/items';
import { buildTree } from '~/support/factories/tableTree';
const DEFAULT_LIMIT = 10;
const DEFAULT_ITEM_TOTAL = 2048;
const DEFAULT_LATENCY = 1000; // milliseconds

const items = itemsFactory(DEFAULT_ITEM_TOTAL);

const buildQuery = (filters, sort) => {
  const [sortAttribute, sortDirection] = sort?.split(':') || ['id', 'asc'];
  const query = [
    ...(filters ? [`filter(${filters})`] : []),
    ...(sortAttribute && sortDirection
      ? [`sort(.${sortAttribute}, "${sortDirection}")`]
      : []),
  ].join(' | ');
  console.log('JSONQuery:', query);

  return query;
};

const sleep = (timeout) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

/**
 *
 * This function serves as an "API" for examples and tests
 *
 */
const fakeApi = async (
  endpoint,
  { filters, sort, offset = 0, limit = DEFAULT_LIMIT } = {}
) => {
  console.log(`Fake API call to ${endpoint} with:`, {
    filters,
    sort,
    offset,
    limit,
  });
  const query = buildQuery(filters, sort);
  const queriedItems = query.length ? jsonquery(items, query) : items;
  const actualLimit = limit === 'max' ? items.length : limit;

  const result = {
    data: queriedItems.slice(offset, offset + actualLimit),
    meta: {
      total: queriedItems.length,
    },
  };

  return new Promise(function (resolve) {
    setTimeout(function () {
      console.log(`Fake API result for ${endpoint}:`, result);
      resolve(result);
    }, DEFAULT_LATENCY);
  });
};

export const fakePlasticTreeApi = async () => buildTree({ items });

export default fakeApi;
