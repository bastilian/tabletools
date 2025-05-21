import React from 'react';

import { TableStateProvider } from '~/components';
import columns from '~/support/factories/columns';
import { useFullTableState } from '~/hooks';

import ExamplesTable from './ExamplesTable';
import NumberFilter from './NumberFilter';

import useExampleDataQuery from '../hooks/useExampleDataQuery';

const customNumberFilterType = {
  Component: NumberFilter,
  chips: (value) => [value],
  selectValue: (value) => [value, true],
  deselectValue: () => [undefined, true],
};

const customNumberFilter = {
  type: 'number',
  label: 'Number Filter',
  filterAttribute: 'rating',
};

const TableToolsTableWithCustomFilter = () => {
  const { tableState: { tableView } = {} } = useFullTableState() || {};

  const {
    result: { data, meta: { total } = {} } = {},
    error,
    loading,
    exporter,
  } = useExampleDataQuery({
    ...(tableView === 'tree'
      ? { params: { limit: 'max', sort: 'id:asc' } }
      : {}),
  });

  return (
    <ExamplesTable
      loading={loading}
      items={data}
      error={error}
      total={total}
      columns={columns}
      filters={{
        filterConfig: [customNumberFilter],
        customFilterTypes: {
          number: customNumberFilterType,
        },
      }}
      options={{
        exporter,
      }}
    />
  );
};

const TableToolsTableWithCustomFilterWrapper = (props) => (
  <TableStateProvider>
    <TableToolsTableWithCustomFilter {...props} />
  </TableStateProvider>
);

export default TableToolsTableWithCustomFilterWrapper;
