import { useMemo } from 'react';
import { useDeepCompareEffect } from 'use-deep-compare';

import useDebug from '~/hooks/useDebug';
import usePagination from '~/hooks/usePagination';
import useFilterConfig from '~/hooks/useFilterConfig';
import useTableSort from '~/hooks/useTableSort';
import useItems from '~/hooks/useItems';
import useBulkSelect from '~/hooks/useBulkSelect';
import useExpandable from '~/hooks/useExpandable';
import useColumnManager from '~/hooks/useColumnManager';
import useTableView from '~/hooks/useTableView';
import useExport from '~/hooks/useExport';
import useRadioSelect from '~/hooks/useRadioSelect';

import { toToolbarActions } from './helpers';

/**
 *  @typedef {object} useTableToolsReturn
 *
 *  @property {object} toolbarProps Object containing PrimaryToolbar props
 *  @property {object} tableProps   Object containing Patternfly (deprecated) Table props
 */

/**
 * This hook combines several "Table hooks" and returns props for Patternfly (v4) Table components and the FEC PrimaryToolbar
 *
 *  @param   {Array | Function}    items     An array or (async) function that returns an array of items to render or an async function to call with the tableState and serialised table state
 *  @param   {object}              columns   An array of columns to render the items/rows with
 *  @param   {object}              [options] AsyncTableTools options
 *
 *  @returns {useTableToolsReturn}           An object of props meant to be used in the {@link TableToolsTable}
 *
 *  @group Hooks
 *
 */
const useTableTools = (items, options = {}) => {
  const {
    toolbarProps: toolbarPropsOption,
    tableProps: tablePropsOption,
    dedicatedAction,
    actionResolver,
    debug: debugOption,
  } = options;
  const debug = useDebug(debugOption);

  const { loaded, items: usableItems, total } = useItems(items, options);
  const actionResolverEnabled = usableItems?.length > 0;

  const { columns, columnManagerAction, columnManagerModalProps } =
    useColumnManager(options);

  const { toolbarProps: toolbarActionsProps } = useMemo(
    () =>
      toToolbarActions({
        ...options,
        firstAction: dedicatedAction,
        actions: [
          ...(options?.actions || []),
          ...((columnManagerAction && [columnManagerAction]) || []),
        ],
      }),
    [columnManagerAction, options, dedicatedAction],
  );

  const { toolbarProps: paginationToolbarProps } = usePagination({
    ...options,
    total,
  });

  const { toolbarProps: conditionalFilterProps, filterModalProps } =
    useFilterConfig(options);

  const {
    tableProps: expandableTableProps,
    tableView: expandableTableViewOptions,
  } = useExpandable(options);

  const { tableProps: radioSelectTableProps } = useRadioSelect({
    ...options,
    total: usableItems?.length || 0,
  });

  const {
    toolbarProps: bulkSelectToolbarProps,
    tableProps: bulkSelectTableProps,
    tableView: bulkSelectTableViewOptions,
  } = useBulkSelect({
    ...options,
    total,
    itemIdsOnPage: usableItems?.map(({ id }) => id),
  });

  const {
    toolbarProps: tableViewToolbarProps,
    tableProps: tableViewTableProps,
    tableViewToggleProps,
  } = useTableView(usableItems, columns, {
    ...options,
    expandable: expandableTableViewOptions,
    bulkSelect: bulkSelectTableViewOptions,
  });

  const { tableProps: sortableTableProps } = useTableSort(columns, {
    ...options,
    onSelect:
      bulkSelectTableProps?.onSelect ||
      radioSelectTableProps?.onSelect ||
      tablePropsOption?.onSelect,
  });

  const exportConfig = useExport({
    columns,
    ...options,
  });

  const toolbarProps = useMemo(
    () => ({
      ...toolbarActionsProps,
      ...paginationToolbarProps,
      ...conditionalFilterProps,
      ...bulkSelectToolbarProps,
      ...exportConfig.toolbarProps,
      ...toolbarPropsOption,
      ...tableViewToolbarProps,
    }),
    [
      toolbarActionsProps,
      paginationToolbarProps,
      conditionalFilterProps,
      bulkSelectToolbarProps,
      exportConfig?.toolbarProps,
      tableViewToolbarProps,
      toolbarPropsOption,
    ],
  );

  const tableProps = useMemo(
    () => ({
      // TODO we should have a hook that maintains columns.
      // at least the columns manager and table sort hook "act" on columns, currently without a good interface
      cells: columns,
      ...sortableTableProps,
      ...bulkSelectTableProps,
      ...expandableTableProps,
      ...tablePropsOption,
      onSelect: bulkSelectTableProps?.onSelect || tablePropsOption?.onSelect,
      ...radioSelectTableProps,
      actionResolver: actionResolverEnabled && actionResolver,
      ...tableViewTableProps,
    }),
    [
      columns,
      sortableTableProps,
      bulkSelectTableProps,
      tablePropsOption,
      expandableTableProps,
      radioSelectTableProps,
      tableViewTableProps,
      actionResolver,
      actionResolverEnabled,
    ],
  );

  useDeepCompareEffect(() => {
    if (debug) {
      console.group('TableTools props');
      console.log('externalItems', items);
      console.log('externalTotal', total);
      console.log('options', options);
      console.groupEnd();
    }
  }, [items, total, options, debug]);

  useDeepCompareEffect(() => {
    if (debug) {
      console.group('TableTools return props');
      console.log('tableProps', tableProps);
      console.log('toolbarProps', toolbarProps);
      console.groupEnd();
    }
  }, [tableProps, toolbarProps, debug]);

  return {
    loaded,
    toolbarProps,
    tableProps,
    columnManagerModalProps,
    tableViewToggleProps,
    filterModalProps,
  };
};

export default useTableTools;
