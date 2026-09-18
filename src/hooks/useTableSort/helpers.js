import { sortable } from '@patternfly/react-table';
import uniq from 'lodash/uniq';

const isSortable = (column) => !!column.sortable;

export const addSortableTransform = (columns) =>
  columns.map((column) => ({
    ...column,
    ...(isSortable(column)
      ? {
          transforms: uniq([...(column?.transforms || []), sortable]),
        }
      : {}),
  }));
