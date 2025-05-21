import React from 'react';

import { TableStateProvider } from '~/components';
import columns from '~/support/factories/columns';
import filters from '~/support/factories/filters';

import ExamplesTable from './ExamplesTable';
import useExampleDataQuery from '../hooks/useExampleDataQuery';

export const emptyRows = (_kind, colSpan) => [
  {
    cells: [
      {
        title: () => <>Custom emptyRows</>, // eslint-disable-line react/display-name
        props: {
          colSpan,
        },
      },
    ],
  },
];

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
        emptyRows: emptyRows(2),
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
