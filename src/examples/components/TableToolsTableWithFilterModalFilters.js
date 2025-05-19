import React from 'react';

import { TableStateProvider } from '~/components';
import columns from '~/support/factories/columns';
import { genres } from '~/support/factories/items';

import useExampleDataQuery from '../hooks/useExampleDataQuery';
import ExamplesTable from './ExamplesTable';

const TableToolsTableWithFilterModalFilters = () => {
  const { result: { data, meta: { total } = {} } = {} } = useExampleDataQuery();
  const genreFilterOptions = genres.map((genre) => ({
    label: genre,
    value: genre,
  }));

  return (
    <ExamplesTable
      items={data}
      columns={columns}
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
                []
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
                { pagination: { state } = { page: 1, perPage: 10 } } = {}
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
      total={total}
    />
  );
};

const TableToolsTableWithFilterModalFiltersWrapper = (props) => (
  <TableStateProvider>
    <TableToolsTableWithFilterModalFilters {...props} />
  </TableStateProvider>
);

export default TableToolsTableWithFilterModalFiltersWrapper;
