import React, { useCallback, useEffect } from 'react';
import propTypes from 'prop-types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import defaultStoryMeta from '~/support/defaultStoryMeta';
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
import { selectedItemIds } from '~/support/api';

import { TableToolsTable, TableStateProvider } from '~/components';
import { useFullTableState, useStateCallbacks } from '~/hooks';

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
  customEmptyRows: propTypes.bool,
  customEmptyState: propTypes.bool,
  enableExport: propTypes.bool,
  enableDetails: propTypes.bool,
  enableBulkSelect: propTypes.bool,
  enablePreselection: propTypes.bool,
  enableSimpleBulkSelect: propTypes.bool,
};

const meta = {
  title: 'TableToolsTable',
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
    enableRowActions: true,
    enableActions: true,
    dedicatedAction: true,
    customEmptyRows: true,
    customEmptyState: true,
    enableExport: true,
    enableDetails: true,
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
  const {
    loading,
    result: { data, meta: { total } = {} } = {},
    error,
    exporter,
    itemIdsInTable,
    itemIdsOnPage,
  } = useExampleDataQuery({ endpoint: '/api', useTableState: true });

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

const WithTableTreeExample = ({
  debug,
  columns,
  filters,
  filtered,
  enableDefaultFilter,
  defaultFilter,
  sortable,
  initialSort,
  enableInitialSort,
  enableActions,
  dedicatedAction,
  manageColumns,
  customEmptyRows,
  customEmptyState,
  enableExport,
  enableDetails,
  enableBulkSelect,
  enablePreselection,
}) => {
  const { tableState: { tableView, filters: filterState } = {} } =
    useFullTableState() || {};

  const {
    result: { data, meta: { total } = {} } = {},
    loading,
    error,
    exporter,
    itemIdsInTable,
    itemIdsOnPage,
  } = useExampleDataQuery({
    endpoint: '/api',
    ...(tableView === 'tree'
      ? { params: { limit: 'max', sort: 'id:asc' } }
      : {}),
    useTableState: true,
  });

  const {
    result: tableTree,
    loading: treeLoading,
    error: treeError,
  } = useExampleDataQuery({
    endpoint: '/api/tree',
    useTableState: true,
  });
  const {
    current: { setView },
  } = useStateCallbacks();

  useEffect(() => {
    if (filterState && tableView === 'tree') {
      setView('rows');
    }
  }, [filterState]);

  return (
    <TableToolsTable
      loading={loading || treeLoading}
      items={data}
      total={total}
      error={error || treeError}
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
        tableTree,
        enableTreeView: true,
        defaultTableView: 'tree',
        ...(enableInitialSort ? { sortBy: initialSort } : {}),
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
      }}
    />
  );
};

WithTableTreeExample.propTypes = argProps;

export const WithTableTree = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <TableStateProvider>
          <Story />
        </TableStateProvider>
      </QueryClientProvider>
    ),
  ],
  render: (args) => <WithTableTreeExample {...args} />,
};

const WithAsyncFunctionExample = ({
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
  const { fetch, itemIdsInTable, itemIdsOnPage, exporter } =
    useExampleDataQuery({
      endpoint: '/api',
      skip: true,
    });

  const fetchItems = useCallback(
    async ({ pagination = {}, filters, sort } = {}) => {
      const {
        data: items,
        meta: { total },
      } = await fetch({
        ...pagination,
        ...(filters ? { filters } : {}),
        ...(sort ? { sort } : {}),
      });

      return [items, total];
    },
    [fetch],
  );

  return (
    <TableToolsTable
      items={fetchItems}
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

WithAsyncFunctionExample.propTypes = argProps;

export const WithAsyncFunction = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  render: (args) => <WithAsyncFunctionExample {...args} />,
};

const WithPlainAsyncFunctionExample = ({ debug }) => {
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

WithPlainAsyncFunctionExample.propTypes = argProps;

export const WithPlainAsyncFunction = {
  render: (args) => <WithPlainAsyncFunctionExample {...args} />,
};

const WithErroringAsyncFunctionExample = ({ debug }) => {
  const { fetch } = useExampleDataQuery({ endpoint: '/api/error', skip: true });

  return (
    <TableToolsTable
      items={fetch}
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

WithErroringAsyncFunctionExample.propTypes = argProps;

export const WithErroringAsyncFunction = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  render: (args) => <WithErroringAsyncFunctionExample {...args} />,
};

const WithErrorPassedExample = ({ debug }) => {
  const {
    loading,
    result: { data, meta: { total } = {} } = {},
    error,
  } = useExampleDataQuery({ endpoint: '/api/error' });

  return (
    <TableToolsTable
      loading={loading}
      items={data}
      error={error}
      total={total}
      columns={columns}
      filters={{ filterConfig: filters }}
      options={{ ...defaultOptions, debug }}
    />
  );
};

WithErrorPassedExample.propTypes = argProps;

export const WithErrorPassed = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <TableStateProvider>
          <Story />
        </TableStateProvider>
      </QueryClientProvider>
    ),
  ],
  render: (args) => <WithErrorPassedExample {...args} />,
};

export default meta;
