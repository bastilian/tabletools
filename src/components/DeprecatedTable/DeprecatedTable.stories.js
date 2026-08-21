import React, { useCallback } from 'react';
import propTypes from 'prop-types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';

import defaultStoryMeta from '~/support/defaultStoryMeta';
import mswGraphQlHandlers from '~/support/api/graphql';
import mswRestHandlers from '~/support/api/rest';

import columns from '~/support/factories/columns';
import filters, {
  customNumberFilterType,
  customNumberFilter,
} from '~/support/factories/filters';
import paginationSerialiser from '~/components/StaticTableToolsTable/helpers/serialisers/pagination';
import sortSerialiser from '~/components/StaticTableToolsTable/helpers/serialisers/sort';
import filtersSerialiser from '~/components/StaticTableToolsTable/helpers/serialisers/filters';
import useExampleDataQuery from '~/support/hooks/useExampleDataQuery';
import CustomEmptyState from '~/support/components/CustomEmptyState';
import DetailsRow from '~/support/components/DetailsRow';
import DedicatedAction from '~/support/components/DedicatedAction';
import { actions, rowActionResolver } from '~/support/constants';
// TODO fix preselection
// import { selectedItemIds } from '~/support/api';
const selectedItemIds = [];
import { TableToolsTable, TableStateProvider } from '~/components';
import { useQueryWithUtilities } from '~/utilities';

const queryClient = new QueryClient();

const onSelect = (selected) => {
  console.log('Currently selected', selected);
};

const defaultOptions = {
  serialisers: {
    pagination: paginationSerialiser,
    sort: sortSerialiser,
    filters: filtersSerialiser,
  },
};

const argProps = {
  debug: propTypes.bool,
  columns: propTypes.array,
  filters: propTypes.array,
  filtered: propTypes.bool,
  enableDefaultFilter: propTypes.bool,
  defaultFilter: propTypes.object,
  sortable: propTypes.bool,
  enableInitialSort: propTypes.bool,
  initialSort: propTypes.object,
  enableRowActions: propTypes.bool,
  enableActions: propTypes.bool,
  dedicatedAction: propTypes.bool,
  manageColumns: propTypes.bool,
  enableDragDrop: propTypes.bool,
  customEmptyRows: propTypes.bool,
  customEmptyState: propTypes.bool,
  enableExport: propTypes.bool,
  enableDetails: propTypes.bool,
  enableExpandAll: propTypes.bool,
  enableBulkSelect: propTypes.bool,
  enablePreselection: propTypes.bool,
  enableSimpleBulkSelect: propTypes.bool,
};

const meta = {
  title: 'Components/TableToolsTable',
  args: {
    debug: true,
    columns,
    filters,
    filtered: true,
    enableDefaultFilter: false,
    defaultFilter: {
      'released-in-decade': [[1960, 1970]],
    },
    sortable: true,
    enableInitialSort: false,
    initialSort: {
      index: 3,
      direction: 'asc',
    },
    manageColumns: true,
    enableDragDrop: false,
    enableRowActions: true,
    enableActions: true,
    dedicatedAction: true,
    customEmptyRows: true,
    customEmptyState: true,
    enableExport: true,
    enableDetails: true,
    enableExpandAll: true,
    enableBulkSelect: true,
    enablePreselection: false,
    enableSimpleBulkSelect: false,
  },
  ...defaultStoryMeta,
};

const emptyRows = (_kind, colSpan) => [
  {
    cells: [
      {
        title: () => <>Custom emptyRows</>,
        props: {
          colSpan,
        },
      },
    ],
  },
];

