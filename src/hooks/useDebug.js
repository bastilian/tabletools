import { useContext, useEffect } from 'react';
import { TableContext } from './useTableState/constants';

const useDebug = (debugProp) => {
  const { debug: contextDebug } = useContext(TableContext);

  useEffect(() => {
    if (debugProp) {
      console.log('Setting debug to', debugProp);
      contextDebug.current = debugProp;
    }
  }, [debugProp, contextDebug]);

  return contextDebug.current;
};

export default useDebug;
