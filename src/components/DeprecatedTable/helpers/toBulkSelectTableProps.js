/**
 * Maps bulk select props to deprecated PatternFly Table props.
 *
 *  @param   {object}   [params]                  Bulk select inputs
 *  @param   {boolean}  [params.enableBulkSelect] Whether bulk selection is enabled
 *  @param   {number}   [params.total]            Total number of items
 *  @param   {Function} [params.selectOne]        Handler for selecting a single row
 *  @returns {object}                             Table props, or `{}`
 */
export const toBulkSelectTableProps = ({
  enableBulkSelect,
  total,
  selectOne,
} = {}) =>
  enableBulkSelect
    ? {
        onSelect: total > 0 ? selectOne : undefined,
        canSelectAll: false,
      }
    : {};
