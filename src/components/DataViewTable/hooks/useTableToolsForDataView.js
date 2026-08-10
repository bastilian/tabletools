import React, { useMemo } from 'react';

import {
  toDataViewProps,
  getDataViewStateProps,
  toDataViewActions,
  toDataViewExport,
} from '../helpers';

/**
 * Adapter: reshape useTableTools output for PatternFly Data View.
 *
 *  @param   {object}  tableToolsProps                Output from useTableTools (plus extras from parent)
 *  @param   {boolean} [tableToolsProps.loading]      Loading state
 *  @param   {object}  [tableToolsProps.error]        Error state
 *  @param   {object}  [tableToolsProps.tableProps]   PatternFly table props from useTableTools
 *  @param   {object}  [tableToolsProps.toolbarProps] Toolbar props from useTableTools
 *  @returns {object}                                 Props ready for DataView / DataViewTable / DataViewToolbar
 *
 *  @group Hooks
 */
const useTableToolsForDataView = ({
  loading,
  error,
  tableProps,
  toolbarProps = {},
}) => {
  const actions = useMemo(() => {
    const actionNodes = toDataViewActions(toolbarProps.actionsConfig?.actions);
    const exportNode = toDataViewExport(toolbarProps.exportConfig);

    if (!actionNodes.length && !exportNode) {
      return undefined;
    }

    return (
      <>
        {actionNodes}
        {exportNode}
      </>
    );
  }, [toolbarProps.actionsConfig?.actions, toolbarProps.exportConfig]);

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
        perPage: toolbarProps.pagination?.perPage,
      }),
    [
      loading,
      error,
      dataViewRows,
      dataViewColumns,
      toolbarProps.pagination?.perPage,
    ],
  );

  return useMemo(
    () => ({
      columns: dataViewColumns,
      rows: dataViewRows,
      activeState,
      headStates,
      bodyStates,
      toolbarProps: {
        pagination: toolbarProps.pagination,
        actions,
      },
    }),
    [
      dataViewColumns,
      dataViewRows,
      activeState,
      headStates,
      bodyStates,
      toolbarProps.pagination,
      actions,
    ],
  );
};

export default useTableToolsForDataView;
