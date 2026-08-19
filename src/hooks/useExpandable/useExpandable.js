import { useCallback, useEffect, useMemo } from 'react';

import useSelectionManager from '~/hooks/useSelectionManager';
import useTableState from '~/hooks/useTableState';

import { itemDetailsRow, addExpandProp } from './helpers';

/**
 *  @typedef {object} useExpandableReturn
 *
 *  @property {boolean}  enableExpandingRow Whether expandable rows are enabled
 *  @property {Function} onCollapse         Expand/collapse handler
 *  @property {Function} isItemOpen         Whether an item is expanded
 *  @property {Function} expandRow          Row transformer for expanded rows
 *  @property {boolean}  canCollapseAll     Whether collapse-all is enabled
 *  @property {boolean}  enableTreeView     Whether tree view mode is enabled
 */

/**
 * Provides expandable row props for table tools.
 *
 *  @param   {object}              [options]                  AsyncTableTools options
 *  @param   {object}              [options.detailsComponent] A component that should be rendered as a details row
 *  @param   {object}              [options.detailsProps]     Props spread onto each details row
 *  @param   {Array}               [options.items]            Items currently rendered in the table (used for expand/collapse all)
 *  @param   {boolean}             [options.canCollapseAll]   Whether to enable the expand/collapse all toggle in the table header (defaults to true)
 *
 *  @returns {useExpandableReturn}                            Expandable props for variant adapters
 *
 *  @group Hooks
 *
 */
const useExpandable = (options) => {
  const enableExpandingRow = !!options?.detailsComponent || !!options.treeTable;
  const { selection: openItems, toggle, set, clear } = useSelectionManager([]);
  // TODO If the selection manager is based on `useTableState`, observes can be used to reset open items
  const [, setOpenItemsState] = useTableState('open-items');

  const onCollapse = useCallback(
    (_event, rowIndex, isOpen, rowData) => {
      if (rowIndex === undefined) {
        if (isOpen) {
          set(options.items?.map((item) => item.itemId));
        } else {
          clear();
        }
      } else {
        toggle(rowData?.item?.itemId);
      }
    },
    [options.items, toggle, set, clear],
  );

  const isItemOpen = useCallback(
    (itemId) => (openItems || []).includes(itemId),
    [openItems],
  );

  const expandRow = useCallback(
    (item, rowsForItem, runningIndex, isTreeTable) => {
      const firstRow = rowsForItem[0];
      const remainingRows = rowsForItem.slice(1);
      const isOpen = isItemOpen(item.itemId);

      return [
        addExpandProp(firstRow, isTreeTable, isOpen),
        ...(isOpen && !item.isTreeBranch
          ? [itemDetailsRow(item, options, runningIndex)]
          : []),
        ...remainingRows,
      ];
    },
    [isItemOpen, options],
  );

  // TODO This is hackish. We should rather have a selection manager based on a table state
  useEffect(() => {
    setOpenItemsState(openItems);
  }, [openItems, setOpenItemsState]);

  return useMemo(
    () => ({
      enableExpandingRow,
      onCollapse,
      isItemOpen,
      expandRow,
      canCollapseAll: options?.canCollapseAll !== false,
      enableTreeView: !!options?.enableTreeView,
    }),
    [
      enableExpandingRow,
      onCollapse,
      isItemOpen,
      expandRow,
      options?.canCollapseAll,
      options?.enableTreeView,
    ],
  );
};

export default useExpandable;
