import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import pAll from 'p-all';

import {
  DEFAULT_BATCH_SIZE,
  DEFAULT_CONCURRENT_REQUESTS,
  DEFAULT_LIMIT_PARAM,
  DEFAULT_OFFSET_PARAM,
} from '../constants';
import { defaultTotalBatchedSelect, defaultTotalForBatched } from '../helpers';

const useQueryTotalBatched = ({
  enabled,
  batched,
  queryFn,
  queryKey: queryKeyOption,
  queryClient,
  batchSize = DEFAULT_BATCH_SIZE,
  concurrency = DEFAULT_CONCURRENT_REQUESTS,
  offsetParam = DEFAULT_OFFSET_PARAM,
  limitParam = DEFAULT_LIMIT_PARAM,
  totalBatchedSelect = defaultTotalBatchedSelect,
  totalForBatched = defaultTotalForBatched,
} = {}) => {
  const queryKey = useMemo(
    () => [...queryKeyOption, 'batched'],
    [queryKeyOption],
  );

  const queryPage = useCallback(
    async (pageIdx, params) => {
      const page = pageIdx;
      const offset = page * batchSize;

      const queryParams = {
        ...params,
        [offsetParam]: offset,
        [limitParam]: batchSize,
      };

      return await queryClient.fetchQuery({
        queryKey: [...queryKey, queryParams],
        queryFn: async () => await queryFn(queryParams),
      });
    },
    [queryKey, queryFn, batchSize, queryClient, offsetParam, limitParam],
  );

  const queryBatch = useCallback(
    async (total, params) => {
      const pages = Math.ceil(total / batchSize) || 1;
      const requests = [...new Array(pages - 1)].map(
        (_, pageIdx) => () => queryPage(pageIdx + 1, params),
      );

      return await pAll(requests, {
        concurrency,
      });
    },
    [batchSize, concurrency, queryPage],
  );

  const queryTotalBatched = useCallback(
    async (params) => {
      const firstPage = await queryPage(0, params);
      const total = totalForBatched(firstPage);

      const results = [
        firstPage,
        ...(total > batchSize ? await queryBatch(total, params) : []),
      ];

      return totalBatchedSelect(results, totalForBatched);
    },
    [queryPage, queryBatch, batchSize, totalBatchedSelect, totalForBatched],
  );

  const {
    isFetching: loading,
    data: result,
    error,
  } = useQuery({
    queryKey,
    queryFn: async () => await queryTotalBatched(),
    enabled: batched && enabled,
    refetchOnWindowFocus: false,
    retry: false,
  });

  return {
    loading,
    result,
    error,
    queryTotalBatched,
  };
};

export default useQueryTotalBatched;
