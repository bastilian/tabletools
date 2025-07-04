import React from 'react';
import propTypes from 'prop-types';
import {
  Page,
  PageSection,
  Panel,
  PanelMain,
  PanelMainBody,
} from '@patternfly/react-core';

import { StaticTableToolsTable } from '~/components';

import CustomEmptyState from '~/support/components/CustomEmptyState';
import DetailsRow from '~/support/components/DetailsRow';

import columns from '~/support/factories/columns';
import filters, {
  customNumberFilterType,
  customNumberFilter,
} from '~/support/factories/filters';
import itemsFactory from '~/support/factories/items';
import mswHandlers from '~/support/mswHandler';

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
        ...(customEmptyRows ? { emptyRows: emptyRows(columns?.length) } : {}),
        ...(customEmptyState ? { EmptyState: CustomEmptyState } : {}),
        ...(enableExport ? { exporter: () => arrayOfItems } : {}),
        ...(enableDetails ? { detailsComponent: DetailsRow } : {}),
        ...(enableBulkSelect
          ? {
              onSelect: (selected) => {
                console.log('Currently selected', selected);
              },
              // TODO verify these work when using an async function
              itemIdsInTable: () => arrayOfItems.map(({ id }) => id),
              itemIdsOnPage: () => arrayOfItems.map(({ id }) => id),
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
