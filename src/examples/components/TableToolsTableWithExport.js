import React from 'react';

import { TableStateProvider } from '~/components';
import columns from '~/support/factories/columns';
import filters from '~/support/factories/filters';

import ExamplesTable from './ExamplesTable';
import DetailsRow from './DetailsRow';

import useExampleDataQuery from '../hooks/useExampleDataQuery';

const TableToolsTableWithExport = () => {
  const {
    result: { data, meta: { total } = {} } = {},
    error,
    loading,
    exporter,
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
        detailsComponent: DetailsRow,
        exporter,
      }}
    />
  );
};

const TableToolsTableWithExportWrapper = (props) => (
  <TableStateProvider>
    <TableToolsTableWithExport {...props} />
  </TableStateProvider>
);

export default TableToolsTableWithExportWrapper;
