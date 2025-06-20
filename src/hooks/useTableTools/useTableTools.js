import { useMemo } from 'react';

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
const useTableTools = (loading, items, error, total, columns, options = {}) => {
  const {
    toolbarProps: toolbarPropsOption,
    tableProps: tablePropsOption,
    dedicatedAction,
    actionResolver,
  } = options;
  const {
    loading: itemsLoading,
    error: itemsError,
    items: itemsItems,
    total: itemsTotal,
  } = useItems({ loading, items, error, total });
  const actionResolverEnabled = itemsItems?.length > 0;

  const {
    columnManagerAction,
    columns: managedColumns,
    ColumnManager,
  } = useColumnManager(columns, options);

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
    [columnManagerAction, options, dedicatedAction]
  );

  const { toolbarProps: paginationToolbarProps } = usePagination({
    ...options,
    total: itemsTotal,
  });

  const { toolbarProps: conditionalFilterProps, filterModalProps } =
    useFilterConfig(options);

  const {
    tableProps: expandableTableProps,
    tableView: expandableTableViewOptions,
  } = useExpandable(options);

  const { tableProps: radioSelectTableProps } = useRadioSelect({
    ...options,
    total: itemsItems?.length || 0,
  });

  const {
    toolbarProps: bulkSelectToolbarProps,
    tableProps: bulkSelectTableProps,
    tableView: bulkSelectTableViewOptions,
  } = useBulkSelect({
    ...options,
    total,
    itemIdsOnPage: itemsItems?.map(({ id }) => id),
  });

  const {
    toolbarProps: tableViewToolbarProps,
    tableProps: tableViewTableProps,
    TableViewToggle,
  } = useTableView(itemsLoading, itemsItems, itemsError, managedColumns, {
    ...options,
    expandable: expandableTableViewOptions,
    bulkSelect: bulkSelectTableViewOptions,
  });

  const { tableProps: sortableTableProps } = useTableSort(managedColumns, {
    ...options,
    onSelect:
      bulkSelectTableProps?.onSelect ||
      radioSelectTableProps?.onSelect ||
      tablePropsOption?.onSelect,
  });

  const exportConfig = useExport({
    columns: managedColumns,
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
    ]
  );

  const tableProps = useMemo(
    () => ({
      // TODO we should have a hook that maintains columns.
      // at least the columns manager and table sort hook "act" on columns, currently without a good interface
      cells: managedColumns,
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
      managedColumns,
      sortableTableProps,
      bulkSelectTableProps,
      tablePropsOption,
      expandableTableProps,
      radioSelectTableProps,
      tableViewTableProps,
      actionResolver,
      actionResolverEnabled,
    ]
  );

  return {
    loading: itemsLoading,
    toolbarProps,
    tableProps,
    // TODO We could possibly just return the configuratin/props for these components instead
    ColumnManager,
    TableViewToggle,
    filterModalProps,
  };
};

export default useTableTools;