const CommonExample = ({
  debug,
  columns,
  filters,
  filtered,
  enableDefaultFilter,
  defaultFilter,
  sortable,
  initialSort,
  enableInitialSort,
  manageColumns,
  enableDragDrop,
  enableRowActions,
  enableActions,
  dedicatedAction,
  customEmptyRows,
  customEmptyState,
  enableExport,
  enableDetails,
  enableExpandAll,
  enableBulkSelect,
  enablePreselection,
  enableSimpleBulkSelect,
}) => {
  const {
    loading,
    result: { data, meta: { total } = {} } = {},
    error,
    exporter,
    itemIdsInTable,
    itemIdsOnPage,
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
    <TableToolsTable
      loading={loading}
      items={data}
      total={total}
      error={error}
      columns={
        sortable
          ? columns
          : columns.map((column) => ({ ...column, sortable: undefined }))
      }
      {...(filters && filtered
        ? {
            filters: {
              filterConfig: [...filters, customNumberFilter],
              customFilterTypes: {
                number: customNumberFilterType,
              },
              ...(enableDefaultFilter ? { activeFilters: defaultFilter } : {}),
            },
          }
        : {})}
      options={{
        ...defaultOptions,
        debug,
        manageColumns,
        enableDragDrop,
        ...(enableInitialSort ? { sortBy: initialSort } : {}),
        ...(enableRowActions
          ? {
              actionResolver: rowActionResolver,
            }
          : {}),
        ...(enableActions ? { actions } : {}),
        ...(dedicatedAction ? { dedicatedAction: DedicatedAction } : {}),
        ...(customEmptyRows ? { emptyRows: emptyRows(columns?.length) } : {}),
        ...(customEmptyState ? { EmptyState: CustomEmptyState } : {}),
        ...(enableExport ? { exporter } : {}),
        ...(enableDetails ? { detailsComponent: DetailsRow } : {}),
        canCollapseAll: enableExpandAll,
        ...(enableBulkSelect
          ? {
              ...(enablePreselection ? { selected: selectedItemIds } : {}),
              onSelect,
              itemIdsInTable,
              itemIdsOnPage,
            }
          : {}),
        ...(enableSimpleBulkSelect ? { onSelect: true } : {}),
        detailsProps: { fullWidth: true },
      }}
    />
  );
};

CommonExample.propTypes = argProps;

export const Common = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <TableStateProvider>
          <Story />
        </TableStateProvider>
      </QueryClientProvider>
    ),
  ],
  render: (args) => <CommonExample {...args} />,
};

const GraphQLExample = ({
  debug,
  columns,
  filters,
  filtered,
  enableDefaultFilter,
  defaultFilter,
  sortable,
  initialSort,
  enableInitialSort,
  manageColumns,
  enableRowActions,
  enableActions,
  dedicatedAction,
  customEmptyRows,
  customEmptyState,
  enableExport,
  enableDetails,
  enableBulkSelect,
  enablePreselection,
  enableSimpleBulkSelect,
}) => {
  const fetchFn = useCallback(
    async (params) =>
      await request(
        'http://local.com/graphql',
        gql`
          query GetTracks {
            data
          }
        `,
        params,
      ),
    [],
  );

  const {
    loading,
    result: { data: { items: data } = {}, meta: { total } = {} } = {},
    error,
    exporter,
    itemIdsInTable,
    itemIdsOnPage,
  } = useQueryWithUtilities({
    fetchFn,
    useTableState: true,
    totalBatched: {
      totalBatchedSelect: (results, totalForBatched) => ({
        data: results?.reduce(
          (acc, { data: { items } }) => [...acc, ...items],
          [],
        ),
        meta: {
          total: totalForBatched(results?.[0]),
        },
      }),
    },
  });

  return (
    <TableToolsTable
      loading={loading}
      items={data}
      total={total}
      error={error}
      columns={
        sortable
          ? columns
          : columns.map((column) => ({ ...column, sortable: undefined }))
      }
      {...(filters && filtered
        ? {
            filters: {
              filterConfig: [...filters, customNumberFilter],
              customFilterTypes: {
                number: customNumberFilterType,
              },
              ...(enableDefaultFilter ? { activeFilters: defaultFilter } : {}),
            },
          }
        : {})}
      options={{
        ...defaultOptions,
        debug,
        manageColumns,
        ...(enableInitialSort ? { sortBy: initialSort } : {}),
        ...(enableRowActions
          ? {
              actionResolver: rowActionResolver,
            }
          : {}),
        ...(enableActions ? { actions } : {}),
        ...(dedicatedAction ? { dedicatedAction: DedicatedAction } : {}),
        ...(customEmptyRows ? { emptyRows: emptyRows(columns?.length) } : {}),
        ...(customEmptyState ? { EmptyState: CustomEmptyState } : {}),
        ...(enableExport ? { exporter } : {}),
        ...(enableDetails ? { detailsComponent: DetailsRow } : {}),
        ...(enableBulkSelect
          ? {
              ...(enablePreselection ? { selected: selectedItemIds } : {}),
              onSelect,
              itemIdsInTable,
              itemIdsOnPage,
            }
          : {}),
        ...(enableSimpleBulkSelect ? { onSelect: true } : {}),
      }}
    />
  );
};

