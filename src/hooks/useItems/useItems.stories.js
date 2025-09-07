import React, { useEffect, useCallback, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Card, CardBody, Content } from '@patternfly/react-core';

import defaultStoryMeta from '~/support/defaultStoryMeta';
import columns from '~/support/factories/columns';

import paginationSerialiser from '~/components/StaticTableToolsTable/helpers/serialisers/pagination';
import sortSerialiser from '~/components/StaticTableToolsTable/helpers/serialisers/sort';
import filtersSerialiser from '~/components/StaticTableToolsTable/helpers/serialisers/filters';
import useExampleDataQuery from '~/support/hooks/useExampleDataQuery';
import GenresDropdown from '~/support/components/GenresDropdown';

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
  title: 'useItems stories',
  ...defaultStoryMeta,
};

const RefetchExample = () => {
  const {
    current: { reload },
  } = useStateCallbacks();
  const [selectedGenre, setSelectedGenre] = useState();
  const { query } = useExampleDataQuery({
    endpoint: '/api',
    enabled: false,
  });

  const queryItems = useCallback(
    async ({ pagination = {}, filters, sort } = {}) => {
      const {
        data: items,
        meta: { total },
      } = await query({
        ...pagination,
        ...(filters ? { filters } : {}),
        ...(sort ? { sort } : {}),
        ...(selectedGenre
          ? { filters: `(.genre in ["${selectedGenre}"])` }
          : {}),
      });

      return [items, total];
    },
    [query, selectedGenre],
  );

  const onSelectGenre = useCallback((genre) => {
    setSelectedGenre(genre);
  }, []);

  useEffect(() => {
    reload?.();
  }, [selectedGenre, reload]);

  return (
    <>
      <Content>
        <p>
          This story demonstrates calling the `reload` callback of the table,
          after the `selectedGenre` has changed.
        </p>
      </Content>
      <Card>
        <CardBody>
          <GenresDropdown selected={selectedGenre} onSelect={onSelectGenre} />
        </CardBody>
      </Card>
      <TableToolsTable
        items={queryItems}
        columns={columns}
        options={{
          ...defaultOptions,
        }}
      />
    </>
  );
};

export const RefetchStory = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <TableStateProvider>
          <Story />
        </TableStateProvider>
      </QueryClientProvider>
    ),
  ],
  render: (args) => <RefetchExample {...args} />,
};

const QueryKeyRefetchExample = () => {
  const [selectedGenre, setSelectedGenre] = useState();
  const { query } = useExampleDataQuery({
    endpoint: '/api',
    enabled: false,
  });

  const queryItems = useCallback(
    async ({ pagination = {}, filters, sort } = {}) => {
      const {
        data: items,
        meta: { total },
      } = await query({
        ...pagination,
        ...(filters ? { filters } : {}),
        ...(sort ? { sort } : {}),
        ...(selectedGenre
          ? { filters: `(.genre in ["${selectedGenre}"])` }
          : {}),
      });

      return [items, total];
    },
    [query, selectedGenre],
  );

  const onSelectGenre = useCallback((genre) => {
    setSelectedGenre(genre);
  }, []);

  return (
    <>
      <Content>
        <p>
          This story demonstrates reloading the table by providing a `queryKey`
          for the `useItems` hook, which will append the provided `queryKey` to
          the `queryKey` option passed to the (TanStack) `useQuery` hook.
        </p>
      </Content>
      <Card>
        <CardBody>
          <GenresDropdown selected={selectedGenre} onSelect={onSelectGenre} />
        </CardBody>
      </Card>
      <TableToolsTable
        items={queryItems}
        columns={columns}
        options={{
          ...defaultOptions,
          itemsOptions: {
            queryKey: selectedGenre,
          },
        }}
      />
    </>
  );
};

export const QueryKeyRefetchStory = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <TableStateProvider>
          <Story />
        </TableStateProvider>
      </QueryClientProvider>
    ),
  ],
  render: (args) => <QueryKeyRefetchExample {...args} />,
};

export default meta;
