import { useCallback } from 'react';

const useMarkSelectedRows = (selectedIds) => {
  const markSelectedRows = useCallback(
    (item, rowsForItem, _runningIndex, isTreeTable) => {
      const firstRow = rowsForItem[0];
      const remainingRows = rowsForItem.slice(1);

      return [
        {
          ...firstRow,
          ...(!isTreeTable
            ? { selected: selectedIds.includes(item.itemId) }
            : {}),
          props: {
            ...firstRow.props,
            ...(isTreeTable && !item.isTreeBranch
              ? { isChecked: selectedIds.includes(item.itemId) }
              : {}),
          },
        },
        ...remainingRows,
      ];
    },
    [selectedIds],
  );

  return markSelectedRows;
};

export default useMarkSelectedRows;