GraphQLExample.propTypes = argProps;

export const GraphQL = {
  parameters: {
    msw: {
      handlers: [...mswGraphQlHandlers, ...mswRestHandlers],
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <TableStateProvider>
          <Story />
        </TableStateProvider>
      </QueryClientProvider>
    ),
  ],
  render: (args) => <GraphQLExample {...args} />,
};

const AsyncFunctionExample = ({
  debug,
  columns,
  filters,
  filtered,
  enableDefaultFilter,
  defaultFilter,
  sortable,
  initialSort,
  enableInitialSort,
  enableRowActions,
  enableActions,
  dedicatedAction,
  manageColumns,
  customEmptyRows,
  customEmptyState,
  enableExport,
  enableDetails,
  enableBulkSelect,
}) => {
  const { items, itemIdsInTable, itemIdsOnPage, exporter } =
    useExampleDataQuery({
      endpoint: '/api',
      enabled: false,
    });

  return (
    <TableToolsTable
      items={items}
      columns={
        sortable
          ? columns
          : columns.map((column) => ({ ...column, sortable: undefined }))
      }
      {...(filters && filtered
        ? {
            filters: {
              filterConfig: [...filters, customNumberFilter],
              customFilterTypes: {
                number: customNumberFilterType,
              },
              ...(enableDefaultFilter ? { activeFilters: defaultFilter } : {}),
            },
          }
        : {})}
      options={{
        ...defaultOptions,
        debug,
        manageColumns,
        ...(enableRowActions
          ? {
              actionResolver: rowActionResolver,
            }
          : {}),
        ...(enableInitialSort ? { sortBy: initialSort } : {}),

        ...(enableActions ? { actions } : {}),
        ...(dedicatedAction ? { dedicatedAction: DedicatedAction } : {}),
        ...(customEmptyRows ? { emptyRows: emptyRows(columns?.length) } : {}),
        ...(customEmptyState ? { EmptyState: CustomEmptyState } : {}),
        ...(enableExport ? { exporter } : {}),
        ...(enableDetails ? { detailsComponent: DetailsRow } : {}),
        ...(enableBulkSelect
          ? {
              onSelect,
              itemIdsInTable,
              itemIdsOnPage,
            }
          : {}),
      }}
    />
  );
};

AsyncFunctionExample.propTypes = argProps;

export const AsyncFunction = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  render: (args) => <AsyncFunctionExample {...args} />,
};

const PlainAsyncFunctionExample = ({ debug }) => {
  const fetchItems = useCallback(
    async ({ pagination = {}, filters, sort } = {}) => {
      const query =
        '?' +
        new URLSearchParams({
          ...pagination,
          ...(filters ? { filters } : {}),
          ...(sort ? { sort } : {}),
        }).toString();
      const response = await fetch('/api' + query);
      const json = await response.json();

      return [json.data, json.meta.total];
    },
    [],
  );

  return (
    <TableToolsTable
      items={fetchItems}
      columns={columns}
      filters={{ filterConfig: filters }}
      options={{
        ...defaultOptions,
        debug,
        manageColumns: true,
        kind: 'songs',
      }}
    />
  );
};

PlainAsyncFunctionExample.propTypes = argProps;

export const PlainAsyncFunction = {
  render: (args) => <PlainAsyncFunctionExample {...args} />,
};

export const WithColumnDragDrop = {
  args: {
    manageColumns: true,
    enableDragDrop: true,
    enableRowActions: false,
    enableActions: false,
    dedicatedAction: false,
    customEmptyRows: false,
    customEmptyState: false,
    enableExport: false,
    enableDetails: false,
    enableBulkSelect: false,
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <TableStateProvider>
          <Story />
        </TableStateProvider>
      </QueryClientProvider>
    ),
  ],
  render: (args) => <CommonExample {...args} />,
};

export default meta;
