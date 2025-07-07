import React, { useCallback } from 'react';
import propTypes from 'prop-types';

import TableToolsTable from '../TableToolsTable';

import paginationSerialiser from './helpers/serialisers/pagination';
import sortSerialiser from './helpers/serialisers/sort';
import filtersSerialiser from './helpers/serialisers/filters';
import queryItems from './helpers/jsonQueryHelpers';

/**
 * This component provides a TableToolsTable component prepared to filter, sort and paginate an array of items passed in via [jsonquery](https://jsonquerylang.org/)
 *
 *  @param   {object}             [props]         Component Props
 *  @param   {React.ReactElement} [props.items]   Array of items to filter, sort and paginate and show in the table
 *  @param   {React.ReactElement} [props.options] Additional TableToolsTable options
 *
 *  @returns {React.ReactElement}                 Static table tools table
 *
 *  @document ../../docs/using-static-tabletoolstable.md
 *
 *  @group Components
 *
 */
const StaticTableToolsTable = ({
  items,
  options: { onSelect, enableExport, ...options } = {},
  ...props
}) => {
  const queriedItems = useCallback(
    async ({ filters, pagination, sort } = {}) =>
      await queryItems(items, {
        filters,
        ...pagination,
        sort,
      }),
    [items],
  );

  const queryAll = useCallback(
    async ({ filters, sort } = {}) =>
      await queryItems(items, {
        filters,
        sort,
        offset: 0,
        limit: 'max',
      }),
    [items],
  );

  return (
    <TableToolsTable
      items={queriedItems}
      options={{
        serialisers: {
          pagination: paginationSerialiser,
          sort: sortSerialiser,
          filters: filtersSerialiser,
        },
        ...(enableExport
          ? {
              exporter: async (serialisedTableState) =>
                (await queryAll(serialisedTableState))[0],
            }
          : {}),
        ...(onSelect
          ? {
              itemIdsInTable: async (serialisedTableState) =>
                (await queryAll(serialisedTableState))[0].map(({ id }) => id),
              onSelect,
            }
          : {}),
        ...options,
      }}
      {...props}
    />
  );
};

StaticTableToolsTable.propTypes = {
  items: propTypes.array,
  options: propTypes.object,
};

export default StaticTableToolsTable;
