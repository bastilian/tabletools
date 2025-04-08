import { useEffect } from 'react';

import useStateCallbacks from './useStateCallbacks';

// TODO We should refactor this and move this hook higher up.
// also maybe rename to something like "useContextActions" and maybe the hook to use in tables "useTableToolsAction"
const useCallbacksCallback = (namespace, fn) => {
  const callbacks = useStateCallbacks();
  useEffect(() => {
    // TODO the namespace should maybe be an object to make exposing multiple "actions"
    callbacks.current[namespace] = fn;
  }, [callbacks, namespace, fn]);
};

export default useCallbacksCallback;
