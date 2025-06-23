import { ListIcon, TreeviewIcon } from '@patternfly/react-icons';

import NoResultsTable from '~/components/NoResultsTable';

import { treeColumns, getOnTreeSelect, emptyRows, errorRows } from './helpers';
import rowsBuilder from './rowsBuilder';
import treeChopper from './treeChopper';

const views = {
  rows: {
    tableProps: (_loading, items, error, total, options) => {
      const {
        emptyRows: customEmptyRows,
        kind,
        EmptyState: CustomEmptyState,
        columns,
      } = options;

      if (error) {
        return errorRows(columns);
      }

      if (total === 0) {
        const EmptyStateComponent = CustomEmptyState || NoResultsTable;

        return customEmptyRows
          ? { rows: customEmptyRows }
          : emptyRows(EmptyStateComponent, kind, columns, items, options);
      } else {
        const rows = rowsBuilder(items, columns, options);

        return rows ? { rows } : {};
      }
    },
    icon: ListIcon,
    checkOptions: () => true,
  },
  tree: {
    tableProps: (_loading, items, error, _total, options) => {
      const { columns } = options;

      if (error) {
        return errorRows(columns);
      }

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
