import { faker } from '@faker-js/faker/locale/de';
import { jsonquery } from '@jsonquerylang/jsonquery';

import itemsFactory, { genres } from '~/support/factories/items';
import { buildTree } from '~/support/factories/tableTree';

const DEFAULT_LIMIT = 10;
const DEFAULT_ITEM_TOTAL = 2048;

const items = itemsFactory(DEFAULT_ITEM_TOTAL);
export const selectedItemIds = faker.helpers
  .arrayElements(items, 500)
  .map(({ id }) => id);

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

const queriedItems = (itemsToQuery) => {
  return ({
    filters,
    sort,
    offset = 0,
    limit = DEFAULT_LIMIT,
    total = DEFAULT_ITEM_TOTAL,
    idsOnly = false,
  } = {}) => {
    const totalItems = itemsToQuery.slice(0, total);
    const query = buildQuery(filters, sort);
    const items = query.length ? jsonquery(totalItems, query) : totalItems;
    const actualLimit = limit === 'max' ? items.length : limit;
    const data = items.slice(
      parseInt(offset),
      parseInt(offset) + parseInt(actualLimit),
    );

    return {
      data: idsOnly ? data.map(({ id }) => ({ id })) : data,
      meta: {
        total: items.length,
      },
    };
  };
};

export const apiItemHandler = ({ id }) => ({
  data: items.find(({ id: itemId }) => parseInt(id) === itemId),
});

export const apiHandler = queriedItems(items);
export const apiGenresHandler = queriedItems(genres);
export const apiTreehandler = async () => buildTree({ items });
export const apiSelectionHandler = () => selectedItemIds;
