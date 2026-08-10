import React, { useMemo } from 'react';

import useTableTools from '~/hooks/useTableTools';

import {
  toDataViewProps,
  getDataViewStateProps,
  toDataViewActions,
  toDataViewExport,
} from '../helpers';

/**
 * Adapter around useTableTools that reshapes its return value for Data View.
 *
 *  @param   {object}         props
 *  @param   {boolean}        [props.loading]
 *  @param   {Array|Function} props.items
 *  @param   {object}         [props.error]
 *  @param   {number}         [props.total]
 *  @param   {Array}          props.columns
 *  @param   {object}         [props.toolbarProps]
 *  @param   {object}         [props.options]
 *  @returns {object}                              Props ready for DataView / DataViewTable / DataViewToolbar
 *
 *  @group Hooks
 */
const useTableToolsForDataView = ({
  loading: externalLoading,
  items: externalItems,
  error: externalError,
  total: externalTotal,
  columns,
  toolbarProps: toolbarPropsProp,
  options = {},
}) => {
  const { loading, tableProps, toolbarProps } = useTableTools(
    externalLoading,
    externalItems,
    externalError,
    externalTotal,
    {
      columns,
      toolbarProps: toolbarPropsProp,
      ...options,
    },
  );

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
        error: externalError,
        rows: dataViewRows,
        columns: dataViewColumns,
        perPage: toolbarProps.pagination?.perPage,
      }),
    [
      loading,
      externalError,
      dataViewRows,
      dataViewColumns,
      toolbarProps.pagination?.perPage,
    ],
  );

  return {
    columns: dataViewColumns,
    rows: dataViewRows,
    activeState,
    headStates,
    bodyStates,
    toolbarProps: {
      pagination: toolbarProps.pagination,
      actions,
    },
  };
};

export default useTableToolsForDataView;
