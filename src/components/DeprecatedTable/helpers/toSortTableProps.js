/**
 * Maps sort props to deprecated PatternFly Table props with column offset for non-data columns.
 *
 *  @param   {object}        [params]                 Sort inputs
 *  @param   {object}        [params.sortBy]          Current sort state
 *  @param   {Function}      [params.onSort]          Sort change handler
 *  @param   {Array}         [params.sortableColumns] Columns with sortable transforms
 *  @param   {object|number} [options]                Adapter options or numeric column offset
 *  @param   {boolean}       [options.hasSelect]      Whether selection column is present
 *  @param   {boolean}       [options.hasExpand]      Whether expand column is present
 *  @param   {boolean}       [options.isTree]         Whether tree view is active
 *  @param   {number}        [options.offset]         Direct column offset override
 *  @returns {object}                                 Table props, or `{}`
 */
export const toSortTableProps = (
  { sortBy, onSort, sortableColumns } = {},
  options = {},
) => {
  if (!onSort) {
    return {};
  }

  const offset =
    typeof options === 'number'
      ? options
      : typeof options.offset === 'number'
        ? options.offset
        : Boolean(options.hasSelect) +
          Boolean(options.hasExpand) -
          (options.isTree ? 1 : 0);

  const safeOffset = Math.max(0, offset);

  return {
    onSort: (_, index, direction, extra) =>
      onSort(_, index - safeOffset, direction, extra),
    sortBy: sortBy && {
      ...sortBy,
      index: sortBy.index + safeOffset,
    },
    cells: sortableColumns,
  };
};
