import React from 'react';
import propTypes from 'prop-types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Bullseye, Spinner } from '@patternfly/react-core';
import columns from '~/support/factories/columns';
import filters, {
  customNumberFilterType,
  customNumberFilter,
} from '~/support/factories/filters';
import itemsFactory from '~/support/factories/items';
import defaultStoryMeta from '~/support/defaultStoryMeta';
import useExampleDataQuery from '~/support/hooks/useExampleDataQuery';
import CustomEmptyState from '~/support/components/CustomEmptyState';
import DetailsRow from '~/support/components/DetailsRow';
import DedicatedAction from '~/support/components/DedicatedAction';
import { actions, rowActionResolver } from '~/support/constants';

import { StaticTableToolsTable } from '~/components';

const arrayOfItems = itemsFactory(505);

const queryClient = new QueryClient();

const argProps = {
  debug: propTypes.bool,
  columns: propTypes.array,
  filters: propTypes.array,
  filtered: propTypes.bool,
  sortable: propTypes.bool,
  enableRowActions: propTypes.bool,
  enableActions: propTypes.bool,
  dedicatedAction: propTypes.bool,
  manageColumns: propTypes.bool,
  customEmptyRows: propTypes.bool,
  customEmptyState: propTypes.bool,
  enableExport: propTypes.bool,
  enableDetails: propTypes.bool,
  enableBulkSelect: propTypes.bool,
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

const meta = {
  title: 'Static TableToolsTable',
  args: {
    debug: true,
    columns,
    filters,
    filtered: true,
    sortable: true,
    enableRowActions: true,
    enableActions: true,
    dedicatedAction: true,
    manageColumns: true,
    customEmptyRows: true,
    customEmptyState: true,
    enableExport: true,
    enableDetails: true,
    enableBulkSelect: true,
  },
  ...defaultStoryMeta,
};

const StaticTableExample = ({
  debug,
  columns,
  filters,
  filtered,
  sortable,
  manageColumns,
  enableRowActions,
  enableActions,
  dedicatedAction,
  customEmptyRows,
  customEmptyState,
  enableExport,
  enableDetails,
  enableBulkSelect,
}) => {
  return (
    <StaticTableToolsTable
      items={arrayOfItems}
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
        debug,
        manageColumns,
        enableExport,
        ...(enableRowActions
          ? {
              actionResolver: rowActionResolver,
            }
          : {}),
        ...(enableActions ? { actions } : {}),
        ...(dedicatedAction ? { dedicatedAction: DedicatedAction } : {}),
        ...(customEmptyRows ? { emptyRows: emptyRows(columns?.length) } : {}),
        ...(customEmptyState ? { EmptyState: CustomEmptyState } : {}),
        ...(enableDetails ? { detailsComponent: DetailsRow } : {}),
        ...(enableBulkSelect
          ? {
              onSelect: (selected) => {
                console.log('Currently selected', selected);
              },
            }
          : {}),
      }}
    />
  );
};

StaticTableExample.propTypes = argProps;

export const Common = {
  render: (args) => <StaticTableExample {...args} />,
};

const StaticTableWithBatchfetchedItemsExample = ({
  debug,
  columns,
  filters,
  filtered,
  sortable,
  manageColumns,
  enableRowActions,
  enableActions,
  dedicatedAction,
  customEmptyRows,
  customEmptyState,
  enableExport,
  enableDetails,
  enableBulkSelect,
}) => {
  const { loading, result: { data } = {} } = useExampleDataQuery({
    endpoint: '/api',
    batched: true,
  });

  return (
    <>
      {loading ? (
        <Bullseye>
          <Spinner />
        </Bullseye>
      ) : (
        <StaticTableToolsTable
          items={data}
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
            debug,
            manageColumns,
            enableExport,
            ...(enableRowActions
              ? {
                  actionResolver: rowActionResolver,
                }
              : {}),
            ...(enableActions ? { actions } : {}),
            ...(dedicatedAction ? { dedicatedAction: DedicatedAction } : {}),
            ...(customEmptyRows
              ? { emptyRows: emptyRows(columns?.length) }
              : {}),
            ...(customEmptyState ? { EmptyState: CustomEmptyState } : {}),
            ...(enableDetails ? { detailsComponent: DetailsRow } : {}),
            ...(enableBulkSelect
              ? {
                  onSelect: (selected) => {
                    console.log('Currently selected', selected);
                  },
                }
              : {}),
          }}
        />
      )}
    </>
  );
};

StaticTableWithBatchfetchedItemsExample.propTypes = argProps;

export const WithBatchfetchedItems = {
  render: (args) => (
    <QueryClientProvider client={queryClient}>
      <StaticTableWithBatchfetchedItemsExample {...args} />
    </QueryClientProvider>
  ),
};
export default meta;
