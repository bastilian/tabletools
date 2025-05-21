import React from 'react';

import { TableStateProvider } from '~/components';
import { title, artist } from '~/support/factories/columns';
import { titleOrArtist } from '~/support/factories/filters';

import ExamplesTable from './ExamplesTable';
import useExampleDataQuery from '../hooks/useExampleDataQuery';

const SimpleTableToolsTableFiltered = () => {
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
      filters={{ filterConfig: [titleOrArtist] }}
    />
  );
};

const SimpleTableToolsTableFilteredWrapper = (props) => (
  <TableStateProvider>
    <SimpleTableToolsTableFiltered {...props} />
  </TableStateProvider>
);

export default SimpleTableToolsTableFilteredWrapper;
