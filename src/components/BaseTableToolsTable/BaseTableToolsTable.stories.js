import React from 'react';
import propTypes from 'prop-types';

import defaultStoryMeta from '~/support/defaultStoryMeta';
import columns from '~/support/factories/columns';
import filters, {
  customNumberFilterType,
  customNumberFilter,
} from '~/support/factories/filters';
import useExampleDataQuery from '~/support/hooks/useExampleDataQuery';

import { BaseTableToolsTable, TableStateProvider } from '~/components';
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
      <TableStateProvider>
        <Story />
      </TableStateProvider>
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
      <TableStateProvider>
        <Story />
      </TableStateProvider>
    ),
  ],
  render: () => (
    <ShareableTable
      loading={false}
      items={[
        { itemId: '1', title: 'A Track', artist: 'Zoe' },
        { itemId: '2', title: 'B Track', artist: 'Adam' },
      ]}
      total={2}
      columns={['title', 'artist']}
      options={{
        sortBy: { index: 1, direction: 'desc' }, // Default sort by Artist (columns[1])
        detailsComponent: ExampleDetailsRow, // Expandable rows (1 toggle column, offset = 1)
      }}
    />
  ),
};

export const SelectableWithDefaultSort = {
  decorators: [
    (Story) => (
      <TableStateProvider>
        <Story />
      </TableStateProvider>
    ),
  ],
  render: () => (
    <ShareableTable
      loading={false}
      items={[
        { itemId: '1', title: 'A Track', artist: 'Zoe' },
        { itemId: '2', title: 'B Track', artist: 'Adam' },
      ]}
      total={2}
      columns={['title', 'artist']}
      options={{
        onSelect: true, // Selection checkboxes only (1 select column, offset = 1, no expand column)
        sortBy: { index: 1, direction: 'desc' }, // Default sort by Artist (columns[1]) - offset = 1
      }}
    />
  ),
};

export const ExpandableAndSelectableWithDefaultSort = {
  decorators: [
    (Story) => (
      <TableStateProvider>
        <Story />
      </TableStateProvider>
    ),
  ],
  render: () => (
    <ShareableTable
      loading={false}
      items={[
        { itemId: '1', title: 'A Track', artist: 'Zoe' },
        { itemId: '2', title: 'B Track', artist: 'Adam' },
      ]}
      total={2}
      columns={['title', 'artist']}
      options={{
        onSelect: true, // Selection checkboxes (adds 1 select column)
        detailsComponent: ExampleDetailsRow, // Expandable rows (adds 1 toggle column)
        sortBy: { index: 1, direction: 'desc' }, // Default sort by Artist (columns[1]) - offset = 2
      }}
    />
  ),
};

export default meta;
