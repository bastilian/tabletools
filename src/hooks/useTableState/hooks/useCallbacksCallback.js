import { useEffect } from 'react';

import useStateCallbacks from './useStateCallbacks';

// TODO We should refactor this and move this hook higher up.
// also maybe rename to something like "useContextActions" and maybe the hook to use in tables "useTableToolsAction"

/**
 * This component provides a context for components/hooks that want to use async tables and access it's state to perform API requests
 *
 *  @param {string} [namespace] Namespace the callback function should be put in
 *  @param {string} [fn]        components to render within
 *
 *  @ignore
 *
 */
const useCallbacksCallback = (namespace, fn) => {
  const callbacksRef = useStateCallbacks();
  useEffect(() => {
    // TODO the namespace should maybe be an object to make exposing multiple "actions"
    callbacksRef.current[namespace] = fn;
  }, [callbacksRef, namespace, fn]);
};

export default useCallbacksCallback;
