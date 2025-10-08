import React, { useCallback, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  CodeBlock,
  CodeBlockCode,
  Content,
  Spinner,
  Bullseye,
  Button,
  Flex,
  Tabs,
  Tab,
  TabTitleText,
  List,
  ListItem,
} from '@patternfly/react-core';
import axios from 'axios';
import { faker } from '@faker-js/faker';

import defaultStoryMeta from '~/support/defaultStoryMeta';
import columns from '~/support/factories/columns';
import filters from '~/support/factories/filters';
import ItemsDropdown from '~/support/components/ItemsDropdown';

import paginationSerialiser from '~/components/StaticTableToolsTable/helpers/serialisers/pagination';
import sortSerialiser from '~/components/StaticTableToolsTable/helpers/serialisers/sort';
import filtersSerialiser from '~/components/StaticTableToolsTable/helpers/serialisers/filters';

import { TableToolsTable, TableStateProvider } from '~/components';
import { useQueryWithUtilities } from '~/utilities';

const api = axios.create();
const queryClient = new QueryClient();

const defaultOptions = {
  debug: true,
  serialisers: {
    pagination: paginationSerialiser,
    sort: sortSerialiser,
    filters: filtersSerialiser,
  },
};

const restApi = async (endpoint, { pagination, ...params }) => {
  const { data } = await api.get(endpoint, {
    params: {
      ...pagination,
      ...params,
    },
  });

  return data;
};

const meta = {
  title: 'useQueryWithUtilities stories',
  ...defaultStoryMeta,
};

const TableQueriesExample = () => {
  const fetchFn = useCallback(
    async (params) => await restApi('/api', params),
    [],
  );

  const { items, exporter, itemIdsInTable, itemIdsOnPage } =
    useQueryWithUtilities({
      fetchFn,
      enabled: false,
    });

  return (
    <>
      <Content>
        <p></p>
      </Content>
      <TableToolsTable
        items={items}
        columns={columns}
        filters={{
          filterConfig: filters,
        }}
        options={{
          ...defaultOptions,
          onSelect: true,
          exporter,
          itemIdsInTable,
          itemIdsOnPage,
        }}
      />
    </>
  );
};

export const TableQueriesStory = {
  decorators: [
    (Story) => (
      <TableStateProvider>
        <Story />
      </TableStateProvider>
    ),
  ],
  render: (args) => <TableQueriesExample {...args} />,
};

const TableQueriesWithStatesExample = () => {
  const fetchFn = useCallback(
    async (params) => await restApi('/api', params),
    [],
  );

  const {
    loading,
    result: { data, meta: { total } = {} } = {},
    error,
    exporter,
    itemIdsInTable,
    itemIdsOnPage,
  } = useQueryWithUtilities({
    fetchFn,
    useTableState: true,
  });

  return (
    <>
      <Content>
        <p></p>
      </Content>
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
          onSelect: true,
          exporter,
          itemIdsInTable,
          itemIdsOnPage,
        }}
      />
    </>
  );
};

export const TableQueriesWithStatesStory = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <TableStateProvider>
          <Story />
        </TableStateProvider>
      </QueryClientProvider>
    ),
  ],
  render: (args) => <TableQueriesWithStatesExample {...args} />,
};

const QueryWithNonDefaultResultExample = () => {
  const [selectedTrackId, setSelectedTrackId] = useState();

  const listFetchFn = useCallback(
    async (params) => await restApi('/api', params),
    [],
  );

  const { loading: listLoading, result: { data: listData } = {} } =
    useQueryWithUtilities({
      fetchFn: listFetchFn,
    });

  const itemFetchFn = useCallback(
    async (params) => await restApi('/api/item', params),
    [],
  );
  const { loading: itemLoading, result: itemData } = useQueryWithUtilities({
    fetchFn: itemFetchFn,
    params: {
      id: selectedTrackId,
    },
    useTableState: true,
    enabled: !!selectedTrackId,
  });

  const onSelect = useCallback((selectedId) => {
    setSelectedTrackId(selectedId);
  }, []);

  return (
    <>
      {listLoading ? (
        <Spinner />
      ) : (
        <ItemsDropdown
          selected={selectedTrackId}
          items={listData?.map(({ id, title, artist }) => ({
            label: `${title} - ${artist}`,
            value: id,
          }))}
          onSelect={onSelect}
        />
      )}
      {selectedTrackId &&
        (itemLoading ? (
          <Spinner />
        ) : (
          <CodeBlock>
            <CodeBlockCode id="code-content">
              {JSON.stringify(itemData, null, 2)}
            </CodeBlockCode>
          </CodeBlock>
        ))}
    </>
  );
};

export const QueryWithNonDefaultResultStory = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <TableStateProvider>
          <Story />
        </TableStateProvider>
      </QueryClientProvider>
    ),
  ],
  render: (args) => <QueryWithNonDefaultResultExample {...args} />,
};

