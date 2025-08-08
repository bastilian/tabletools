import { useMemo } from 'react';

import { bulkSelectItem, selectOrUnselect } from '../helpers';

const useBulkSelectItems = ({
  total,
  paginatedTotal,
  selectedIdsTotal,
  currentPageSelected,
  selectPage,
  selectAll,
  clear,
}) => {
  const allSelected = selectedIdsTotal === total;
  const noneSelected = selectedIdsTotal === 0;

  const items = useMemo(
    () => [
      {
        title: 'Select none',
        onClick: () => clear(),
        props: {
          isDisabled: noneSelected,
        },
      },
      ...(selectPage
        ? [
            bulkSelectItem(
              `${selectOrUnselect(currentPageSelected)} page (${paginatedTotal} items)`,
              selectPage,
            ),
          ]
        : []),
      ...(selectAll
        ? [
            bulkSelectItem(
              `${selectOrUnselect(allSelected)} all (${total} items)`,
              selectAll,
            ),
          ]
        : []),
    ],
    [
      noneSelected,
      clear,
      selectAll,
      allSelected,
      total,
      currentPageSelected,
      paginatedTotal,
      selectPage,
    ],
  );

  return items;
};

export default useBulkSelectItems;
