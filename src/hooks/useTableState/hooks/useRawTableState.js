import { useContext } from 'react';

import { TableContext } from '../constants';

/**
 * Hook to access the "raw" table state
 *
 *  @returns {object} raw table state
 *
 *  @group Hooks
 *
 */
const useRawTableState = (namespace) => {
  const context = useContext(TableContext);

  return namespace
    ? context?.state?.[0]?.tableState?.[namespace]
    : context?.state?.[0]?.tableState;
};

export default useRawTableState;
