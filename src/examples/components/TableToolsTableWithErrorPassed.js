import React from 'react';

import columns from '~/support/factories/columns';
import filters from '~/support/factories/filters';

import ExamplesTable from './ExamplesTable';

const TableToolsTableWithErrorPassed = () => {
  return (
    <ExamplesTable
      items={undefined}
      error={new Error('Error passed in to table')}
      columns={columns}
      filters={{ filterConfig: filters }}
    />
  );
};

export default TableToolsTableWithErrorPassed;
