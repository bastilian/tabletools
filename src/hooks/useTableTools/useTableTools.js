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
 *  @property {object}           [tableView]               Table view props
 *  @property {object}           [columnManagerModalProps] Props for ColumnManagementModal
 *  @property {object}           [toolbarPropsOption]      Consumer toolbar props from options
 *  @property {object}           [tablePropsOption]        Consumer table props from options
 *  @property {Function|boolean} [actionResolver]          Row action resolver when enabled
 *  @property {object}           [dedicatedAction]         Primary/dedicated toolbar action
 *  @property {Array}            [toolbarActions]          Toolbar actions
 *  @property {object}           [pagination]              Pagination props
 *  @property {object}           [conditionalFilterProps]  Filter toolbar slice
 *  @property {object}           [bulkSelect]              Bulk select props
 *  @property {object}           [expandable]              Expandable props
 *  @property {object}           [radioSelect]             Radio-select props
 *  @property {object}           [tableSort]               Sort props
 *  @property {object}           [filterModalProps]        Props for FilterModal
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

  const { filterModalProps, ...filters } = useFilterConfig(options);

  const expandable = useExpandable({ ...options, items });

  const radioSelect = useRadioSelect({
    ...options,
    total: items?.length || 0,
  });

  const identifier = options.identifier || 'itemId';
  const bulkSelect = useBulkSelect({
    ...options,
    total,
    itemIdsOnPage: items?.map((item) => item[identifier]),
  });

  const tableView = useTableView(loading, items, error, total, {
    ...options,
    columns,
    expandable,
    bulkSelect,
  });

  const tableSort = useTableSort(columns, {
    ...options,
    onSelect:
      bulkSelect?.selectOne ||
      radioSelect?.onRadioSelect ||
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
    view: tableView.view,
    loading,
    columns,
    filterModalProps,
    columnManagerModalProps,
    toolbarPropsOption,
    tablePropsOption,
    actionResolver: actionResolverEnabled && actionResolver,
    dedicatedAction,
    toolbarActions,
    pagination,
    filters,
    bulkSelect,
    expandable,
    radioSelect,
    tableSort,
    tableView,
    exportIsDisabled,
    exportWithFormat,
  };
};

export default useTableTools;
