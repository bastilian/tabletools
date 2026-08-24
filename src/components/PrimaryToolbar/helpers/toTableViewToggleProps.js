/**
 * Maps table view props to TableViewToggle props.
 *
 *  @param   {object}           [params]                Table view inputs
 *  @param   {boolean}          [params.enableToggle]   Whether the view toggle should render
 *  @param   {object}           [params.choosableViews] Views available for the toggle
 *  @param   {Function}         [params.setTableView]   Sets the current table view
 *  @param   {string}           [params.view]           Current table view key
 *  @returns {object|undefined}                         Toggle props, or `undefined`
 */
export const toTableViewToggleProps = ({
  enableToggle,
  choosableViews,
  setTableView,
  view,
} = {}) =>
  enableToggle
    ? {
        views: choosableViews,
        onToggle: setTableView,
        currentTableView: view,
      }
    : undefined;
