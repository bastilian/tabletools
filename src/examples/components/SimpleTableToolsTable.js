import React from 'react';

import { TableStateProvider } from '~/components';
import { title, artist } from '~/support/factories/columns';

import ExamplesTable from './ExamplesTable';
import useExampleDataQuery from '../hooks/useExampleDataQuery';

const SimpleTableToolsTable = () => {
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
      columns={[
        { ...title, sortable: undefined },
        { ...artist, sortable: undefined },
      ]}
    />
  );
};

const SimpleTableToolsTableWrapper = (props) => (
  <TableStateProvider>
    <SimpleTableToolsTable {...props} />
  </TableStateProvider>
);

export default SimpleTableToolsTableWrapper;
