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
 *  @property {boolean}       enableBulkSelect Whether bulk selection is enabled
 *  @property {Array}         selectedIds      Currently selected item ids
 *  @property {number}        selectedIdsTotal Number of selected items
 *  @property {Function}      isItemSelected   Whether an item id is selected
 *  @property {Function}      select           Adds item ids to the selection
 *  @property {Function}      deselect         Removes item ids from the selection
 *  @property {Function}      markRowSelected  Row transformer for rowsBuilder
 *  @property {Function}      selectOne        Handler for selecting a single row
 *  @property {Function}      [selectPage]     Toggles selection for the current page
 *  @property {Function}      [selectAll]      Toggles selection for all items
 *  @property {Function}      deselectAll      Clears the selection
 *  @property {boolean}       loading          Whether a select-all request is in progress
 *  @property {boolean}       isDisabled       Whether the bulk select control is disabled
 *  @property {boolean|null}  checked          Checkbox state for the toolbar control
 *  @property {string|object} title            Toolbar title while loading
 *  @property {Array}         bulkSelectItems  Dropdown menu items for the toolbar
 *  @property {Function}      onToolbarSelect  Handler for the toolbar checkbox
 *  @property {number}        total            Total number of items
 */

/**
 * Provides bulk selection state and actions for table tools.
 *
 *  @param   {object}              [options]                AsyncTableTools options
 *  @param   {number}              [options.total]          Number to show as total count
 *  @param   {Function}            [options.onSelect]       function to call when a selection is made
 *  @param   {Array}               [options.selected]       Array of itemIds that should be selected.
 *  @param   {Function}            [options.itemIdsInTable] Function to call to retrieve IDs when "Select All" is chosen
 *  @param   {Array}               [options.itemIdsOnPage]  Array of item ids visible on the page
 *  @param   {string}              [options.identifier]     Property of the items that should be used as ID to select them
 *
 *  @returns {useBulkSelectReturn}                          Bulk select props for variant adapters
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
  const { select, deselect, reset, set, clear } = actions;

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
    clear,
  });
  const onToolbarSelect = selectedIdsTotal ? deselectAll : selectPage;

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
    enableBulkSelect,
    selectedIds,
    selectedIdsTotal,
    isItemSelected,
    select,
    deselect,
    markRowSelected,
    selectOne,
    selectPage,
    selectAll,
    deselectAll,
    loading,
    isDisabled,
    checked,
    title,
    bulkSelectItems,
    onToolbarSelect,
    total,
  };
};

export default useBulkSelect;
