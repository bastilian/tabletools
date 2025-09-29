export const removeEmptyKeys = (object) =>
  Object.fromEntries(Object.entries(object).filter(([, value]) => !!value));

export const pickStatesForParams = (state, itemsStatesForParams) =>
  Object.fromEntries(
    Object.entries(state).filter(([key]) => itemsStatesForParams.includes(key)),
  );

export const isObject = (value) =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const defaultItemsSelect = ({ data: items, meta: { total } }) => [
  items,
  total,
];

export const defaultExporterSelect = ({ data }) => data;

export const defaultItemIdsInTableSelect = ({ data } = {}) =>
  Array.isArray(data) ? data?.map(({ id }) => id) : undefined;

export const defaultTotalBatchedSelect = (results, totalForBatched) => ({
  data: results?.reduce((acc, { data }) => [...acc, ...data], []),
  meta: {
    total: totalForBatched(results[0]),
  },
});

export const defaultTotalForBatched = (firstPage) => firstPage?.meta?.total;
