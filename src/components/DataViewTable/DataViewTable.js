import React from 'react';
import propTypes from 'prop-types';
import {
  DataView,
  DataViewTable as PatternFlyDataViewTable,
} from '@patternfly/react-data-view';
import DataViewToolbar from '../DataViewToolbar/DataViewToolbar';
import { PaginationVariant } from '@patternfly/react-core';

import useTableToolsForDataView from './hooks/useTableToolsForDataView';

/**
 * Data View presentation variant
 *
 *  @param   {object}             props                    Component props (useTableTools building blocks)
 *  @param   {boolean}            [props.loading]          Loading state
 *  @param   {object}             [props.error]            Error state
 *  @param   {Array}              [props.columns]          Managed column definitions
 *  @param   {object}             [props.pagination]       Pagination props
 *  @param   {object}             [props.tableSort]        Sort props
 *  @param   {object}             [props.tableView]        Table view props
 *  @param   {object}             [props.dedicatedAction]  Primary toolbar action
 *  @param   {Array}              [props.toolbarActions]   Toolbar actions
 *  @param   {boolean}            [props.exportIsDisabled] Whether export is disabled
 *  @param   {Function}           [props.exportWithFormat] Export runner
 *
 *  @group Components
 *  @returns {React.ReactElement}                          DataView table
 */
const DataViewTable = (props) => {
  const {
    columns: dataViewColumns,
    rows: dataViewRows,
    activeState,
    headStates,
    bodyStates,
    toolbarProps,
  } = useTableToolsForDataView(props);

  return (
    <DataView activeState={activeState}>
      <DataViewToolbar toolbarProps={toolbarProps} />
      <PatternFlyDataViewTable
        aria-label="DataViewTable"
        columns={dataViewColumns}
        rows={dataViewRows}
        headStates={headStates}
        bodyStates={bodyStates}
      />
      <DataViewToolbar
        toolbarProps={toolbarProps}
        variant={PaginationVariant.bottom}
      />
    </DataView>
  );
};

DataViewTable.propTypes = {
  loading: propTypes.bool,
  error: propTypes.object,
  columns: propTypes.array,
  tablePropsOption: propTypes.object,
  dedicatedAction: propTypes.elementType,
  toolbarActions: propTypes.array,
  pagination: propTypes.object,
  tableSort: propTypes.object,
  tableView: propTypes.object,
  exportIsDisabled: propTypes.bool,
  exportWithFormat: propTypes.func,
};

export default DataViewTable;
