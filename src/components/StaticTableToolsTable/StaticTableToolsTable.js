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
 *  @param   {React.ReactElement} [props.options] Additonal TableToolsTable options
 *
 *  @returns {React.ReactElement}                 Static table tools table
 *
 *  @group Components
 *
 */
const StaticTableToolsTable = ({ items, options, ...props }) => {
  const queriedItems = useCallback(
    async ({ filters, pagination, sort } = {}) => [
      await queryItems(items, { filters, ...pagination, sort }),
      items.length,
    ],
    [items],
  );

  return (
    <TableToolsTable
      items={queriedItems}
      options={{
        ...options,
        serialisers: {
          pagination: paginationSerialiser,
          sort: sortSerialiser,
          filters: filtersSerialiser,
        },
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
