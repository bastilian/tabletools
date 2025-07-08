import { useContext, useEffect } from 'react';
import { TableContext } from './useTableState/constants';

const useDebug = (debugProp = false) => {
  const tableContext = useContext(TableContext);
  const { debug: contextDebug } = tableContext || {};

  useEffect(() => {
    console.log('contextDebug', contextDebug, debugProp);
    if (debugProp) {
      console.log('Setting debug to', debugProp);
      contextDebug.current = debugProp;
    }
  }, [debugProp, contextDebug]);

  return contextDebug?.current;
};

export default useDebug;
