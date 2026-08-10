import React from 'react';
import propTypes from 'prop-types';
import {
  DataView,
  DataViewTable as PatternFlyDataViewTable,
  DataViewToolbar,
} from '@patternfly/react-data-view';
import { Pagination, PaginationVariant } from '@patternfly/react-core';

import useTableToolsForDataView from './hooks/useTableToolsForDataView';

/**
 * Data View presentation variant.
 *
 *  @param   {object}             props                Component props (useTableTools output)
 *  @param   {boolean}            [props.loading]      Loading state
 *  @param   {object}             [props.error]        Error state
 *  @param   {object}             [props.tableProps]   PatternFly table props from useTableTools
 *  @param   {object}             [props.toolbarProps] Toolbar props from useTableTools
 *
 *  @group Components
 *  @returns {React.ReactElement}                      DataView table
 */
const DataViewTable = (props) => {
  const {
    columns: dataViewColumns,
    rows: dataViewRows,
    activeState,
    headStates,
    bodyStates,
    toolbarProps: { pagination, actions } = {},
  } = useTableToolsForDataView(props);

  return (
    <DataView activeState={activeState}>
      <DataViewToolbar
        pagination={pagination && <Pagination isCompact {...pagination} />}
        actions={actions}
        ouiaId="data-view-table-toolbar"
      />
      <PatternFlyDataViewTable
        aria-label="DataViewTable"
        columns={dataViewColumns}
        rows={dataViewRows}
        headStates={headStates}
        bodyStates={bodyStates}
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
  loading: propTypes.bool,
  error: propTypes.object,
  tableProps: propTypes.object,
  toolbarProps: propTypes.object,
};

export default DataViewTable;
