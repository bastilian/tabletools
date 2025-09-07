import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import pAll from 'p-all';

import { DEFAULT_PALL_OPTIONS } from '../constants';
import { isObject } from '../helpers';

const useQueryQueue = ({
  enabled: enabledOption,
  queryKey: queryKeyOption,
  batched,
  queue,
  query,
  queryTotalBatched,
}) => {
  const enabled = useMemo(
    () => (queue && enabledOption) || false,
    [queue, enabledOption],
  );

  const queryKey = useMemo(
    () => [...queryKeyOption, 'queue'],
    [queryKeyOption],
  );

  const queryNamedQueue = useCallback(
    async (queue) =>
      Object.fromEntries(
        await pAll(
          Object.entries(queue).map(([queueKey, params]) => async () => [
            queueKey,
            await query(params),
          ]),
          DEFAULT_PALL_OPTIONS,
        ),
      ),
    [query],
  );

  const queryQueue = useCallback(
    async (queue) => {
      if (isObject(queue)) {
        return await queryNamedQueue(queue);
      } else {
        return await pAll(
          queue.map((params) => async () => await query(params)),
          DEFAULT_PALL_OPTIONS,
        );
      }
    },
    [query, queryNamedQueue],
  );

  const queryBatchedNamedQueue = useCallback(
    async (queue) =>
      Object.fromEntries(
        await pAll(
          Object.entries(queue).map(([queueKey, params]) => async () => [
            queueKey,
            await queryTotalBatched(params),
          ]),
          DEFAULT_PALL_OPTIONS,
        ),
      ),
    [queryTotalBatched],
  );

  const queryBatchedQueue = useCallback(
    async (queue) => {
      if (isObject(queue)) {
        return await queryBatchedNamedQueue(queue);
      } else {
        return await pAll(
          queue.map((params) => async () => await queryTotalBatched(params)),
          DEFAULT_PALL_OPTIONS,
        );
      }
    },
    [queryTotalBatched, queryBatchedNamedQueue],
  );

  const queryFn = useCallback(
    async () =>
      batched ? await queryBatchedQueue(queue) : await queryQueue(queue),
    [batched, queryQueue, queryBatchedQueue, queue],
  );

  const {
    isFetching: loading,
    data: result,
    error,
  } = useQuery({
    queryKey,
    queryFn,
    enabled,
    refetchOnWindowFocus: false,
  });

  return {
    loading,
    result,
    error,
    queryQueue,
    queryBatchedQueue,
  };
};

export default useQueryQueue;
