import React from 'react';

import columns from '~/support/factories/columns';
import filters from '~/support/factories/filters';

import ExamplesTable from './ExamplesTable';
import useExampleDataQuery from '../hooks/useExampleDataQuery';

const TableToolsTableWithErrorPassed = () => {
  const {
    result: { data, meta: { total } = {} } = {},
    error,
    loading,
  } = useExampleDataQuery({
    errorToThrow: new Error('Error passed in to table'),
  });

  return (
    <ExamplesTable
      loading={loading}
      items={data}
      error={error}
      total={total}
      columns={columns}
      filters={{ filterConfig: filters }}
    />
  );
};

export default TableToolsTableWithErrorPassed;
