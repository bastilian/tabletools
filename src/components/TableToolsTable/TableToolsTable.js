import React, { useContext } from 'react';
import propTypes from 'prop-types';
import { Pagination, PaginationVariant } from '@patternfly/react-core';
import {
  Table,
  TableBody,
  TableHeader,
} from '@patternfly/react-table/deprecated';
import {
  SkeletonTable,
  ColumnManagementModal,
} from '@patternfly/react-component-groups';

import PrimaryToolbar from '@redhat-cloud-services/frontend-components/PrimaryToolbar';
import TableToolbar from '@redhat-cloud-services/frontend-components/TableToolbar';

import useTableTools from '~/hooks/useTableTools';
import { TableContext } from '~/hooks/useTableState/constants';
import { TableStateProvider, FilterModal, TableViewToggle } from '~/components';

const TableToolsTable = ({
  loading: externalLoading,
  items: externalItems,
  error: externalError,
  total: externalTotal,
  columns,
  filters,
  options,
  // TODO I'm not sure if we need this level of customisation.
  // It might actually hurt in the long run. Consider removing until we really have the case where we need this
  toolbarProps: toolbarPropsProp,
  tableHeaderProps,
  tableBodyProps,
  tableToolbarProps,
  paginationProps,
  ...tablePropsRest
}) => {
  const {
    loading,
    toolbarProps,
    tableProps,
    filterModalProps,
    columnManagerModalProps,
    tableViewToggleProps,
  } = useTableTools(
    externalLoading,
    externalItems,
    externalError,
    externalTotal,
    {
      debug: true,
      filters,
      columns,
      toolbarProps: toolbarPropsProp,
      tableProps: tablePropsRest,
      ...options,
    },
  );

  return (
    <>
      <PrimaryToolbar aria-label="Table toolbar" {...toolbarProps}>
        {tableViewToggleProps && <TableViewToggle {...tableViewToggleProps} />}
      </PrimaryToolbar>

      {loading ? (
        <SkeletonTable
          rowSize={toolbarProps?.pagination?.perPage || 10}
          // TODO use Th when migrating to PF composable tables
          columns={columns.map(({ title }) => title)}
        />
      ) : (
        <Table {...tableProps}>
          <TableHeader {...tableHeaderProps} />
          <TableBody {...tableBodyProps} />
        </Table>
      )}

      <TableToolbar isFooter {...tableToolbarProps}>
        {toolbarProps.pagination && (
          <Pagination
            aria-label="Pagination-ToolBar"
            variant={PaginationVariant.bottom}
            {...toolbarProps.pagination}
            {...paginationProps}
          />
        )}
      </TableToolbar>

      {columnManagerModalProps && (
        <ColumnManagementModal {...columnManagerModalProps} />
      )}

      {filterModalProps && <FilterModal {...filterModalProps} />}
    </>
  );
};

TableToolsTable.propTypes = {
  items: propTypes.oneOfType([propTypes.array, propTypes.func]).isRequired,
  columns: propTypes.arrayOf(
    propTypes.shape({
      title: propTypes.node,
      transforms: propTypes.array,
      sortByProperty: propTypes.string,
      sortByArray: propTypes.array,
      sortByFunction: propTypes.func,
      renderFunc: propTypes.func,
    }),
  ).isRequired,
  filters: propTypes.object,
  error: propTypes.object,
  total: propTypes.number,
  loading: propTypes.bool,
  options: propTypes.object,
  toolbarProps: propTypes.object,
  tableHeaderProps: propTypes.object,
  tableBodyProps: propTypes.object,
  tableToolbarProps: propTypes.object,
  paginationProps: propTypes.object,
};

/**
 * This component is a wrapper around the Patternfly Table component(s), the FEC PrimaryToolbar and combines them with the `useTableTools` hook
 * If no {@link TableContext}
 *
 *
 *  @param   {object}             props                     Component Props
 *  @param   {Array}              props.items               An array or (async) function that returns an array of items to render or an async function to call with the tableState and serialised table state
 *  @param   {Array}              props.columns             An array of column objects to render items with
 *  @param   {Array}              [props.filters]           an array of filters
 *  @param   {Array}              [props.total]             Number of total items available
 *  @param   {boolean}            [props.loading]           Custom loading condition
 *  @param   {object}             [props.options]           An object of options that will be passed along to the `useTableTools` hook
 *  @param   {object}             [props.toolbarProps]      Props to be passed on the `PrimaryToolbar` component
 *  @param   {object}             [props.tableHeaderProps]  Props to be passed on the TableHeader component
 *  @param   {object}             [props.tableBodyProps]    Props to be passed on the TableBody component
 *  @param   {object}             [props.tableToolbarProps] Props to be passed on the TableToolbar (bottom toolbar) component
 *  @param   {object}             [props.paginationProps]   Props to be passed on the Pagination component
 *  @returns {React.ReactElement}                           Returns a `PrimaryToolbar` component, a Patternfly (v4) `Table` component and a `TableToolbarComponent` wrapped together
 *
 *  @document ../../docs/using-table-tools.md
 *
 *  @group Components
 *
 */
const TableToolsTableWithOrWithoutProvider = (props) => {
  const tableContext = useContext(TableContext);
  const Wrapper = tableContext ? React.Fragment : TableStateProvider;

  return (
    <Wrapper>
      <TableToolsTable {...props} />
    </Wrapper>
  );
};

export default TableToolsTableWithOrWithoutProvider;
