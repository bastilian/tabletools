import { useMemo } from 'react';

import { toSortTableProps } from '../../DeprecatedTable/helpers/toSortTableProps';
import { toTableViewTableProps } from '../../DeprecatedTable/helpers/toTableViewTableProps';
import { toDataViewProps, getDataViewStateProps } from '../helpers';

/**
 * Adapter: assemble useTableTools building blocks into PatternFly Data View props
 *
 *  @param   {object}   tableToolsProps                    Output from useTableTools (plus extras from parent)
 *  @param   {boolean}  [tableToolsProps.loading]          Loading state
 *  @param   {object}   [tableToolsProps.error]            Error state
 *  @param   {Array}    [tableToolsProps.columns]          Managed column definitions
 *  @param   {object}   [tableToolsProps.tablePropsOption] Consumer table props from options
 *  @param   {object}   [tableToolsProps.dedicatedAction]  Primary/dedicated toolbar action
 *  @param   {Array}    [tableToolsProps.toolbarActions]   Toolbar actions
 *  @param   {object}   [tableToolsProps.columnManager]    Column manager props
 *  @param   {object}   [tableToolsProps.pagination]       Pagination props
 *  @param   {object}   [tableToolsProps.tableSort]        Sort props
 *  @param   {object}   [tableToolsProps.tableView]        Table view props
 *  @param   {boolean}  [tableToolsProps.exportIsDisabled] Whether export is disabled
 *  @param   {Function} [tableToolsProps.exportWithFormat] Export runner
 *  @returns {object}                                      Props ready for DataViewTable
 *
 *  @group Hooks
 */
const useTableToolsForDataView = ({
  loading,
  error,
  columns,
  tablePropsOption,
  dedicatedAction,
  toolbarActions,
  columnManager,
  pagination,
  tableSort,
  tableView,
  exportIsDisabled,
  exportWithFormat,
}) => {
  const toolbarProps = useMemo(() => {
    return {
      pagination,
      actions: {
        dedicatedAction,
        toolbarActions,
      },
      export: {
        isDisabled: exportIsDisabled,
        exportWithFormat,
      },
      columnManager,
    };
  }, [
    pagination,
    dedicatedAction,
    toolbarActions,
    exportIsDisabled,
    exportWithFormat,
    columnManager,
  ]);

  const sortableTableProps = useMemo(
    () => toSortTableProps(tableSort),
    [tableSort],
  );

  const tableViewTableProps = useMemo(
    () => toTableViewTableProps(tableView),
    [tableView],
  );

  const tableProps = useMemo(
    () => ({
      cells: columns,
      ...sortableTableProps,
      ...tablePropsOption,
      ...tableViewTableProps,
    }),
    [columns, sortableTableProps, tablePropsOption, tableViewTableProps],
  );

  const { columns: dataViewColumns, rows: dataViewRows } = useMemo(
    () => toDataViewProps(tableProps),
    [tableProps],
  );

  const { activeState, headStates, bodyStates } = useMemo(
    () =>
      getDataViewStateProps({
        loading,
        error,
        rows: dataViewRows,
        columns: dataViewColumns,
        perPage: pagination?.perPage,
      }),
    [loading, error, dataViewRows, dataViewColumns, pagination?.perPage],
  );

  return useMemo(
    () => ({
      columns: dataViewColumns,
      rows: dataViewRows,
      activeState,
      headStates,
      bodyStates,
      toolbarProps,
    }),
    [
      dataViewColumns,
      dataViewRows,
      activeState,
      headStates,
      bodyStates,
      toolbarProps,
    ],
  );
};

export default useTableToolsForDataView;
