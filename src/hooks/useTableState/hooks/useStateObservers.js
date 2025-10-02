import { useDeepCompareEffect } from 'use-deep-compare';

const useStateObservers = (
  observerNamespace,
  observers,
  observersInContextRef,
) => {
  useDeepCompareEffect(() => {
    if (observers && observersInContextRef) {
      for (const [observedStatekey, observerFunction] of Object.entries(
        observers,
      )) {
        observersInContextRef.current = {
          ...observersInContextRef?.current,
          [observedStatekey]: {
            ...(observersInContextRef?.current?.[observedStatekey] || {}),
            [observerNamespace]: observerFunction,
          },
        };
      }
    }
  }, [observers, observersInContextRef, observerNamespace]);
};

export default useStateObservers;
