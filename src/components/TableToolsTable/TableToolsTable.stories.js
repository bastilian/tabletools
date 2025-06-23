import React, { useCallback } from 'react';
import propTypes from 'prop-types';
import {
  Page,
  PageSection,
  Panel,
  PanelMain,
  PanelMainBody,
} from '@patternfly/react-core';

import { TableToolsTable, TableStateProvider } from '~/components';
import { useFullTableState } from '~/hooks';

import CustomEmptyState from '~/support/components/CustomEmptyState';
import DetailsRow from '~/support/components/DetailsRow';
import NumberFilter from '~/support/components/NumberFilter';

import columns from '~/support/factories/columns';
import filters from '~/support/factories/filters';

import paginationSerialiser from '~/support/serialisers/pagination';
import sortSerialiser from '~/support/serialisers/sort';
import filtersSerialiser from '~/support/serialisers/filters';
import useExampleDataQuery from '~/support/hooks/useExampleDataQuery';

import mswHandlers from '~/support/mswHandler';

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
    sortable: false,
    manageColumns: false,
    customEmptyRows: false,
    customEmptyState: false,
    enableExport: false,
    enableDetails: false,
    enableBulkSelect: false,
  },
  parameters: {
    msw: {
      handlers: mswHandlers,
    },
  },
  decorators: [
    (Story) => (
      <Page>
        <PageSection>
          <Panel>
            <PanelMain>
              <PanelMainBody>
                <Story />
              </PanelMainBody>
            </PanelMain>
          </Panel>
        </PageSection>
      </Page>
    ),
  ],
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
  } = useExampleDataQuery({ endpoint: '/api' });

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
      {...(filters
        ? {
            filters: { filterConfig: filters },
          }
        : {})}
      options={{
        ...defaultOptions,
        manageColumns,
        ...(customEmptyRows ? { emptyRows: emptyRows(2) } : {}),
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
        debug,
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

const customNumberFilterType = {
  Component: NumberFilter,
  chips: (value) => [value],
  selectValue: (value) => [value, true],
  deselectValue: () => [undefined, true],
};

const customNumberFilter = {
  type: 'number',
  label: 'Number Filter',
  filterAttribute: 'rating',
};

const WithCustomFilterExample = ({ debug }) => {
  const {
    loading,
    result: { data, meta: { total } = {} } = {},
    error,
  } = useExampleDataQuery({ endpoint: '/api' });

  return (
    <TableToolsTable
      loading={loading}
      items={data}
      total={total}
      error={error}
      columns={columns}
      filters={{
        filterConfig: [customNumberFilter],
        customFilterTypes: {
          number: customNumberFilterType,
        },
      }}
      options={{ ...defaultOptions, debug }}
    />
  );
};

WithCustomFilterExample.propTypes = argProps;

export const WithCustomFilter = {
  decorators: [
    (Story) => (
      <TableStateProvider>
        <Story />
      </TableStateProvider>
    ),
  ],
  render: (args) => <WithCustomFilterExample {...args} />,
};

const WithTableTreeExample = ({
  debug,
  columns,
  filters,
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
  });

  const {
    result: tableTree,
    loading: treeLoading,
    error: treeError,
  } = useExampleDataQuery({
    endpoint: '/api/tree',
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
      filters={{ filterConfig: filters }}
      options={{
        ...defaultOptions,
        debug,
        manageColumns,
        detailsComponent: DetailsRow,
        exporter,
        onSelect: (selected) => {
          console.log('Currently selected', selected);
        },
        itemIdsInTable,
        itemIdsOnPage,
        enableTreeView: true,
        defaultTableView: 'tree',
        tableTree,
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
  filtered,
  sortable,
  manageColumns,
  customEmptyRows,
  customEmptyState,
}) => {
  const { fetch } = useExampleDataQuery({ endpoint: '/api', skip: true });

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
      {...(filtered
        ? {
            filters: { filterConfig: filters },
          }
        : {})}
      options={{
        ...defaultOptions,
        debug,
        manageColumns,
        ...(customEmptyRows ? { emptyRows: emptyRows(2) } : {}),
        ...(customEmptyState ? { EmptyState: CustomEmptyState } : {}),
      }}
    />
  );
};

WithAsyncFunctionExample.propTypes = argProps;

export const WithAsyncFunction = {
  args: {
    filtered: false,
    sortable: false,
    manageColumns: false,
    customEmptyRows: false,
    customEmptyState: false,
  },
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
