import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import defaultStoryMeta from '~/support/defaultStoryMeta';
import columns from '~/support/factories/columns';
import {
  customNumberFilter,
  customNumberFilterType,
  customGenresFilter,
  customGenresFilterType,
} from '~/support/factories/filters';

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
  title: 'useFilterConfig stories',
  ...defaultStoryMeta,
};

const CustomFiltersExample = () => {
  const {
    loading,
    result: { data, meta: { total } = {} } = {},
    error,
  } = useExampleDataQuery({
    endpoint: '/api',
    useTableState: true,
  });
  const { result: { data: genres } = {} } = useExampleDataQuery({
    endpoint: '/api/genres',
  });

  return (
    <TableToolsTable
      loading={loading}
      items={data}
      total={total}
      error={error}
      columns={columns}
      filters={{
        filterConfig: [
          customNumberFilter,
          {
            ...customGenresFilter,
            initialGroups: genres?.map((name) => ({ name })) || [],
          },
        ],
        customFilterTypes: {
          number: customNumberFilterType,
          customGenres: customGenresFilterType,
        },
      }}
      options={{
        ...defaultOptions,
        debug: true,
      }}
    />
  );
};

export const CustomFiltersStory = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <TableStateProvider>
          <Story />
        </TableStateProvider>
      </QueryClientProvider>
    ),
  ],
  render: (args) => <CustomFiltersExample {...args} />,
};

export default meta;
