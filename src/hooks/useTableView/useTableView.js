import { useMemo } from 'react';

import useViews from './hooks/useViews';
import useViewState from './hooks/useViewState';

/**
 *  @typedef {object} useTableViewProps
 *
 *  @property {string}   view           Current table view key
 *  @property {Function} setTableView   Sets the current table view
 *  @property {object}   choosableViews Views available for the view toggle
 *  @property {object}   supportedViews Views enabled for the current options
 *  @property {boolean}  enableToggle   Whether the view toggle should render
 *  @property {boolean}  loading        Loading state passed to view builders
 *  @property {Array}    items          Items passed to view builders
 *  @property {object}   error          Error passed to view builders
 *  @property {number}   total          Total count passed to view builders
 *  @property {object}   viewOptions    Options passed to view builders
 */

/**
 * Provides table view state for table tools.
 *
 *  @param   {boolean}           loading   Loading state
 *  @param   {Array}             items     Items to render
 *  @param   {object}            error     Error state
 *  @param   {number}            total     Total item count
 *  @param   {object}            [options] AsyncTableTools options
 *
 *  @returns {useTableViewProps}           Table view props for variant adapters
 *
 *  @group Hooks
 *
 */
const useTableView = (loading, items, error, total, options = {}) => {
  const { showViewToggle } = options;
  const { setTableView, tableView } = useViewState(options);
  const { supportedViews, choosableViews } = useViews(options);

  const enableToggle = useMemo(
    () =>
      typeof showViewToggle === 'boolean'
        ? showViewToggle
        : Object.keys(choosableViews).length > 1,
    [choosableViews, showViewToggle],
  );

  return {
    view: tableView,
    setTableView,
    choosableViews,
    supportedViews,
    enableToggle,
    loading,
    items,
    error,
    total,
    viewOptions: options,
  };
};

export default useTableView;
