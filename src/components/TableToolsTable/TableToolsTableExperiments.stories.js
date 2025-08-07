import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import defaultStoryMeta from '~/support/defaultStoryMeta';
import columns from '~/support/factories/columns';
import paginationSerialiser from '~/components/StaticTableToolsTable/helpers/serialisers/pagination';
import sortSerialiser from '~/components/StaticTableToolsTable/helpers/serialisers/sort';
import filtersSerialiser from '~/components/StaticTableToolsTable/helpers/serialisers/filters';
import useExampleDataQuery from '~/support/hooks/useExampleDataQuery';

import { TableToolsTable, TableStateProvider } from '~/components';
import { useFullTableState } from '~/hooks';

const queryClient = new QueryClient();

const defaultOptions = {
  serialisers: {
    pagination: paginationSerialiser,
    sort: sortSerialiser,
    filters: filtersSerialiser,
  },
};

const meta = {
  title: 'TableToolsTable Experiments',
  ...defaultStoryMeta,
};

const ContextExample = () => {
  const {
    loading,
    result: { data, meta: { total } = {} } = {},
    error,
  } = useExampleDataQuery({ endpoint: '/api', useTableState: true });

  return (
    <TableToolsTable
      loading={loading}
      items={data}
      total={total}
      error={error}
      columns={columns}
      options={defaultOptions}
    />
  );
};

const ContextExampleWrapper = () => {
  return (
    <TableStateProvider>
      <ContextExample />
    </TableStateProvider>
  );
};

const ContextExampleSecondWrapper = () => {
  const fullTableState = useFullTableState();

  useEffect(() => {
    console.log(
      'Even though there are multiple TableStateProviders in between the highest should always be the one with access',
      fullTableState,
    );
  }, [fullTableState]);

  return (
    <TableStateProvider>
      <ContextExampleWrapper />
    </TableStateProvider>
  );
};

// This story is to test that it is possible to "raise" the context
// The TableStateProvider is implemented to only insert itself into the stack if there is not already a tablecontext available.
// The TableStateProvider in here is still the primary one accessed in ContextExampleSecondWrapper
export const ContextStory = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <TableStateProvider>
          <Story />
        </TableStateProvider>
      </QueryClientProvider>
    ),
  ],
  render: (args) => <ContextExampleSecondWrapper {...args} />,
};

export default meta;
