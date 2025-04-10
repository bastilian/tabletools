import { useDeepCompareEffect } from 'use-deep-compare';

import useTableState, {
  useSerialisedTableState,
  useRawTableState,
} from '~/hooks/useTableState';

import { TABLE_STATE_NAMESPACE } from './constants';
import { itemObserver, identifyItems } from './helpers';

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
  itemsProp,
  { total: optionsTotal, error: optionsError } = {}
) => {
  const [{ error, items, total } = {}, setItems] = useTableState('items', {
    items: undefined,
    total: undefined,
    error: optionsError,
  });
  const [loaded] = useTableState('loaded', false, {
    observers: {
      [TABLE_STATE_NAMESPACE]: itemObserver,
    },
  });
  const tableState = useRawTableState();
  const serialisedTableState = useSerialisedTableState();

  useDeepCompareEffect(() => {
    if (typeof itemsProp === 'function') {
      const setStateFromAsyncItems = async () => {
        try {
          const [items, total] = await itemsProp(
            serialisedTableState,
            tableState
          );

          setItems({ items: identifyItems(items), total });
        } catch (error) {
          console.error(error);
          setItems({ error });
        }
      };

      setStateFromAsyncItems();
    } else {
      setItems((currentState) => ({
        ...currentState,
        items: identifyItems(itemsProp),
        total: optionsTotal,
      }));
    }
  }, [setItems, itemsProp, serialisedTableState, tableState, optionsTotal]);

  return {
    loaded,
    items,
    error,
    total,
  };
};

export default useItems;
