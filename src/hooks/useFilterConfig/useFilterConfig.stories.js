import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Button, Card, CardBody, Content } from '@patternfly/react-core';

import defaultStoryMeta from '~/support/defaultStoryMeta';
import columns from '~/support/factories/columns';
import filters, {
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
import { useStateCallbacks } from '~/hooks';

const queryClient = new QueryClient();

const defaultOptions = {
  debug: true,
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

const SetFilterExample = () => {
  const {
    current: { setFilter },
  } = useStateCallbacks();
  const {
    loading,
    result: { data, meta: { total } = {} } = {},
    error,
  } = useExampleDataQuery({
    endpoint: '/api',
    useTableState: true,
  });

  return (
    <>
      <Content>
        <p>This story is to test the `setFilter`</p>
      </Content>
      <Card>
        <CardBody>
          <Button
            onClick={() => {
              setFilter('rating-above', [1]);
            }}
          >
            1
          </Button>
          <Button
            onClick={() => {
              setFilter('rating-above', [2]);
            }}
          >
            2
          </Button>
          <Button
            onClick={() => {
              setFilter('rating-above', [3]);
            }}
          >
            3
          </Button>
          <Button
            onClick={() => {
              setFilter('rating-above', [4]);
            }}
          >
            4
          </Button>
          <Button
            onClick={() => {
              setFilter('rating-above', [5]);
            }}
          >
            5
          </Button>
          <Button
            onClick={() => {
              setFilter('title', ['ghost']);
            }}
          >
            Set title filter to "ghost"
          </Button>
        </CardBody>
      </Card>
      <TableToolsTable
        loading={loading}
        items={data}
        total={total}
        error={error}
        columns={columns}
        filters={{
          filterConfig: filters,
        }}
        options={{
          ...defaultOptions,
        }}
      />
    </>
  );
};

export const SetFilterStory = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <TableStateProvider>
          <Story />
        </TableStateProvider>
      </QueryClientProvider>
    ),
  ],
  render: (args) => <SetFilterExample {...args} />,
};

export default meta;
