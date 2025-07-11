import { useEffect, useMemo } from 'react';

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
import useToolbarActions from '~/hooks/useToolbarActions';

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
const useTableTools = (
  externalLoading,
  externalItems,
  externalError,
  externalTotal,
  options = {},
) => {
  const {
    toolbarProps: toolbarPropsOption,
    tableProps: tablePropsOption,
    actionResolver,
    debug: debugOption,
  } = options;

  const debug = useDebug(debugOption);

  const { loading, items, error, total } = useItems(
    externalLoading,
    externalItems,
    externalError,
    externalTotal,
  );
  // TODO investigate and maybe refactor
  const actionResolverEnabled = items?.length > 0;

  const { columns, columnManagerAction, columnManagerModalProps } =
    useColumnManager(options);

  const { toolbarProps: toolbarActionsProps } = useToolbarActions(
    options,
    columnManagerAction,
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
    total: items?.length || 0,
  });

  const {
    toolbarProps: bulkSelectToolbarProps,
    tableProps: bulkSelectTableProps,
    tableView: bulkSelectTableViewOptions,
  } = useBulkSelect({
    ...options,
    total,
    itemIdsOnPage: items?.map(({ id }) => id),
  });

  const {
    view,
    toolbarProps: tableViewToolbarProps,
    tableProps: tableViewTableProps,
    tableViewToggleProps,
  } = useTableView(loading, items, error, total, {
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

  useEffect(() => {
    if (debug) {
      console.group('TableTools props');
      console.log('externalLoading', externalLoading);
      console.log('externalItems', externalItems);
      console.log('externalError', externalError);
      console.log('externalTotal', externalTotal);
      console.log('options', options);
      console.groupEnd();
    }
  }, [
    externalLoading,
    externalItems,
    externalError,
    externalTotal,
    options,
    debug,
  ]);

  useEffect(() => {
    if (debug) {
      console.group('TableTools return props');
      console.log('view', view);
      console.log('tableProps', tableProps);
      console.log('toolbarProps', toolbarProps);
      console.groupEnd();
    }
  }, [tableProps, toolbarProps, debug, view]);

  return {
    view,
    loading,
    toolbarProps,
    tableProps,
    columnManagerModalProps,
    tableViewToggleProps,
    filterModalProps,
  };
};

export default useTableTools;
