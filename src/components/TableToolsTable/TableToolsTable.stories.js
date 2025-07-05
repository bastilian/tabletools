import React, { useCallback } from 'react';
import propTypes from 'prop-types';

import { TableToolsTable, TableStateProvider } from '~/components';
import { useFullTableState } from '~/hooks';

import CustomEmptyState from '~/support/components/CustomEmptyState';
import DetailsRow from '~/support/components/DetailsRow';

import defaultStoryMeta from '~/support/defaultStoryMeta';
import columns from '~/support/factories/columns';
import filters, {
  customNumberFilterType,
  customNumberFilter,
} from '~/support/factories/filters';
import paginationSerialiser from '~/support/serialisers/pagination';
import sortSerialiser from '~/support/serialisers/sort';
import filtersSerialiser from '~/support/serialisers/filters';
import useExampleDataQuery from '~/support/hooks/useExampleDataQuery';


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
  sortable: propTypes.bool,
  manageColumns: propTypes.bool,
  customEmptyRows: propTypes.bool,
  customEmptyState: propTypes.bool,
  enableExport: propTypes.bool,
  enableDetails: propTypes.bool,
  enableBulkSelect: propTypes.bool,
};

const meta = {
  title: 'TableToolsTable',
  args: {
    debug: true,
    columns,
    filters,
    filtered: true,
    sortable: true,
    manageColumns: true,
    customEmptyRows: true,
    customEmptyState: true,
    enableExport: true,
    enableDetails: true,
    enableBulkSelect: true,
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
  sortable,
  manageColumns,
  customEmptyRows,
  customEmptyState,
  enableExport,
  enableDetails,
  enableBulkSelect,
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
            },
          }
        : {})}
      options={{
        ...defaultOptions,
        debug,
        manageColumns,
        ...(customEmptyRows ? { emptyRows: emptyRows(columns?.length) } : {}),
        ...(customEmptyState ? { EmptyState: CustomEmptyState } : {}),
        ...(enableExport ? { exporter } : {}),
        ...(enableDetails ? { detailsComponent: DetailsRow } : {}),
        ...(enableBulkSelect
          ? {
              onSelect: (selected) => {
                console.log('Currently selected', selected);
              },
              itemIdsInTable,
              itemIdsOnPage,
            }
          : {}),
      }}
    />
  );
};

CommonExample.propTypes = argProps;

export const Common = {
  decorators: [
    (Story) => (
      <TableStateProvider>
        <Story />
      </TableStateProvider>
    ),
  ],
  render: (args) => <CommonExample {...args} />,
};

const WithTableTreeExample = ({
  debug,
  columns,
  filters,
  filtered,
  sortable,
  manageColumns,
  customEmptyRows,
  customEmptyState,
  enableExport,
  enableDetails,
  enableBulkSelect,
}) => {
  const { tableState: { tableView } = {} } = useFullTableState() || {};

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
        ...(customEmptyRows ? { emptyRows: emptyRows(columns?.length) } : {}),
        ...(customEmptyState ? { EmptyState: CustomEmptyState } : {}),
        ...(enableExport ? { exporter } : {}),
        ...(enableDetails ? { detailsComponent: DetailsRow } : {}),
        ...(enableBulkSelect
          ? {
              onSelect: (selected) => {
                console.log('Currently selected', selected);
              },
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
      <TableStateProvider>
        <Story />
      </TableStateProvider>
    ),
  ],
  render: (args) => <WithTableTreeExample {...args} />,
};

const WithAsyncFunctionExample = ({
  debug,
  columns,
  filters,
  filtered,
  sortable,
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
            },
          }
        : {})}
      options={{
        ...defaultOptions,
        debug,
        manageColumns,
        ...(customEmptyRows ? { emptyRows: emptyRows(columns?.length) } : {}),
        ...(customEmptyState ? { EmptyState: CustomEmptyState } : {}),
        ...(enableExport ? { exporter } : {}),
        ...(enableDetails ? { detailsComponent: DetailsRow } : {}),
        ...(enableBulkSelect
          ? {
              onSelect: (selected) => {
                console.log('Currently selected', selected);
              },
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
  render: (args) => <WithAsyncFunctionExample {...args} />,
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
      <TableStateProvider>
        <Story />
      </TableStateProvider>
    ),
  ],
  render: (args) => <WithErrorPassedExample {...args} />,
};

export default meta;
