import React from 'react';

import { TableStateProvider } from '~/components';
import columns from '~/support/factories/columns';
import filters from '~/support/factories/filters';

import ExamplesTable from './ExamplesTable';
import CustomEmptyState from './CustomEmptyState';
import useExampleDataQuery from '../hooks/useExampleDataQuery';

const SimpleTableToolsTableWithCustomEmptyRows = () => {
  const {
    result: { data, meta: { total } = {} } = {},
    loading,
    error,
  } = useExampleDataQuery();

  return (
    <ExamplesTable
      loading={loading}
      items={data}
      error={error}
      total={total}
      columns={columns}
      filters={{ filterConfig: filters }}
      options={{
        kind: 'songs',
        EmptyState: CustomEmptyState,
      }}
    />
  );
};

const SimpleTableToolsTableWithCustomEmptyRowsWrapper = (props) => (
  <TableStateProvider>
    <SimpleTableToolsTableWithCustomEmptyRows {...props} />
  </TableStateProvider>
);

export default SimpleTableToolsTableWithCustomEmptyRowsWrapper;
