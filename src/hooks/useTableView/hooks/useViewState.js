import useTableState from '~/hooks/useTableState';

import { DEFAULT_TABLE_VIEW, TABLE_STATE_NAMESPACE } from '../constants';

const useViewState = (options) => {
  const { defaultTableView = DEFAULT_TABLE_VIEW } = options;
  const [tableView, setTableView] = useTableState(
    TABLE_STATE_NAMESPACE,
    defaultTableView,
  );

  return {
    setTableView,
    tableView,
  };
};

export default useViewState;
