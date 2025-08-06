import React from 'react';
import propTypes from 'prop-types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Label } from '@patternfly/react-core';

import defaultStoryMeta from '~/support/defaultStoryMeta';
import useExampleDataQuery from '~/support/hooks/useExampleDataQuery';
import paginationSerialiser from '~/components/StaticTableToolsTable/helpers/serialisers/pagination';

import { TableToolsTable, TableStateProvider } from '~/components';
import { useSerialisedTableState, useFullTableState } from '~/hooks';

const convertToOffsetAndLimit = paginationSerialiser;
const queryClient = new QueryClient();

const meta = {
  title: '"Adding Columns to a TableToolsTable" tutorial examples',
  ...defaultStoryMeta,
};

const ColumnsExample = () => {
  const serialisedTableState = useSerialisedTableState();
  const {
    loading,
    result: { data, meta: { total } = {} } = {},
    error,
  } = useExampleDataQuery({
    endpoint: '/api',
    params: {
      ...(serialisedTableState?.pagination || {}),
    },
  });

  const columns = [
    {
      title: 'Title',
    },
  ];

  return (
    <TableToolsTable
      loading={loading}
      items={data}
      error={error}
      total={total}
      columns={columns}
      options={{
        serialisers: {
          pagination: convertToOffsetAndLimit,
        },
      }}
    />
  );
};

const ColumnsExampleWrapper = () => (
  <TableStateProvider>
    <ColumnsExample />
  </TableStateProvider>
);

export const Columns = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  render: () => <ColumnsExampleWrapper />,
};

const ColumnsKeyExample = () => {
  const serialisedTableState = useSerialisedTableState();
  const {
    loading,
    result: { data, meta: { total } = {} } = {},
    error,
  } = useExampleDataQuery({
    endpoint: '/api',
    params: {
      ...(serialisedTableState?.pagination || {}),
    },
  });

  const columns = [
    {
      title: 'Title',
    },
    { title: 'Style', key: 'genre' },
  ];

  return (
    <TableToolsTable
      loading={loading}
      items={data}
      error={error}
      total={total}
      columns={columns}
      options={{
        serialisers: {
          pagination: convertToOffsetAndLimit,
        },
      }}
    />
  );
};

const ColumnsKeyExampleWrapper = () => (
  <TableStateProvider>
    <ColumnsKeyExample />
  </TableStateProvider>
);

export const ColumnsKey = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  render: () => <ColumnsKeyExampleWrapper />,
};

const Genre = ({ genre }) => <Label color="blue">{genre}</Label>;

Genre.propTypes = {
  genre: propTypes.string,
};

const ColumnsComponentExample = () => {
  const serialisedTableState = useSerialisedTableState();
  const {
    loading,
    result: { data, meta: { total } = {} } = {},
    error,
  } = useExampleDataQuery({
    endpoint: '/api',
    params: {
      ...(serialisedTableState?.pagination || {}),
    },
  });

  const columns = [
    {
      title: 'Title',
    },
    { title: 'Style', Component: Genre },
  ];

  return (
    <TableToolsTable
      loading={loading}
      items={data}
      error={error}
      total={total}
      columns={columns}
      options={{
        serialisers: {
          pagination: convertToOffsetAndLimit,
        },
      }}
    />
  );
};

const ColumnsComponentExampleWrapper = () => (
  <TableStateProvider>
    <ColumnsComponentExample />
  </TableStateProvider>
);

export const ColumnsComponent = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  render: () => <ColumnsComponentExampleWrapper />,
};

const ColumnsSortedExample = () => {
  const serialisedTableState = useSerialisedTableState();
  const { tableState: { sort } = {} } = useFullTableState() || {};

  console.log('Current sorting:', sort);

  const {
    loading,
    result: { data, meta: { total } = {} } = {},
    error,
  } = useExampleDataQuery({
    endpoint: '/api',
    params: {
      ...(serialisedTableState?.pagination || {}),
    },
  });

  const columns = [
    {
      title: 'Title',
      sortable: true,
    },
    { title: 'Style', Component: Genre, sortable: true },
  ];

  return (
    <TableToolsTable
      loading={loading}
      items={data}
      error={error}
      total={total}
      columns={columns}
      options={{
        serialisers: {
          pagination: convertToOffsetAndLimit,
        },
      }}
    />
  );
};

const ColumnsSortedExampleWrapper = () => (
  <TableStateProvider>
    <ColumnsSortedExample />
  </TableStateProvider>
);

export const ColumnsSorted = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  render: () => <ColumnsSortedExampleWrapper />,
};

const sortSerialiser = ({ index, direction } = {}, columns) =>
  columns[index]?.sortable && `${columns[index].sortable}:${direction}`;

const ColumnsSortedSerialisedExample = () => {
  const serialisedTableState = useSerialisedTableState();

  const {
    loading,
    result: { data, meta: { total } = {} } = {},
    error,
  } = useExampleDataQuery({
    endpoint: '/api',
    params: {
      ...(serialisedTableState?.pagination || {}),
      ...(serialisedTableState?.sort
        ? { sort: serialisedTableState?.sort }
        : {}),
    },
  });

  const columns = [
    {
      title: 'Title',
      sortable: 'title',
    },
    { title: 'Style', Component: Genre, sortable: 'genre' },
  ];

  return (
    <TableToolsTable
      loading={loading}
      items={data}
      error={error}
      total={total}
      columns={columns}
      options={{
        serialisers: {
          pagination: convertToOffsetAndLimit,
          sort: sortSerialiser,
        },
      }}
    />
  );
};

const ColumnsSortedSerialisedExampleWrapper = () => (
  <TableStateProvider>
    <ColumnsSortedSerialisedExample />
  </TableStateProvider>
);

export const ColumnsSortedSerialised = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  render: () => <ColumnsSortedSerialisedExampleWrapper />,
};

export default meta;
