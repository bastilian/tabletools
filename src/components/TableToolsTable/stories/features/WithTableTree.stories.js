import React, { useEffect } from 'react';
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
import { actions } from '~/support/constants';
// TODO fix preselection
// import { selectedItemIds } from '~/support/api';
const selectedItemIds = [];
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
  title: 'Components/TableToolsTable/Features',
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
    if (Object.keys(filterState || {}).length && tableView === 'tree') {
      setView('rows');
    }
  }, [filterState, setView, tableView]);

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

export default meta;
