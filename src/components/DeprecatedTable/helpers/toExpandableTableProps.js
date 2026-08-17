/**
 * Maps expandable props to deprecated PatternFly Table props.
 *
 *  @param   {object}   [params]                    Expandable inputs
 *  @param   {boolean}  [params.enableExpandingRow] Whether expandable rows are enabled
 *  @param   {Function} [params.onCollapse]         Expand/collapse handler
 *  @param   {boolean}  [params.canCollapseAll]     Whether collapse-all is enabled
 *  @param   {boolean}  [params.enableTreeView]     Whether tree view mode is enabled
 *  @returns {object}                               Table props, or `{}`
 */
export const toExpandableTableProps = ({
  enableExpandingRow,
  onCollapse,
  canCollapseAll,
  enableTreeView,
} = {}) =>
  enableExpandingRow && onCollapse
    ? {
        ...(!enableTreeView ? { canCollapseAll } : {}),
        onCollapse,
      }
    : {};
