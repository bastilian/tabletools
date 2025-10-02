import { useDeepCompareEffect } from 'use-deep-compare';

const useCallbacks = (callbackNamespace, callback, callbackInContextRef) => {
  useDeepCompareEffect(() => {
    if (callback) {
      callbackInContextRef.current = {
        ...callbackInContextRef.current,
        [callbackNamespace]: callback,
      };
    }
  }, [callback, callbackInContextRef, callbackNamespace]);
};

export default useCallbacks;
