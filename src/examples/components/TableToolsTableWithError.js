import React, { useCallback } from 'react';

import columns from '~/support/factories/columns';
import filters from '~/support/factories/filters';

import ExamplesTable from './ExamplesTable';

const TableToolsTableWithError = () => {
  const failingFetchItems = useCallback(async () => {
    throw 'Erorr loading items!';
  }, []);

  return (
    <ExamplesTable
      items={failingFetchItems}
      columns={columns}
      filters={{ filterConfig: filters }}
    />
  );
};

export default TableToolsTableWithError;
