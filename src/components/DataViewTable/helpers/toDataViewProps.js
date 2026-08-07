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
  const columns = (tableProps.cells || []).map((column) =>
    typeof column.title === 'string' || column.title == null
      ? column.title
      : { cell: column.title },
  );

  const rows = (tableProps.rows || [])
    .filter((row) => row.item != null)
    .map((row, index) => ({
      id: String(row.item.itemId ?? row.item.id ?? index),
      row: (row.cells || []).map((cell) =>
        typeof cell?.title === 'function' ? cell.title() : cell?.title,
      ),
    }));

  return { columns, rows };
};
