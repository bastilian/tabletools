import React from 'react';
import defaultStoryMeta from '~/support/defaultStoryMeta';
import columns from '~/support/factories/columns';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TableStateProvider } from '~/components';
import useExampleDataQuery from '~/support/hooks/useExampleDataQuery';
import paginationSerialiser from '~/components/StaticTableToolsTable/helpers/serialisers/pagination';
import sortSerialiser from '~/components/StaticTableToolsTable/helpers/serialisers/sort';

import DataViewTable from './DataViewTable';

const meta = {
  title: 'DataViewTable',
  component: DataViewTable,
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
  } = useExampleDataQuery({
    endpoint: '/api',
    useTableState: true,
  });

  return (
    <DataViewTable
      items={data}
      columns={columns}
      total={total}
      error={error}
      loading={loading}
      options={{
        ...defaultOptions,
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
    <DataViewTable
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
    <DataViewTable
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
