import { useContext } from 'react';

import { TableContext } from './constants';

/**
 * Convenience hook to access the table context
 *
 *  @returns {object} TableContext
 *
 *  @group Hooks
 *
 */
const useTableContext = () => {
  const tableContext = useContext(TableContext);

  return tableContext;
};

export default useTableContext;
