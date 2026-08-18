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
import PrimaryToolbar from '../PrimaryToolbar/PrimaryToolbar';

/**
 * Deprecated PatternFly Table presentation variant.
 * Owns PrimaryToolbar + table + footer TableToolbar.
 *
 *  @param   {object}             props                     Building blocks from useTableTools plus presentation extras
 *  @param   {object}             [props.tableToolbarProps] Props for footer TableToolbar
 *  @param   {object}             [props.paginationProps]   Props for bottom Pagination
 *  @returns {React.ReactElement}                           Deprecated table with toolbars
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

  // TODO We should find a better more organised way to pass props for specific components in a "variant"
  const { tableToolbarProps, paginationProps, variantProps } = props;
  const { enablePrimaryToolbar = true } = variantProps || {};

  return (
    <>
      {enablePrimaryToolbar && (
        <PrimaryToolbar
          toolbarProps={toolbarProps}
          tableViewToggleProps={tableViewToggleProps}
        />
      )}

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
  tableHeaderProps: propTypes.object,
  tableBodyProps: propTypes.object,
  tableViewToggleProps: propTypes.object,
  tableToolbarProps: propTypes.object,
  paginationProps: propTypes.object,
  toolbarPropsOption: propTypes.object,
  tablePropsOption: propTypes.object,
  actionResolver: propTypes.oneOfType([propTypes.func, propTypes.bool]),
  dedicatedAction: propTypes.elementType,
  toolbarActions: propTypes.array,
  pagination: propTypes.object,
  conditionalFilterProps: propTypes.object,
  bulkSelectToolbarProps: propTypes.object,
  bulkSelectTableProps: propTypes.object,
  expandableTableProps: propTypes.object,
  radioSelect: propTypes.object,
  sortableTableProps: propTypes.object,
  tableViewToolbarProps: propTypes.object,
  tableViewTableProps: propTypes.object,
  exportIsDisabled: propTypes.bool,
  exportWithFormat: propTypes.func,
  variantProps: propTypes.object,
};

export default DeprecatedTable;
