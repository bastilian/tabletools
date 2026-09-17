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

/**
 * Calculates how many extra columns (like checkboxes or expand arrows)
 * are placed before the data columns in the table.
 *
 * This offset ensures sorting points to the right column header:
 * - Checkboxes + Expand arrows: offset = 2
 * - Expand arrows only:         offset = 1
 * - Checkboxes only:            offset = 1
 * - Plain table (neither):      offset = 0
 *
 *  @param   {object} [options] - Table configuration options
 *  @returns {number}           The number of extra columns before data columns
 */
export const columnOffset = (options = {}) => {
  const init =
    (typeof options.onSelect === 'function') +
    (typeof options.detailsComponent !== 'undefined');
  return options.tableView === 'tree' ? init - 1 : init;
};
