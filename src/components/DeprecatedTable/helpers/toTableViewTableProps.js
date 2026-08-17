/**
 * Maps table view props to deprecated PatternFly Table props.
 *
 *  @param   {object}  [params]                Table view inputs
 *  @param   {string}  [params.view]           Current table view key
 *  @param   {boolean} [params.loading]        Loading state
 *  @param   {Array}   [params.items]          Items to render
 *  @param   {object}  [params.error]          Error state
 *  @param   {number}  [params.total]          Total item count
 *  @param   {object}  [params.viewOptions]    Options for view builders
 *  @param   {object}  [params.supportedViews] Enabled views for current options
 *  @returns {object}                          Table props, or `{}`
 */
export const toTableViewTableProps = ({
  view,
  loading,
  items,
  error,
  total,
  viewOptions,
  supportedViews,
} = {}) => {
  const tableView = view || 'rows';

  return (
    supportedViews?.[tableView]?.tableProps?.(
      loading,
      items,
      error,
      total,
      viewOptions,
    ) || {}
  );
};
