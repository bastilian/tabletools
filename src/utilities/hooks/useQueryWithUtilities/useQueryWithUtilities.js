import { useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import useParamsFromTableState from './hooks/useParamsFromTableState';
import useTableQueries from './hooks/useTableQueries';
import useQueryTotalBatched from './hooks/useQueryTotalBatched';
import useQueryQueue from './hooks/useQueryQueue';

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
} = {}) => {
  const params = useParamsFromTableState({
    paramsOption,
    useTableState,
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
    async (queryFnParams) => await fetchFn({ ...params, ...queryFnParams }),
    [fetchFn, params],
  );

  const {
    isFetching: queryLoading,
    data: queryResult,
    error: queryError,
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
    query,
    queryTotalBatched,
    ...tableQueries,
    ...queueQueries,
  };
};

export default useQueryWithUtilities;
