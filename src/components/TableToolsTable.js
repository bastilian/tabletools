import React from 'react';
import propTypes from 'prop-types';
import { ColumnManagementModal } from '@patternfly/react-component-groups';

import useTableTools from '~/hooks/useTableTools';

import TableStateProvider from './TableStateProvider';
import FilterModal from './FilterModal';
import { variants } from './constants';

const TableToolsTable = ({
  tableToolsTableVariant = 'table',
  loading: externalLoading,
  items: externalItems,
  error: externalError,
  total: externalTotal,
  columns,
  filters,
  options: { treeTable, ...options } = {},
  // TODO I'm not sure if we need this level of customisation.
  // It might actually hurt in the long run. Consider removing until we really have the case where we need this
  toolbarProps: toolbarPropsProp,
  tableHeaderProps,
  tableBodyProps,
  tableToolbarProps,
  paginationProps,
  ...tablePropsRest
}) => {
  const TableComponent = variants[tableToolsTableVariant];
  const {
    toolbarProps,
    filterModalProps,
    columnManagerModalProps,
    ...tableToolsProps
  } = useTableTools(
    externalLoading,
    externalItems,
    externalError,
    externalTotal,
    {
      treeTable,
      filters,
      columns,
      toolbarProps: toolbarPropsProp,
      tableProps: tablePropsRest,
      ...options,
    },
  );

  return (
    <>
      <TableComponent
        {...tableToolsProps}
        toolbarProps={toolbarProps}
        columns={columns}
        treeTable={treeTable}
        tableHeaderProps={tableHeaderProps}
        tableBodyProps={tableBodyProps}
        tableToolbarProps={tableToolbarProps}
        paginationProps={paginationProps}
        error={externalError}
      />

      {columnManagerModalProps && (
        <ColumnManagementModal {...columnManagerModalProps} />
      )}

      {filterModalProps && <FilterModal {...filterModalProps} />}
    </>
  );
};

TableToolsTable.propTypes = {
  tableToolsTableVariant: propTypes.string,
  items: propTypes.oneOfType([propTypes.array, propTypes.func]).isRequired,
  columns: propTypes.arrayOf(
    propTypes.shape({
      title: propTypes.node,
      transforms: propTypes.array,
      sortByProperty: propTypes.string,
      sortByArray: propTypes.array,
      sortByFunction: propTypes.func,
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
 * Wrapper around a table variant and the `useTableTools` hook.
 * Always mounts a {@link TableStateProvider} so table state is available to nested hooks.
 *
 *  @param   {object}             props                          Component Props
 *  @param   {string}             [props.tableToolsTableVariant] Variant key from `variants` (default: `'table'`)
 *  @param   {Array}              props.items                    An array or (async) function that returns an array of items to render or an async function to call with the tableState and serialised table state
 *  @param   {Array}              props.columns                  An array of column objects to render items with
 *  @param   {Array}              [props.filters]                an array of filters
 *  @param   {number}             [props.total]                  Number of total items available
 *  @param   {boolean}            [props.loading]                Custom loading condition
 *  @param   {object}             [props.options]                An object of options that will be passed along to the `useTableTools` hook
 *  @param   {object}             [props.toolbarProps]           Props to be passed on the `PrimaryToolbar` component
 *  @param   {object}             [props.tableHeaderProps]       Props to be passed on the TableHeader component
 *  @param   {object}             [props.tableBodyProps]         Props to be passed on the TableBody component
 *  @param   {object}             [props.tableToolbarProps]      Props to be passed on the TableToolbar (bottom toolbar) component
 *  @param   {object}             [props.paginationProps]        Props to be passed on the Pagination component
 *  @returns {React.ReactElement}                                Selected table variant with shared modals, wrapped in a TableStateProvider
 *
 *  @document ../docs/using-table-tools.md
 *
 *  @group Components
 *
 */
const TableToolsTableWithOrWithoutProvider = (props) => (
  <TableStateProvider>
    <TableToolsTable {...props} />
  </TableStateProvider>
);

export default TableToolsTableWithOrWithoutProvider;
