import React from 'react';
import propTypes from 'prop-types';
import {
  DataView,
  DataViewTable as PatternFlyDataViewTable,
  DataViewToolbar,
} from '@patternfly/react-data-view';
import { Pagination, PaginationVariant } from '@patternfly/react-core';

import { TableStateProvider } from '~/components';

import useTableToolsForDataView from './hooks/useTableToolsForDataView';

/**
 * DataView-based variant of TableToolsTable.
 * Reuses useTableTools (via useTableToolsForDataView) and renders PatternFly Data View.
 *
 *  @param   {object}             props           Component props
 *  @param   {Array|Function}     props.items     Items array or async fetch function
 *  @param   {Array}              props.columns   TableTools column definitions
 *  @param   {boolean}            [props.loading] External loading flag
 *  @param   {object}             [props.error]   External error
 *  @param   {number}             [props.total]   External total count
 *  @param   {object}             [props.options] Options passed to useTableTools
 *  @returns {React.ReactElement}                 DataView table
 *
 *  @group Components
 */
const DataViewTable = ({
  loading,
  items,
  error,
  total,
  columns,
  toolbarProps,
  options,
  ...rest
}) => {
  const {
    columns: dataViewColumns,
    rows: dataViewRows,
    activeState,
    headStates,
    bodyStates,
    toolbarProps: { pagination, actions } = {},
  } = useTableToolsForDataView({
    loading,
    items,
    error,
    total,
    columns,
    toolbarProps,
    options,
  });

  return (
    <DataView activeState={activeState}>
      <DataViewToolbar
        pagination={pagination && <Pagination isCompact {...pagination} />}
        actions={actions}
        ouiaId="data-view-table-toolbar"
      />
      <PatternFlyDataViewTable
        aria-label="Table"
        columns={dataViewColumns}
        rows={dataViewRows}
        headStates={headStates}
        bodyStates={bodyStates}
        {...rest}
      />
      <DataViewToolbar
        pagination={
          pagination && (
            <Pagination variant={PaginationVariant.bottom} {...pagination} />
          )
        }
      />
    </DataView>
  );
};

DataViewTable.propTypes = {
  items: propTypes.oneOfType([propTypes.array, propTypes.func]).isRequired,
  columns: propTypes.array.isRequired,
  loading: propTypes.bool,
  error: propTypes.object,
  total: propTypes.number,
  toolbarProps: propTypes.object,
  options: propTypes.object,
};

const DataViewTableWithProvider = (props) => (
  <TableStateProvider>
    <DataViewTable {...props} />
  </TableStateProvider>
);

export default DataViewTableWithProvider;
