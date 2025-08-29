import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

import {
  useSerialisedTableState,
  useRawTableState,
} from '~/hooks/useTableState';

import { initialItemsState } from './constants';
import { identifyItems } from './helpers';
import useCallbacksCallback from '~/hooks/useTableState/hooks/useCallbacksCallback';

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
  { itemsOptions: { queryKey } = {} },
) => {
  const tableState = useRawTableState();
  const { filter, sort, pagination } = tableState || {};
  const serialisedTableState = useSerialisedTableState();
  const useInternalState = typeof externalItems === 'function';

  const queryFn = useCallback(async () => {
    const [items, total] = await externalItems(
      serialisedTableState,
      tableState,
    );

    return {
      items: identifyItems(items),
      total,
    };
  }, [externalItems, serialisedTableState, tableState]);

  const {
    data: { items: internalItems, total: internalTotal } = initialItemsState,
    isFetching: internalLoading,
    error: internalError,
    refetch,
  } = useQuery({
    queryKey: [
      'items',
      serialisedTableState,
      filter,
      sort,
      pagination,
      queryKey,
    ],
    queryFn,
    enabled: useInternalState,
    refetchOnWindowFocus: false,
  });

  const items = useInternalState ? internalItems : identifyItems(externalItems);
  const total = useInternalState ? internalTotal : externalTotal;
  const error = useInternalState ? internalError : externalError;
  const loading = useInternalState ? internalLoading : externalLoading;

  useCallbacksCallback('reload', refetch);

  return {
    loading,
    items,
    error,
    total,
  };
};

export default useItems;
