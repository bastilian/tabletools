import React, { useCallback, useEffect, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Card, CardBody, Spinner, Button, Label } from '@patternfly/react-core';

import defaultStoryMeta from '~/support/defaultStoryMeta';
import columns from '~/support/factories/columns';
import { genres } from '~/support/factories/items';

import paginationSerialiser from '~/components/StaticTableToolsTable/helpers/serialisers/pagination';
import sortSerialiser from '~/components/StaticTableToolsTable/helpers/serialisers/sort';
import filtersSerialiser from '~/components/StaticTableToolsTable/helpers/serialisers/filters';
import useExampleDataQuery from '~/support/hooks/useExampleDataQuery';

import { TableToolsTable, TableStateProvider } from '~/components';
import { useFullTableState, useStateCallbacks } from '~/hooks';

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

// This is an example for a table with bulk selection where the preselection is loaded from an API
// NOTE: the `selected` option it *not* "reactive", meaning if it changes, the selection will *not* be updated
// Therefore the `TableToolsTable` should not be rendered before the selection is loaded.
const BulkSelectExample = () => {
  const { loading: selectionLoading, result: selection } = useExampleDataQuery({
    endpoint: '/api/selection',
  });
  const {
    loading,
    result: { data, meta: { total } = {} } = {},
    error,
    itemIdsInTable,
  } = useExampleDataQuery({
    endpoint: '/api',
    useTableState: true,
  });
  const {
    current: { resetSelection, setSelection },
  } = useStateCallbacks();
  const fullTableState = useFullTableState() || {};

  const onSelect = useCallback((selection) => {
    console.log('Current Selection', selection);
  }, []);

  return selectionLoading ? (
    <Spinner />
  ) : (
    <>
      <Card>
        <CardBody>
          <Button
            variant="primary"
            ouiaId="Primary"
            onClick={() => resetSelection()}
          >
            Reset Selection
          </Button>
          <Button
            variant="primary"
            ouiaId="Primary"
            onClick={() => setSelection(data.map(({ id }) => id))}
          >
            Select only page
          </Button>
          <Label>
            Selected items in context:{' '}
            {fullTableState?.tableState?.selected?.length}
          </Label>
        </CardBody>
      </Card>
      <br />
      <TableToolsTable
        loading={loading}
        items={data}
        total={total}
        error={error}
        columns={columns}
        options={{
          ...defaultOptions,
          debug: true,
          onSelect,
          itemIdsInTable,
          selected: selection,
        }}
      />
    </>
  );
};

export const BulkSelectStory = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <TableStateProvider>
          <Story />
        </TableStateProvider>
      </QueryClientProvider>
    ),
  ],
  render: (args) => <BulkSelectExample {...args} />,
};

const genreFilterOptions = genres.map((genre) => ({
  label: genre,
  value: genre,
}));

const FilterModalExample = () => {
  const { fetch: fetchGenre } = useExampleDataQuery({
    endpoint: '/api/genres',
    skip: true,
  });
  const {
    loading,
    result: { data, meta: { total } = {} } = {},
    error,
    itemIdsInTable,
  } = useExampleDataQuery({
    endpoint: '/api',
    useTableState: true,
  });

  const genreItemFetch = useCallback(
    async (
      { filters, pagination, sort } = {
        pagination: { offset: 0, limit: 15 },
      },
    ) => {
      const params = {
        ...(filters ? { filters } : {}),
        ...(pagination ? pagination : {}),
        ...(sort ? { sort } : {}),
      };
      const genresJson = await fetchGenre(params);

      return [
        genresJson.data.map((genre) => ({
          label: genre,
          value: genre,
        })),
        genresJson.meta.total,
      ];
    },
    [fetchGenre],
  );

  const filters = useMemo(() => {
    return [
      {
        type: 'checkbox',
        label: 'Genre with fetched items',
        filterAttribute: 'genre',
        // This function is used in two ways
        // It is called without a serialisedTableState and tableState when it is called for the filter dropdown
        // It is also called from the table in the modal WITH a serialisedTableState
        items: genreItemFetch,
        modal: true,
      },
      {
        type: 'checkbox',
        label: 'Genre with static items and modal',
        filterAttribute: 'genre',
        items: genreFilterOptions.slice(0, 30),
        modal: true,
      },
      {
        type: 'checkbox',
        label: 'Genre with fetched items and modal items',
        filterAttribute: 'genre',
        items: genreFilterOptions.slice(0, 20),
        modal: {
          items: async (
            _serialisedState,
            { pagination: { state } = { page: 1, perPage: 10 } } = {},
          ) => {
            const offset = (state?.page - 1) * state?.perPage;
            const limit = state?.perPage;
            const genresResponse = await fetch(
              `/api/genres?offset=${offset}&limit=${limit}`,
            );
            const genresJson = await genresResponse.json();

            return [
              genresJson.data.map((genre) => ({
                label: genre,
                value: genre,
              })),
              genresJson.meta.total,
            ];
          },
        },
      },
    ];
  }, [genreItemFetch]);

  return (
    <TableToolsTable
      loading={loading}
      items={data}
      filters={{
        filterConfig: filters,
      }}
      total={total}
      error={error}
      columns={columns}
      options={{
        ...defaultOptions,
        debug: true,
        itemIdsInTable,
      }}
    />
  );
};

export const FilterModalStory = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <TableStateProvider>
          <Story />
        </TableStateProvider>
      </QueryClientProvider>
    ),
  ],
  render: (args) => <FilterModalExample {...args} />,
};

const AllEmptyExample = () => {
  const { loading } = useExampleDataQuery({
    endpoint: '/api',
    useTableState: true,
  });

  return (
    <TableToolsTable
      loading={loading}
      items={[]}
      total={0}
      columns={columns}
      options={{
        ...defaultOptions,
        debug: true,
        tableTree: [],
        enableTreeView: true,
        defaultTableView: 'tree',
      }}
    />
  );
};

export const AllEmptyStory = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <TableStateProvider>
          <Story />
        </TableStateProvider>
      </QueryClientProvider>
    ),
  ],
  render: (args) => <AllEmptyExample {...args} />,
};

export default meta;
