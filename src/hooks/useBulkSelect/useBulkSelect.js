import { useCallback, useState } from 'react';
import { useDeepCompareEffect } from 'use-deep-compare';

import {
  useTableState,
  useSelectionManager,
  useCallbacksCallback,
} from '~/hooks';

import {
  checkCurrentPageSelected,
  checkboxState,
  compileTitle,
} from './helpers';
import {
  useSelectionActions,
  useMarkSelectedRows,
  useBulkSelectItems,
} from './hooks';

/**
 *  @typedef {object} useBulkSelectReturn
 *
 *  @property {Function} [markRowSelected] "Transformer" function to be passed to the rowsBuilder
 *  @property {object}   [toolbarProps]    Object containing PrimaryToolbar props
 *  @property {object}   [tableProps]      Object containing Patternfly (v4) Table props
 *
 */

/**
 * Provides properties for a Pattternfly (based) Table and Toolbar component to implement bulk selection
 *
 *  @param   {object}              [options]                AsyncTableTools options
 *  @param   {number}              [options.total]          Number to show as total count
 *  @param   {Function}            [options.onSelect]       function to call when a selection is made
 *  @param   {Array}               [options.selected]       Array of itemIds that should be selected.
 *  @param   {Function}            [options.itemIdsInTable] Function to call to retrieve IDs when "Select All" is chosen
 *  @param   {Array}               [options.itemIdsOnPage]  Array of item ids visible on the page
 *  @param   {string}              [options.identifier]     Property of the items that should be used as ID to select them
 *
 *  @returns {useBulkSelectReturn}                          Functions and props to use for setting up bulk selection
 *
 *  @group Hooks
 *
 */
const useBulkSelect = ({
  total = 0,
  onSelect,
  selected,
  itemIdsInTable,
  itemIdsOnPage,
  identifier = 'itemId',
}) => {
  const enableBulkSelect = !!onSelect;

  const [loading, setLoading] = useState(false);
  const [, setSelected] = useTableState('selected');
  const { selection: selectedIds = [], ...actions } =
    useSelectionManager(selected);
  const { select, deselect, reset, set } = actions;

  const selectedIdsTotal = (selectedIds || []).length;
  const paginatedTotal = itemIdsOnPage?.length || total;
  const allSelected = selectedIdsTotal === total;
  const currentPageSelected = checkCurrentPageSelected(
    itemIdsOnPage,
    selectedIds,
  );

  // TODO this is not totally wrong, but when the tree view is active there is currently no total, which causes the selection to be disabled there.
  // The bug may not even be fixed here, but in the tables that use selection and the tree view. They will need to provide an appropriate total still
  const isDisabled = total === 0;
  const checked = checkboxState(selectedIdsTotal, total);

  const title = compileTitle(selectedIdsTotal, loading);

  const isItemSelected = useCallback(
    (itemId) => selectedIds.includes(itemId),
    [selectedIds],
  );

  const { selectOne, selectPage, selectAll, deselectAll } = useSelectionActions(
    {
      allSelected,
      identifier,
      isItemSelected,
      currentPageSelected,
      setLoading,
      itemIdsInTable,
      itemIdsOnPage,
      actions,
    },
  );
  const bulkSelectItems = useBulkSelectItems({
    total,
    paginatedTotal,
    selectedIdsTotal,
    selectPage,
    selectAll,
    currentPageSelected,
    ...actions,
  });
  const onSelectAction = selectedIdsTotal ? deselectAll : selectPage;

  // TODO we should refactor this and expose "actions" of hooks more consistently and obvious
  useCallbacksCallback('resetSelection', reset);
  useCallbacksCallback('setSelection', set);

  const markRowSelected = useMarkSelectedRows(selectedIds);

  useDeepCompareEffect(() => {
    setSelected(selectedIds);

    if (typeof onSelect === 'function') {
      onSelect(selectedIds);
    }
  }, [selectedIds, setSelected, onSelect]);

  return {
    tableView: {
      enableBulkSelect,
      markRowSelected,
      isItemSelected,
      select,
      deselect,
    },
    ...(enableBulkSelect
      ? {
          tableProps: {
            onSelect: total > 0 ? selectOne : undefined,
            canSelectAll: false,
          },
          toolbarProps: {
            bulkSelect: {
              ...(loading
                ? { toggleProps: { children: [title] } }
                : { count: selectedIdsTotal }),
              isDisabled,
              items: bulkSelectItems,
              checked,
              onSelect: !isDisabled ? onSelectAction : undefined,
            },
          },
        }
      : {}),
  };
};

export default useBulkSelect;
