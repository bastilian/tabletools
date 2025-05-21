import { useDeepCompareMemo } from 'use-deep-compare';

import useTableState, { useRawTableState } from '~/hooks/useTableState';

import { DEFAULT_TABLE_VIEW, TABLE_STATE_NAMESPACE } from '../constants';

const useViewState = (items, error, options) => {
  const { defaultTableView = DEFAULT_TABLE_VIEW } = options;
  const filters = useRawTableState('filters');
  const [tableView, setTableViewState] = useTableState(
    TABLE_STATE_NAMESPACE,
    defaultTableView
  );

  const currentView = useDeepCompareMemo(() => {
    if (error) {
      return 'error';
    } else {
      if (items?.length === 0) {
        return 'empty';
      }

      if (Object.keys(filters || {}).length && tableView === 'tree') {
        return 'rows';
      }

      return tableView;
    }
  }, [error, tableView, filters, items]);

  return {
    setTableView: setTableViewState,
    tableView: currentView,
  };
};

export default useViewState;
