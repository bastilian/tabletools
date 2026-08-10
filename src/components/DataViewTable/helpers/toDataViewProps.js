/**
 * Adapts deprecated PatternFly Table props from useTableTools into
 * PatternFly DataViewTable columns/rows.
 *
 * Filter out rows without an `item` to avoid rendering empty/error placeholder rows.
 *
 *  @param   {object}                          tableProps `tableProps` returned by useTableTools
 *  @returns {{ columns: Array, rows: Array }}            DataView-compatible props
 */
export const toDataViewProps = (tableProps = {}) => {
  const addSortIfSortable = (column, index) => {
    if (column.sortable) {
      return {
        sort: {
          sortBy: tableProps.sortBy,
          onSort: tableProps.onSort,
          columnIndex: index,
        },
      };
    }
    return {};
  };

  const columns = (tableProps.cells || []).map((column, index) => {
    return {
      cell: column.title,
      props: { ...addSortIfSortable(column, index) },
    };
  });

  const rows = (tableProps.rows || [])
    .filter((row) => row.item != null)
    .map((row, index) => ({
      id: String(row.item.itemId ?? row.item.id ?? index),
      row: (row.cells || []).map((cell) => cell?.title),
    }));

  return { columns, rows };
};
