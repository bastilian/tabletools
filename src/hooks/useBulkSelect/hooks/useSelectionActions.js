import { useCallback } from 'react';

import { useFullTableState } from '~/hooks';

const useSelectionActions = ({
  allSelected,
  identifier,
  isItemSelected,
  currentPageSelected,
  setLoading,
  itemIdsInTable,
  itemIdsOnPage,
  actions,
}) => {
  const { set, select, deselect, clear } = actions;
  const { tableState, serialisedTableState } = useFullTableState() || {};

  const selectOne = useCallback(
    (_, _selected, _key, { item }) =>
      isItemSelected(item.itemId)
        ? deselect(item[identifier])
        : select(item[identifier]),
    [isItemSelected, select, deselect, identifier],
  );

  const selectPage = useCallback(
    () =>
      !currentPageSelected ? select(itemIdsOnPage) : deselect(itemIdsOnPage),
    [select, deselect, itemIdsOnPage, currentPageSelected],
  );

  const selectAll = useCallback(async () => {
    setLoading(true);
    if (allSelected) {
      clear();
    } else {
      set(await itemIdsInTable(serialisedTableState, tableState));
    }
    setLoading(false);
  }, [
    allSelected,
    clear,
    set,
    itemIdsInTable,
    tableState,
    serialisedTableState,
    setLoading,
  ]);

  return {
    selectOne,
    ...(itemIdsOnPage ? { selectPage } : {}),
    ...(itemIdsInTable ? { selectAll } : {}),
  };
};

export default useSelectionActions;