const QueryQueueExample = () => {
  const [genreTab, setGenreTab] = useState();

  const genresFetchFn = useCallback(
    async (params) => await restApi('/api/genres', params),
    [],
  );
  const fetchFn = useCallback(
    async (params) => await restApi('/api', params),
    [],
  );

  // Fetch a list of genres
  const { result: { data: genres } = {}, loading: genresLoading } =
    useQueryWithUtilities({
      fetchFn: genresFetchFn,
    });

  // Turn the list of genres into an object where the key is the genre
  // and the value is a params object for each request
  const queue =
    genres &&
    Object.fromEntries(
      genres?.map((genre) => [
        genre.toLowerCase().replaceAll(' ', '-'),
        {
          filters: `(.genre in ["${genre}"])`,
        },
      ]),
    );

  // We set up the query hook for the queue we created
  const { result: genreList, loading: genreListLoading } =
    useQueryWithUtilities({
      fetchFn,
      // We only enable requesing when we have genres and the queue built
      enabled: !!queue,
      queue,
      // We enable "batched" requesting to request all tracks of a genre at once
      batched: true,
      totalBatched: {
        batchSize: 10,
      },
    });

  return genresLoading ? (
    <Bullseye>
      <Spinner />
    </Bullseye>
  ) : (
    <>
      <Tabs
        activeKey={genreTab || genres[0].toLowerCase().replaceAll(' ', '-')}
        onSelect={(_event, selectedGenreTab) => {
          setGenreTab(selectedGenreTab);
        }}
      >
        {genres?.map((genre) => {
          const key = genre.toLowerCase().replaceAll(' ', '-');

          return (
            <Tab
              key={key}
              eventKey={key}
              title={<TabTitleText>{genre}</TabTitleText>}
              aria-label="Default content - users"
            >
              {genreListLoading ? (
                <Bullseye>
                  <Spinner />
                </Bullseye>
              ) : (
                <List>
                  {genreList[key].data.map((track) => (
                    <ListItem key={track.id}>
                      {track.title} - {track.artist}
                    </ListItem>
                  ))}
                </List>
              )}
            </Tab>
          );
        })}
      </Tabs>
    </>
  );
};

export const QueryQueueStory = {
  decorators: [
    (Story) => (
      <TableStateProvider>
        <Story />
      </TableStateProvider>
    ),
  ],
  render: (args) => <QueryQueueExample {...args} />,
};

export default meta;

const TableQueriesWithCombinedFiltersExample = () => {
  const fetchFn = useCallback(
    async (params) => await restApi('/api', params),
    [],
  );

  const combineParamsWithTableState = useCallback(
    (tableStateParams, additionalParams) => {
      const tableFilters = tableStateParams?.filters;
      const optionFilters = additionalParams?.filters;

      const combinedParams = {
        ...(tableStateParams ? tableStateParams : {}),
        ...(additionalParams ? additionalParams : {}),
      };
      if (tableFilters && optionFilters) {
        combinedParams.filters = `${tableFilters} and ${optionFilters}`;
      }
      return combinedParams;
    },
    [],
  );

  const {
    loading,
    result: { data, meta: { total } = {} } = {},
    error,
    exporter,
    itemIdsInTable,
    itemIdsOnPage,
  } = useQueryWithUtilities({
    fetchFn,
    useTableState: true,
    params: {
      filters: '(.rating >= 3)',
    },
    combineParamsWithTableState,
  });

  return (
    <>
      <Content>
        <p></p>
      </Content>
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
          onSelect: true,
          exporter,
          itemIdsInTable,
          itemIdsOnPage,
        }}
      />
    </>
  );
};

export const TableQueriesWithCombinedFiltersStory = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <TableStateProvider>
          <Story />
        </TableStateProvider>
      </QueryClientProvider>
    ),
  ],
  render: (args) => <TableQueriesWithCombinedFiltersExample {...args} />,
};

const QueryRefetchExample = () => {
  const fetchFn = useCallback(
    async (params) => await restApi('/api', params),
    [],
  );

  const { loading, refetch, query } = useQueryWithUtilities({
    fetchFn,
    params: {
      limit: 1,
    },
  });
  const onDataRefetch = async () => {
    refetch();
  };
  const onDataFetch = async () => {
    query();
  };

  return (
    <>
      <Flex columnGap={{ default: 'columnGapSm' }}>
        <Content component="h4">Random text:</Content>
        {loading ? (
          <Spinner size="md" />
        ) : (
          <Content>{faker.commerce.productName()}</Content>
        )}
      </Flex>
      <Flex columnGap={{ default: 'columnGapSm' }}>
        <Button onClick={onDataRefetch}>Refetch data</Button>
        <Button onClick={onDataFetch}>Fetch data</Button>
      </Flex>
    </>
  );
};

export const QueryRefetchStory = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <TableStateProvider>
          <Story />
        </TableStateProvider>
      </QueryClientProvider>
    ),
  ],
  render: (args) => <QueryRefetchExample {...args} />,
};
