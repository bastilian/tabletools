import { useEffect } from 'react';

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
 *  @property {string}           [view]                    Current table view
 *  @property {boolean}          loading                   Loading state
 *  @property {Array}            columns                   Managed column definitions
 *  @property {object}           [tableViewToggleProps]    Props for TableViewToggle
 *  @property {object}           [filterModalProps]        Props for FilterModal
 *  @property {object}           [columnManagerModalProps] Props for ColumnManagementModal
 *  @property {object}           [toolbarPropsOption]      Consumer toolbar props from options
 *  @property {object}           [tablePropsOption]        Consumer table props from options
 *  @property {Function|boolean} [actionResolver]          Row action resolver when enabled
 *  @property {object}           [dedicatedAction]         Primary/dedicated toolbar action
 *  @property {Array}            [toolbarActions]          Toolbar actions
 *  @property {object}           [pagination]              Pagination props
 *  @property {object}           [conditionalFilterProps]  Filter toolbar slice
 *  @property {object}           [bulkSelectToolbarProps]  Bulk-select toolbar slice
 *  @property {object}           [bulkSelectTableProps]    Bulk-select table slice
 *  @property {object}           [expandableTableProps]    Expandable table slice
 *  @property {object}           [radioSelectTableProps]   Radio-select table slice
 *  @property {object}           [sortableTableProps]      Sort table slice
 *  @property {object}           [tableViewToolbarProps]   Table-view toolbar slice
 *  @property {object}           [tableViewTableProps]     Table-view table slice
 *  @property {boolean}          [exportIsDisabled]        Whether export is disabled
 *  @property {Function}         [exportWithFormat]        Export runner
 */

/**
 * Combines table feature hooks and returns building-block props.
 *
 *  @param   {boolean}             externalLoading External loading flag
 *  @param   {Array|Function}      externalItems   Items array or async fetch function
 *  @param   {object}              externalError   External error
 *  @param   {number}              externalTotal   External total count
 *  @param   {object}              [options]       AsyncTableTools options
 *
 *  @returns {useTableToolsReturn}                 Building blocks for variant adapters
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
    options,
  );
  // TODO investigate and maybe refactor
  const actionResolverEnabled = items?.length > 0;

  const { columns, columnManagerAction, columnManagerModalProps } =
    useColumnManager(options);

  const { dedicatedAction, actions: toolbarActions } = useToolbarActions(
    options,
    columnManagerAction,
  );

  const pagination = usePagination({
    ...options,
    total,
  });

  const { toolbarProps: conditionalFilterProps, filterModalProps } =
    useFilterConfig(options);

  const {
    tableProps: expandableTableProps,
    tableView: expandableTableViewOptions,
  } = useExpandable({ ...options, items });

  const { tableProps: radioSelectTableProps } = useRadioSelect({
    ...options,
    total: items?.length || 0,
  });

  const identifier = options.identifier || 'itemId';
  const {
    toolbarProps: bulkSelectToolbarProps,
    tableProps: bulkSelectTableProps,
    tableView: bulkSelectTableViewOptions,
  } = useBulkSelect({
    ...options,
    total,
    itemIdsOnPage: items?.map((item) => item[identifier]),
  });

  const {
    view,
    toolbarProps: tableViewToolbarProps,
    tableProps: tableViewTableProps,
    tableViewToggleProps,
  } = useTableView(loading, items, error, total, {
    ...options,
    columns,
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

  const { isDisabled: exportIsDisabled, exportWithFormat } = useExport({
    columns,
    ...options,
  });

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
      console.group('TableTools data states');
      console.log('loading', loading);
      console.log('items', items);
      console.log('error', error);
      console.log('total', total);
      console.groupEnd();
    }
  }, [debug, loading, items, error, total]);

  return {
    view,
    loading,
    columns,
    tableViewToggleProps,
    filterModalProps,
    columnManagerModalProps,
    toolbarPropsOption,
    tablePropsOption,
    actionResolver: actionResolverEnabled && actionResolver,
    dedicatedAction,
    toolbarActions,
    pagination,
    conditionalFilterProps,
    bulkSelectToolbarProps,
    bulkSelectTableProps,
    expandableTableProps,
    radioSelectTableProps,
    sortableTableProps,
    tableViewToolbarProps,
    tableViewTableProps,
    exportIsDisabled,
    exportWithFormat,
  };
};

export default useTableTools;
