import { ListIcon, TreeviewIcon } from '@patternfly/react-icons';

import { treeColumns, getOnTreeSelect, emptyRows, errorRows } from './helpers';
import rowsBuilder from './rowsBuilder';
import treeChopper from './treeChopper';

const views = {
  rows: {
    tableProps: (_loading, items, error, total, options) => {
      const { kind, columns } = options;

      if (error) {
        return errorRows(columns);
      } else if (total === 0) {
        return emptyRows(kind, columns, items, options);
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
      const { columns, tableTree, kind } = options;

      if (error) {
        return errorRows(columns);
      } else if (tableTree?.length === 0) {
        return emptyRows(kind, columns, items, options);
      } else {
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
      }
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
