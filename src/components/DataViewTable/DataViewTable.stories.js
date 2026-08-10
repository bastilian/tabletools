import React from 'react';
import defaultStoryMeta from '~/support/defaultStoryMeta';
import columns from '~/support/factories/columns';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TableStateProvider, TableToolsTable } from '~/components';
import useExampleDataQuery from '~/support/hooks/useExampleDataQuery';
import paginationSerialiser from '~/components/StaticTableToolsTable/helpers/serialisers/pagination';
import sortSerialiser from '~/components/StaticTableToolsTable/helpers/serialisers/sort';
import { actions } from '~/support/constants';

const meta = {
  title: 'DataViewTable',
  component: TableToolsTable,
  ...defaultStoryMeta,
};

export default meta;

const queryClient = new QueryClient();

const defaultOptions = {
  serialisers: {
    pagination: paginationSerialiser,
    sort: sortSerialiser,
  },
};

const CommonExample = () => {
  const {
    loading,
    result: { data, meta: { total } = {} } = {},
    error,
    exporter,
  } = useExampleDataQuery({
    endpoint: '/api',
    useTableState: true,
  });

  return (
    <TableToolsTable
      tableToolsTableVariant="dataViewTable"
      items={data}
      columns={columns}
      total={total}
      error={error}
      loading={loading}
      options={{
        ...defaultOptions,
        actions,
        exporter,
      }}
    />
  );
};

export const Common = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <TableStateProvider>
          <Story />
        </TableStateProvider>
      </QueryClientProvider>
    ),
  ],
  render: (args) => <CommonExample {...args} />,
};

const WithErrorPassedExample = () => {
  const {
    loading,
    result: { data, meta: { total } = {} } = {},
    error,
  } = useExampleDataQuery({ endpoint: '/api/error' });
  return (
    <TableToolsTable
      tableToolsTableVariant="dataViewTable"
      items={data}
      columns={columns}
      total={total}
      error={error}
      loading={loading}
    />
  );
};

export const WithErrorPassed = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <TableStateProvider>
          <Story />
        </TableStateProvider>
      </QueryClientProvider>
    ),
  ],
  render: (args) => <WithErrorPassedExample {...args} />,
};

const EmptyExample = () => {
  const {
    loading,
    result: { data, meta: { total } = {} } = {},
    error,
  } = useExampleDataQuery({
    endpoint: '/api',
    params: { total: 0 },
  });

  return (
    <TableToolsTable
      tableToolsTableVariant="dataViewTable"
      items={data}
      columns={columns}
      total={total}
      error={error}
      loading={loading}
    />
  );
};

export const Empty = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <TableStateProvider>
          <Story />
        </TableStateProvider>
      </QueryClientProvider>
    ),
  ],
  render: (args) => <EmptyExample {...args} />,
};
