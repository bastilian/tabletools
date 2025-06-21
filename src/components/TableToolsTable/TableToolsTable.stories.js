/* eslint-disable react-hooks/rules-of-hooks */
import React, { useCallback } from 'react';
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
import { genres } from '~/support/factories/items';

import paginationSerialiser from '~/support/serialisers/pagination';
import sortSerialiser from '~/support/serialisers/sort';
import filtersSerialiser from '~/support/serialisers/filters';
import useExampleDataQuery from '~/support/hooks/useExampleDataQuery';

import { fakePlasticTreeApi } from '~/support/fakeApi';

const defaultOptions = {
  serialisers: {
    pagination: paginationSerialiser,
    sort: sortSerialiser,
    filters: filtersSerialiser,
  },
};

const meta = {
  title: 'TableToolsTable',
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

export const Common = {
  args: {
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

  decorators: [
    (Story) => (
      <TableStateProvider>
        <Story />
      </TableStateProvider>
    ),
  ],
  render: ({
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
      result: { data, meta: { total } = {} } = {},
      exporter,
      itemIdsInTable,
      itemIdsOnPage,
    } = useExampleDataQuery();

    return (
      <TableToolsTable
        items={data}
        columns={
          sortable
            ? columns
            : columns.map((column) => ({ ...column, sortable: undefined }))
        }
        total={total}
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
        }}
      />
    );
  },
};

export const WithFilterModal = {
  decorators: [
    (Story) => (
      <TableStateProvider>
        <Story />
      </TableStateProvider>
    ),
  ],
  render: () => {
    const { result: { data, meta: { total } = {} } = {} } =
      useExampleDataQuery();
    const genreFilterOptions = genres.map((genre) => ({
      label: genre,
      value: genre,
    }));

    return (
      <TableToolsTable
        items={data}
        total={total}
        columns={columns}
        options={defaultOptions}
        filters={{
          filterConfig: [
            {
              type: 'group',
              label: 'Years by decade',
              filterSerialiser: (_filterConfigItem, value) => {
                const allYears = Object.entries(value).reduce(
                  (years, [, groupYears]) => [
                    ...years,
                    ...Object.keys(groupYears),
                  ],
                  [],
                );

                return `.releaseYear in [${allYears.join(', ')}]`;
              },
              groups: [
                {
                  label: '80s',
                  value: '80s',
                  items: [...new Array(10)].map((_, idx) => ({
                    label: `198${idx}`,
                    value: `198${idx}`,
                  })),
                },
                {
                  label: '90s',
                  value: '90s',
                  items: [...new Array(10)].map((_, idx) => ({
                    label: `199${idx}`,
                    value: `199${idx}`,
                  })),
                },
                {
                  label: '00s',
                  value: '00s',
                  items: [...new Array(10)].map((_, idx) => ({
                    label: `200${idx}`,
                    value: `200${idx}`,
                  })),
                },
                {
                  label: '10s',
                  value: '10s',
                  items: [...new Array(10)].map((_, idx) => ({
                    label: `201${idx}`,
                    value: `201${idx}`,
                  })),
                },
                {
                  label: '20s',
                  value: '20s',
                  items: [...new Array(5)].map((_, idx) => ({
                    label: `201${idx}`,
                    value: `201${idx}`,
                  })),
                },
              ],
              modal: {
                title: 'Select years to filter by',
              },
            },
            {
              type: 'checkbox',
              label: 'Genre With Modal',
              filterAttribute: 'genre',
              items: genreFilterOptions,
              modal: true,
            },
            {
              type: 'checkbox',
              label: 'Genre With fetched items',
              filterAttribute: 'genre',
              items: async () => genreFilterOptions,
              modal: true,
            },
            {
              type: 'checkbox',
              label: 'Genre With fetched items and modal items',
              filterAttribute: 'genre',
              items: genreFilterOptions,
              modal: {
                items: async (
                  _serialisedState,
                  { pagination: { state } = { page: 1, perPage: 10 } } = {},
                ) => {
                  const offset = (state?.page - 1) * state?.perPage;
                  const limit = state?.perPage;

                  return [
                    genreFilterOptions
                      .slice(offset, offset + limit)
                      .map((item) => ({ ...item, id: item.value })),
                    genreFilterOptions.length,
                  ];
                },
              },
            },
          ],
        }}
      />
    );
  },
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

export const WithCustomFilter = {
  decorators: [
    (Story) => (
      <TableStateProvider>
        <Story />
      </TableStateProvider>
    ),
  ],
  render: () => {
    const { result: { data, meta: { total } = {} } = {} } =
      useExampleDataQuery();

    return (
      <TableToolsTable
        items={data}
        columns={columns}
        filters={{
          filterConfig: [customNumberFilter],
          customFilterTypes: {
            number: customNumberFilterType,
          },
        }}
        total={total}
        options={defaultOptions}
      />
    );
  },
};

export const WithTableTree = {
  decorators: [
    (Story) => (
      <TableStateProvider>
        <Story />
      </TableStateProvider>
    ),
  ],
  render: () => {
    const { tableState: { tableView } = {} } = useFullTableState() || {};

    const {
      result: { data, meta: { total } = {} } = {},
      exporter,
      itemIdsInTable,
      itemIdsOnPage,
    } = useExampleDataQuery({
      ...(tableView === 'tree'
        ? { params: { limit: 'max', sort: 'id:asc' } }
        : {}),
    });

    const { result: tableTree } = useExampleDataQuery({
      api: fakePlasticTreeApi,
    });

    return (
      <TableToolsTable
        items={data}
        columns={columns}
        filters={{ filterConfig: filters }}
        total={total}
        options={{
          ...defaultOptions,
          manageColumns: true,
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
        }}
      />
    );
  },
};

export const WithAsyncFunction = {
  args: {
    filtered: false,
    sortable: false,
    manageColumns: false,
    customEmptyRows: false,
    customEmptyState: false,
  },
  render: ({
    filtered,
    sortable,
    manageColumns,
    customEmptyRows,
    customEmptyState,
  }) => {
    const { fetch } = useExampleDataQuery();

    const fetchItems = useCallback(
      async ({ pagination = {}, filters, sort } = {}) => {
        const {
          data: items,
          meta: { total },
        } = await fetch({
          ...pagination,
          filters,
          sort,
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
          manageColumns,
          ...(customEmptyRows ? { emptyRows: emptyRows(2) } : {}),
          ...(customEmptyState ? { EmptyState: CustomEmptyState } : {}),
        }}
      />
    );
  },
};

export const WithErroringAsyncFunction = {
  render: () => {
    const failingFetchItems = useCallback(async () => {
      throw 'Erorr loading items!';
    }, []);

    return (
      <TableToolsTable
        items={failingFetchItems}
        columns={columns}
        filters={{ filterConfig: filters }}
        options={{
          ...defaultOptions,
          manageColumns: true,
          kind: 'songs',
        }}
      />
    );
  },
};

export const WithErrorPassed = {
  render: () => {
    return (
      <TableToolsTable
        items={undefined}
        error={new Error('Error passed in to table')}
        columns={columns}
        filters={{ filterConfig: filters }}
      />
    );
  },
};

export default meta;
