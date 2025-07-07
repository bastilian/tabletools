import React from 'react';

import defaultStoryMeta from '~/support/defaultStoryMeta';
import useExampleDataQuery from '~/support/hooks/useExampleDataQuery';
import paginationSerialiser from '~/components/StaticTableToolsTable/helpers/serialisers/pagination';

import { TableToolsTable, TableStateProvider } from '~/components';
import { useSerialisedTableState } from '~/hooks';

const convertToOffsetAndLimit = paginationSerialiser;

const meta = {
  title: '"Using TableToolsTable" tutorial examples',
  ...defaultStoryMeta,
};

const BasicExample = () => {
  const fetchItems = async () => {
    const response = await fetch('/api');
    const json = await response.json();

    return [json.data, json.meta.total];
  };

  const columns = [
    {
      title: 'Title',
      key: 'title',
    },
  ];

  return <TableToolsTable items={fetchItems} columns={columns} />;
};

export const Basic = {
  render: () => <BasicExample />,
};

const BasicQueryExample = () => {
  const {
    loading,
    result: { data, meta: { total } = {} } = {},
    error,
  } = useExampleDataQuery({ endpoint: '/api' });

  const columns = [
    {
      title: 'Title',
      key: 'title',
    },
  ];

  return (
    <TableToolsTable
      loading={loading}
      items={data}
      error={error}
      total={total}
      columns={columns}
    />
  );
};

export const BasicQuery = {
  render: () => <BasicQueryExample />,
};

const BasicStateExample = () => {
  const fetchItems = async (
    _serialisedTableState,
    { pagination: { state: pagination } = {} } = {},
  ) => {
    const params = new URLSearchParams(
      // returns {limit: XXX, offset: XXX}
      convertToOffsetAndLimit(pagination),
    ).toString();
    const response = await fetch('/api?' + params);
    const json = await response.json();

    return [json.data, json.meta.total];
  };

  const columns = [
    {
      title: 'Title',
      key: 'title',
    },
  ];

  return <TableToolsTable items={fetchItems} columns={columns} />;
};

export const BasicState = {
  render: () => <BasicStateExample />,
};

const BasicSerialisedStateExample = () => {
  const fetchItems = async ({ pagination } = {}) => {
    const params = new URLSearchParams(pagination).toString();
    const response = await fetch('/api?' + params);
    const json = await response.json();

    return [json.data, json.meta.total];
  };

  const columns = [
    {
      title: 'Title',
      key: 'title',
    },
  ];

  return (
    <TableToolsTable
      items={fetchItems}
      columns={columns}
      options={{
        serialisers: {
          pagination: convertToOffsetAndLimit,
        },
      }}
    />
  );
};

export const BasicSerialisedState = {
  render: () => <BasicSerialisedStateExample />,
};

const BasicQueryWithSerialisedStateExample = () => {
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
      key: 'title',
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

const BasicQueryWithSerialisedStateExampleWrapper = () => (
  <TableStateProvider>
    <BasicQueryWithSerialisedStateExample />
  </TableStateProvider>
);

export const BasicQueryWithSerialisedState = {
  render: () => <BasicQueryWithSerialisedStateExampleWrapper />,
};

const BasicQueryWithTableStateExample = () => {
  const {
    loading,
    result: { data, meta: { total } = {} } = {},
    error,
  } = useExampleDataQuery({ endpoint: '/api' });

  const columns = [
    {
      title: 'Title',
      key: 'title',
    },
  ];

  return (
    <TableToolsTable
      loading={loading}
      items={data}
      error={error}
      total={total}
      columns={columns}
    />
  );
};

export const BasicQueryWithTableState = {
  render: () => <BasicQueryWithTableStateExample />,
};

export default meta;
