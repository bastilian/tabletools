import { useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import useParamsFromTableState from './hooks/useParamsFromTableState';
import useTableQueries from './hooks/useTableQueries';
import useQueryTotalBatched from './hooks/useQueryTotalBatched';
import useQueryQueue from './hooks/useQueryQueue';

/**
 * This hook is a wrapper around [TanStack's `useQuery`](https://tanstack.com/query/latest) and provides functions that can be directly utilised with a TableToolsTabls.
 *
 *  @param   {object}       [options]                             Options
 *  @param   {Function}     [options.fetchFn]                     Fetch function that will be passed on to `useQuery`
 *  @param   {Array}        [options.queryKey]                    The same queryKey option, to provide  attributes/keys/etc. to pass to `useQuery` in addition to the params
 *  @param   {boolean}      [options.enabled]                     The same queryKey option. Wether or not it should fetch async after initially loading.
 *  @param   {boolean}      [options.batched]                     Enables "batched fetching" for paginated fetch functions
 *  @param   {boolean}      [options.useTableState]               Enables adding a serialised TableToolsTable state as params when calling the fetchFn
 *  @param   {object}       [options.params]                      Parameters to pass when calling the fetchFn
 *  @param   {object|Array} [options.queue]                       A "queue" array or object of fetchFn that should be called instead of a fetchFn
 *  @param   {object}       [options.tableQueries]                Options to pass to the `useTableQueries hook
 *  @param   {object}       [options.totalBatched]                Options to pass to the `useQueryTotalBatched` hook
 *  @param   {Function}     [options.combineParamsWithTableState] Function to customise combining the table state with other parameters
 *
 *  @returns {object}
 *
 *  @group Utilities/Hooks
 *
 *
 */
const useQueryWithUtilities = ({
  fetchFn,
  queryKey: queryKeyOption = [],
  enabled: enabledOption = true,
  batched = false,
  useTableState = false,
  params: paramsOption,
  queue,
  tableQueries: tableQueriesOptions,
  totalBatched: totalBatchedOptions,
  combineParamsWithTableState,
  // TODO The useQueryWithUtilities should allow to set onComplete/onError callbacks as options
} = {}) => {
  const params = useParamsFromTableState({
    paramsOption,
    useTableState,
    combineParamsWithTableState,
  });

  const queryClient = useQueryClient();
  const enabled = useMemo(
    () => (useTableState ? enabledOption && !!params : enabledOption),
    [enabledOption, params, useTableState],
  );
  const queryKey = useMemo(
    () => (params ? [...queryKeyOption, params] : queryKeyOption),
    [queryKeyOption, params],
  );
  const queryFn = useCallback(
    async (queryFnParams) => {
      if (combineParamsWithTableState) {
        const finalParams = combineParamsWithTableState(params, queryFnParams);
        return await fetchFn(finalParams);
      }
      return await fetchFn({ ...params, ...queryFnParams });
    },
    [fetchFn, params, combineParamsWithTableState],
  );

  const {
    isFetching: queryLoading,
    data: queryResult,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async () => await queryFn(),
    enabled: !batched && enabled,
    refetchOnWindowFocus: false,
  });

  const query = useCallback(
    async (params) =>
      await queryClient.fetchQuery({
        queryKey: [...queryKey, params],
        queryFn: async () => await queryFn(params),
      }),
    [queryClient, queryFn, queryKey],
  );

  const {
    loading: totalBatchedLoading,
    result: totalBatchedResult,
    error: totalBatchedError,
    queryTotalBatched,
  } = useQueryTotalBatched({
    enabled: enabled && !queue,
    batched,
    queryKey,
    queryFn,
    queryClient,
    ...totalBatchedOptions,
  });

  const {
    loading: queueLoading,
    result: queueResult,
    error: queueError,
    ...queueQueries
  } = useQueryQueue({
    queryKey,
    enabled,
    batched,
    queue,
    query,
    queryTotalBatched,
  });

  const tableQueries = useTableQueries({
    queryClient,
    queryKey,
    query,
    queryTotalBatched,
    ...tableQueriesOptions,
  });

  const loading = queue
    ? queueLoading
    : batched
      ? totalBatchedLoading
      : queryLoading;

  const result = queue
    ? queueResult
    : batched
      ? totalBatchedResult
      : queryResult;

  const error = queue ? queueError : batched ? totalBatchedError : queryError;

  return {
    loading,
    result,
    error,
    refetch,
    query,
    queryTotalBatched,
    ...tableQueries,
    ...queueQueries,
  };
};

export default useQueryWithUtilities;
