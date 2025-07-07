import React from 'react';
import propTypes from 'prop-types';

import columns from '~/support/factories/columns';
import filters, {
  customNumberFilterType,
  customNumberFilter,
} from '~/support/factories/filters';
import itemsFactory from '~/support/factories/items';
import defaultStoryMeta from '~/support/defaultStoryMeta';
import CustomEmptyState from '~/support/components/CustomEmptyState';
import DetailsRow from '~/support/components/DetailsRow';

import { StaticTableToolsTable } from '~/components';

const arrayOfItems = itemsFactory(505);

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

export default meta;
