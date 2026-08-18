import React from 'react';

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

const SharableVariantTable = (props) => (
  <ShareableTable
    props={props}
    defaults={{
      columns: [
        {
          title: 'Another Artist',
          Component: ({ artist }) => artist,
        },
      ],
    }}
  />
);

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

export default meta;
