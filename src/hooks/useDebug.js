import { useContext, useEffect } from 'react';
import { TableContext } from './useTableState/constants';

/**
 * Hook used internally to set and read wether or not debug mode is enabled
 *
 *  @returns {object} table state
 *
 *  @group Hooks
 *
 */
const useDebug = (debugProp = false) => {
  const tableContext = useContext(TableContext);
  const { debug: contextDebug } = tableContext || {};

  useEffect(() => {
    if (debugProp) {
      contextDebug.current = debugProp;
    }
  }, [debugProp, contextDebug]);

  return contextDebug?.current;
};

export default useDebug;
