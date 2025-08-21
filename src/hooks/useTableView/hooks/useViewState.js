import useTableState from '~/hooks/useTableState';
import useCallbacksCallback from '~/hooks/useTableState/hooks/useCallbacksCallback';

import { DEFAULT_TABLE_VIEW, TABLE_STATE_NAMESPACE } from '../constants';

const useViewState = (options) => {
  const { defaultTableView = DEFAULT_TABLE_VIEW } = options;
  const [tableView, setTableView] = useTableState(
    TABLE_STATE_NAMESPACE,
    defaultTableView,
  );

  useCallbacksCallback('setView', setTableView);

  return {
    setTableView,
    tableView,
  };
};

export default useViewState;
