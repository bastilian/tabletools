import React from 'react';
import { ListIcon, TreeviewIcon } from '@patternfly/react-icons';
import { Spinner } from '@patternfly/react-core';
import { ErrorState } from '@redhat-cloud-services/frontend-components/ErrorState';

import NoResultsTable from '~/components/NoResultsTable';

import { treeColumns, getOnTreeSelect, emptyRows } from './helpers';
import rowsBuilder from './rowsBuilder';
import treeChopper from './treeChopper';

const views = {
  loading: {
    tableProps: (_items, columns) => ({
      rows: [
        {
          cells: [
            {
              title: () => <Spinner />,
              props: {
                colSpan: columns.length,
              },
            },
          ],
        },
      ],
    }),
    checkOptions: () => true,
  },
  error: {
    tableProps: (_items, columns) => ({
      rows: [
        {
          cells: [
            {
              title: () => <ErrorState />,
              props: {
                colSpan: columns.length,
              },
            },
          ],
        },
      ],
    }),
    checkOptions: () => true,
  },
  empty: {
    tableProps: (items, columns, options) => {
      const {
        emptyRows: customEmptyRows,
        kind,
        EmptyState: CustomEmptyState,
      } = options;
      const EmptyStateComponent = CustomEmptyState || NoResultsTable;

      return customEmptyRows
        ? { rows: customEmptyRows }
        : emptyRows(EmptyStateComponent, kind, columns, items, options);
    },
    checkOptions: () => true,
  },
  rows: {
    tableProps: (items, columns, options) => {
      const rows = rowsBuilder(items, columns, options);

      return rows ? { rows } : {};
    },
    icon: ListIcon,
    checkOptions: () => true,
  },
  tree: {
    tableProps: (items, columns, options) => {
      const rows = treeChopper(items, columns, options);
      const onSelect = getOnTreeSelect(options);
      const cells = treeColumns(
        columns,
        options.expandable?.onCollapse,
        options.bulkSelect?.enableBulkSelect && onSelect,
      );

      return rows
        ? {
            cells,
            rows,
            isTreeTable: true,
            onSelect: undefined,
          }
        : {};
    },
    icon: TreeviewIcon,
    toolbarProps: () => ({
      variant: 'compact',
      bulkSelect: undefined,
    }),
    checkOptions: ({ enableTreeView }) => enableTreeView,
  },
};

export default views;
