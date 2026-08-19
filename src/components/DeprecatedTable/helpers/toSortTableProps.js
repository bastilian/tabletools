/**
 * Maps sort props to deprecated PatternFly Table props.
 *
 *  @param   {object}   [params]                 Sort inputs
 *  @param   {object}   [params.sortBy]          Current sort state
 *  @param   {Function} [params.onSort]          Sort change handler
 *  @param   {Array}    [params.sortableColumns] Columns with sortable transforms
 *  @returns {object}                            Table props, or `{}`
 */
export const toSortTableProps = ({ sortBy, onSort, sortableColumns } = {}) =>
  onSort
    ? {
        onSort,
        sortBy,
        cells: sortableColumns,
      }
    : {};
