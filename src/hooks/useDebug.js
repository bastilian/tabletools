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
const useDebug = (debugProp) => {
  const { debug: contextDebug } = useContext(TableContext) || {};

  useEffect(() => {
    if (debugProp) {
      console.log('Setting debug to', debugProp);
      contextDebug.current = debugProp;
    }
  }, [debugProp, contextDebug]);

  return contextDebug?.current || false;
};

export default useDebug;
