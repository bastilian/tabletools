import React from 'react';
import propTypes from 'prop-types';
import { Pagination, PaginationVariant } from '@patternfly/react-core';
import {
  Table,
  TableBody,
  TableHeader,
} from '@patternfly/react-table/deprecated';
import { SkeletonTable } from '@patternfly/react-component-groups';
import TableToolbar from '@redhat-cloud-services/frontend-components/TableToolbar';

import useTableToolsForDeprecatedTable from './hooks/useTableToolsForDeprecatedTable';
import PrimaryToolbar from './PrimaryToolbar';

/**
 * Deprecated PatternFly Table presentation variant.
 * Owns PrimaryToolbar + table + footer TableToolbar.
 *
 *  @param   {object}             props                        Component props (useTableTools output)
 *  @param   {string}             [props.view]                 Current table view
 *  @param   {boolean}            [props.loading]              Loading state
 *  @param   {object}             [props.treeTable]            Tree table config
 *  @param   {Array}              [props.columns]              Column definitions
 *  @param   {object}             [props.toolbarProps]         Toolbar props from useTableTools
 *  @param   {object}             [props.tableProps]           PatternFly table props from useTableTools
 *  @param   {object}             [props.tableHeaderProps]     Props for TableHeader
 *  @param   {object}             [props.tableBodyProps]       Props for TableBody
 *  @param   {object}             [props.tableViewToggleProps] Props for TableViewToggle
 *  @param   {object}             [props.tableToolbarProps]    Props for footer TableToolbar
 *  @param   {object}             [props.paginationProps]      Props for bottom Pagination
 *  @returns {React.ReactElement}                              Deprecated table with toolbars
 *
 *  @group Components
 */
const DeprecatedTable = (props) => {
  const {
    view,
    loading,
    toolbarProps,
    tableProps,
    treeTable,
    columns,
    tableHeaderProps,
    tableBodyProps,
    tableViewToggleProps,
  } = useTableToolsForDeprecatedTable(props);

  const { tableToolbarProps, paginationProps } = props;

  return (
    <>
      <PrimaryToolbar
        toolbarProps={toolbarProps}
        tableViewToggleProps={tableViewToggleProps}
      />

      {
        // TODO This is a bit hackish. We should rather have an indicator if data necessary for the current view is loading.
        (view === 'rows' || (view === 'tree' && !treeTable)) && loading ? (
          <SkeletonTable
            rowsCount={toolbarProps?.pagination?.perPage || 10}
            // TODO use Th when migrating to PF composable tables
            columns={(columns || tableProps?.cells || []).map(
              ({ title }) => title,
            )}
          />
        ) : (
          <Table aria-label="Table" {...tableProps}>
            <TableHeader {...tableHeaderProps} />
            <TableBody {...tableBodyProps} />
          </Table>
        )
      }

      <TableToolbar isFooter {...tableToolbarProps}>
        {toolbarProps?.pagination && (
          <Pagination
            aria-label="Pagination-ToolBar"
            variant={PaginationVariant.bottom}
            {...toolbarProps.pagination}
            {...paginationProps}
          />
        )}
      </TableToolbar>
    </>
  );
};

DeprecatedTable.propTypes = {
  view: propTypes.string,
  loading: propTypes.bool,
  treeTable: propTypes.object,
  columns: propTypes.array,
  toolbarProps: propTypes.object,
  tableProps: propTypes.object,
  tableHeaderProps: propTypes.object,
  tableBodyProps: propTypes.object,
  tableViewToggleProps: propTypes.object,
  tableToolbarProps: propTypes.object,
  paginationProps: propTypes.object,
};

export default DeprecatedTable;
