import React, { useCallback } from 'react';

import columns from '~/support/factories/columns';
import filters from '~/support/factories/filters';

import ExamplesTable from './ExamplesTable';
import useExampleDataQuery from '../hooks/useExampleDataQuery';

const TableToolsTableWithError = () => {
  const { fetch } = useExampleDataQuery({
    errorToThrow: new Error('Erorr loading items!'),
  });

  return (
    <ExamplesTable
      items={fetch}
      columns={columns}
      filters={{ filterConfig: filters }}
    />
  );
};

export default TableToolsTableWithError;
