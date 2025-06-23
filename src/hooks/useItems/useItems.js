import { useState, useEffect } from 'react';

import {
  useSerialisedTableState,
  useRawTableState,
} from '~/hooks/useTableState';

import { initialItemsState } from './constants';
import { identifyItems } from './helpers';

/**
 * This hook handles either just returning a provided array of items
 * or calls a provided async (fetch) function to load an array of items
 *
 *  @param   {Array | Function} itemsProp An array or (async) function that returns an array of items to render or an async function to call with the tableState and serialised table state
 *
 *  @returns {Array}                      An array of items from the itemsProp passed in or a return from it as a function
 *
 *                                        TODO it might be good to use this hook as well to "identify" items similar to the `useItemIdentify` hook
 *
 *  @group Hooks
 *
 */
const useItems = (
  externalLoading,
  externalItems,
  externalError,
  externalTotal,
) => {
  const [{ items: internalItems, total: internalTotal }, setInternalItems] =
    useState(initialItemsState);

  const useInternalState = typeof externalItems === 'function';

  const items = useInternalState ? internalItems : externalItems;
  const total = useInternalState ? internalTotal : externalTotal;

  const [internalError, setInternalError] = useState();
  const error = useInternalState ? internalError : externalError;

  const [internalLoading, setInternalLoading] = useState(true);
  const loading = useInternalState ? internalLoading : externalLoading;

  const tableState = useRawTableState();
  const serialisedTableState = useSerialisedTableState();

  useEffect(() => {
    if (useInternalState) {
      setInternalLoading(true);
      setInternalItems(initialItemsState);
      setInternalError(undefined);

      const setStateFromAsyncItems = async () => {
        try {
          const [items, total] = await externalItems(
            serialisedTableState,
            tableState,
          );
          setInternalItems({
            items: identifyItems(items),
            total,
          });
        } catch (error) {
          console.error(error);
          setInternalError(error);
        }

        setInternalLoading(false);
      };

      setStateFromAsyncItems();
    }
  }, [externalItems, tableState, serialisedTableState, useInternalState]);

  return {
    loading,
    items,
    error,
    total,
  };
};

export default useItems;
