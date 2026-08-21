import React from 'react';
import propTypes from 'prop-types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import defaultStoryMeta from '~/support/defaultStoryMeta';

import columns from '~/support/factories/columns';
import filters from '~/support/factories/filters';
import paginationSerialiser from '~/components/StaticTableToolsTable/helpers/serialisers/pagination';
import sortSerialiser from '~/components/StaticTableToolsTable/helpers/serialisers/sort';
import filtersSerialiser from '~/components/StaticTableToolsTable/helpers/serialisers/filters';
import useExampleDataQuery from '~/support/hooks/useExampleDataQuery';

import { TableToolsTable, TableStateProvider } from '~/components';

const queryClient = new QueryClient();

const defaultOptions = {
  serialisers: {
    pagination: paginationSerialiser,
    sort: sortSerialiser,
    filters: filtersSerialiser,
  },
};

const meta = {
  title: 'Components/TableToolsTable/Features',
  ...defaultStoryMeta,
};

const WithErroringAsyncFunctionExample = ({ debug }) => {
  const { items } = useExampleDataQuery({
    endpoint: '/api/error',
    enabled: false,
  });

  return (
    <TableToolsTable
      items={items}
      columns={columns}
      filters={{ filterConfig: filters }}
      options={{
        ...defaultOptions,
        debug,
        manageColumns: true,
        kind: 'songs',
      }}
    />
  );
};

WithErroringAsyncFunctionExample.propTypes = {
  debug: propTypes.bool,
};

export const WithErroringAsyncFunction = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  render: (args) => <WithErroringAsyncFunctionExample {...args} />,
};

const WithErrorPassedExample = ({ debug }) => {
  const {
    loading,
    result: { data, meta: { total } = {} } = {},
    error,
  } = useExampleDataQuery({ endpoint: '/api/error' });

  return (
    <TableToolsTable
      loading={loading}
      items={data}
      error={error}
      total={total}
      columns={columns}
      filters={{ filterConfig: filters }}
      options={{ ...defaultOptions, debug }}
    />
  );
};

WithErrorPassedExample.propTypes = {
  debug: propTypes.bool,
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

export default meta;
