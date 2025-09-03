import { useEffect } from 'react';

import { useTableContext } from '~/hooks';

/**
 * Hook used internally to set and read wether or not debug mode is enabled
 *
 *  @returns {object} table state
 *
 *  @group Hooks
 *
 */
const useDebug = (debugProp = false) => {
  const tableContext = useTableContext();
  const { debug: contextDebug } = tableContext || {};

  useEffect(() => {
    if (debugProp) {
      contextDebug.current = debugProp;
    }
  }, [debugProp, contextDebug]);

  return contextDebug?.current;
};

export default useDebug;
