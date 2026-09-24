import React from 'react';
import propTypes from 'prop-types';

import defaultStoryMeta from '~/support/defaultStoryMeta';
import columns from '~/support/factories/columns';
import filters, {
  customNumberFilterType,
  customNumberFilter,
} from '~/support/factories/filters';
import useExampleDataQuery from '~/support/hooks/useExampleDataQuery';

import {
  BaseTableToolsTable,
  TableStateProvider,
  QueryProviderWithUtilities,
} from '~/components';
import paginationSerialiser from '~/components/StaticTableToolsTable/helpers/serialisers/pagination';
import sortSerialiser from '~/components/StaticTableToolsTable/helpers/serialisers/sort';
import filtersSerialiser from '~/components/StaticTableToolsTable/helpers/serialisers/filters';

const meta = {
  title: 'BaseTableToolsTable',
  args: {
    debug: true,
    columns,
    filters,
  },
  ...defaultStoryMeta,
};

const ShareableTable = (props) => (
  <BaseTableToolsTable
    props={props}
    defaults={{
      options: {
        debug: true,
        serialisers: {
          pagination: paginationSerialiser,
          sort: sortSerialiser,
          filters: filtersSerialiser,
        },
      },
      columns,
      filters: {
        filterConfig: [...filters, customNumberFilter],
        customFilterTypes: {
          number: customNumberFilterType,
        },
      },
    }}
  />
);

ShareableTable.propTypes = {
  props: propTypes.object,
  columns: propTypes.array,
  filters: propTypes.object,
  options: propTypes.object,
  loading: propTypes.bool,
  items: propTypes.array,
  total: propTypes.number,
  error: propTypes.object,
  defaults: propTypes.object,
};

const AnotherArtist = ({ artist }) => artist;
AnotherArtist.propTypes = {
  artist: propTypes.node,
};

const SharableVariantTable = (props) => (
  <ShareableTable
    props={props}
    defaults={{
      columns: [
        {
          title: 'Another Artist',
          Component: AnotherArtist,
        },
      ],
    }}
  />
);

SharableVariantTable.propTypes = {
  props: propTypes.object,
  columns: propTypes.array,
  filters: propTypes.object,
  options: propTypes.object,
  loading: propTypes.bool,
  items: propTypes.array,
  total: propTypes.number,
  error: propTypes.object,
  defaults: propTypes.object,
};

const ShareableTableToolsTableExample = () => {
  const {
    loading,
    result: { data, meta: { total } = {} } = {},
    error,
  } = useExampleDataQuery({
    endpoint: '/api',
    useTableState: true,
    tableQueries: {
      extraParams: {
        itemIdsInTable: { idsOnly: true },
      },
    },
  });

  return (
    <SharableVariantTable
      loading={loading}
      items={data}
      total={total}
      error={error}
      filters={{ filterConfig: ['title', 'number-filter'] }}
      columns={['title', { key: 'artist' }, 'another-artist']}
    />
  );
};

ShareableTableToolsTableExample.propTypes = {};

export const ShareableTableToolsTable = {
  decorators: [
    (Story) => (
      <QueryProviderWithUtilities>
        <TableStateProvider>
          <Story />
        </TableStateProvider>
      </QueryProviderWithUtilities>
    ),
  ],
  render: (args) => <ShareableTableToolsTableExample {...args} />,
};

const ExampleDetailsRow = ({ item }) => (
  <div style={{ padding: '16px' }}>
    <p>
      <strong>Details:</strong> Additional description for{' '}
      {item?.title || item?.name}
    </p>
  </div>
);

ExampleDetailsRow.propTypes = {
  item: propTypes.object,
};

export const ExpandableWithDefaultSort = {
  decorators: [
    (Story) => (
      <QueryProviderWithUtilities>
        <TableStateProvider>
          <Story />
        </TableStateProvider>
      </QueryProviderWithUtilities>
    ),
  ],
  render: () => (
    <ShareableTable
      loading={false}
      items={[
        { itemId: '1', title: 'A Track', artist: 'Zoe', genre: 'Rock' },
        { itemId: '2', title: 'B Track', artist: 'Adam', genre: 'Pop' },
      ]}
      total={2}
      columns={['title', 'artist', 'genre']}
      options={{
        sortBy: { index: 1, direction: 'asc' }, // Default sort by Artist (columns[1]) ascending - offset = 1
        detailsComponent: ExampleDetailsRow,
      }}
    />
  ),
};

export const SelectableWithDefaultSort = {
  decorators: [
    (Story) => (
      <QueryProviderWithUtilities>
        <TableStateProvider>
          <Story />
        </TableStateProvider>
      </QueryProviderWithUtilities>
    ),
  ],
  render: () => (
    <ShareableTable
      loading={false}
      items={[
        { itemId: '1', title: 'A Track', artist: 'Zoe', genre: 'Rock' },
        { itemId: '2', title: 'B Track', artist: 'Adam', genre: 'Pop' },
      ]}
      total={2}
      columns={['title', 'artist', 'genre']}
      options={{
        onSelect: true,
        sortBy: { index: 0, direction: 'desc' }, // Default sort by Title (columns[0]) descending - offset = 1
      }}
    />
  ),
};

export const ExpandableAndSelectableWithDefaultSort = {
  decorators: [
    (Story) => (
      <QueryProviderWithUtilities>
        <TableStateProvider>
          <Story />
        </TableStateProvider>
      </QueryProviderWithUtilities>
    ),
  ],
  render: () => (
    <ShareableTable
      loading={false}
      items={[
        { itemId: '1', title: 'A Track', artist: 'Zoe', genre: 'Rock' },
        { itemId: '2', title: 'B Track', artist: 'Adam', genre: 'Pop' },
      ]}
      total={2}
      columns={['title', 'artist', 'genre']}
      options={{
        onSelect: true,
        detailsComponent: ExampleDetailsRow,
        sortBy: { index: 2, direction: 'desc' }, // Default sort by Genre (columns[2]) descending - offset = 2
      }}
    />
  ),
};

export default meta;
