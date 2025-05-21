import React from 'react';

import { TableStateProvider } from '~/components';
import columns from '~/support/factories/columns';
import filters from '~/support/factories/filters';

import ExamplesTable from './ExamplesTable';
import useExampleDataQuery from '../hooks/useExampleDataQuery';

const CommonTableToolsTable = () => {
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
        manageColumns: true,
        kind: 'songs',
      }}
    />
  );
};

const CommonTableToolsTableWrapper = (props) => (
  <TableStateProvider>
    <CommonTableToolsTable {...props} />
  </TableStateProvider>
);

export default CommonTableToolsTableWrapper;
