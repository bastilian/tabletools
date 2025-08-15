import { useRef, useCallback } from 'react';

/**
 * This hook is used to cache items that have been requested to show in the FilterModal
 * This is needed in order to retain information to render the filters chip and be able to remove it.
 *
 * Ideally we would not need to do this and a filters value can stand on it's own.
 *
 */
const useAsyncFilterCache = () => {
  const asyncItems = useRef({});

  const setAsyncFilterCache = useCallback((filter, itemsToCache) => {
    const newItemsToCache = itemsToCache.filter(
      ({ label }) =>
        !(asyncItems.current?.[filter] || [])
          .map(({ label }) => label)
          .includes(label),
    );

    asyncItems.current[filter] = asyncItems.current[filter]
      ? [...(asyncItems?.current[filter] || []), ...newItemsToCache]
      : newItemsToCache;
  }, []);

  return [asyncItems?.current, setAsyncFilterCache];
};

export default useAsyncFilterCache;
