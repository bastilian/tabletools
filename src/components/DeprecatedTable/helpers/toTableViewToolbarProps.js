/**
 * Maps table view props to FEC PrimaryToolbar props for the active view.
 *
 *  @param   {object}  [params]                Table view inputs
 *  @param   {string}  [params.view]           Current table view key
 *  @param   {boolean} [params.loading]        Loading state
 *  @param   {Array}   [params.items]          Items to render
 *  @param   {object}  [params.error]          Error state
 *  @param   {number}  [params.total]          Total item count
 *  @param   {object}  [params.viewOptions]    Options for view builders
 *  @param   {object}  [params.supportedViews] Enabled views for current options
 *  @returns {object}                          `{ toolbarProps }` or `{}`
 */
export const toTableViewToolbarProps = ({
  view,
  loading,
  items,
  error,
  total,
  viewOptions,
  supportedViews,
} = {}) => {
  const tableView = view || 'rows';
  const toolbarProps =
    supportedViews?.[tableView]?.toolbarProps?.(
      loading,
      items,
      error,
      total,
      viewOptions,
    ) || {};

  return Object.keys(toolbarProps).length ? { toolbarProps } : {};
};
