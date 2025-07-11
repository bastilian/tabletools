import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useSerialisedTableState } from '~/hooks';

import useParamsFromTableState from './hooks/useParamsFromTableState';

const useExampleDataQuery = ({
  endpoint,
  skip,
  useTableState = false,
  params: paramsOption = {},
} = {}) => {
  const serialisedTableState = useSerialisedTableState();
  const params = useParamsFromTableState({
    paramsOption,
    serialisedTableState,
    useTableState,
  });

  const api = useCallback(
    async (fetchParams) => {
      const query =
        params || fetchParams
          ? '?' + new URLSearchParams({ ...params, ...fetchParams }).toString()
          : '';
      const response = await fetch(endpoint + query);

      return await response.json();
    },
    [endpoint, params],
  );

  const {
    isFetching: loading,
    data: result,
    error,
  } = useQuery({
    queryKey: [endpoint, params],
    queryFn: (_queryContext, ...args) => api(...args),
    enabled: !skip,
    refetchOnWindowFocus: false,
  });

  const exporter = useCallback(
    async () =>
      (await api({ ...params, ...paramsOption, offset: 0, limit: 'max' })).data,
    [api, params, paramsOption],
  );

  const itemIdsInTable = useCallback(
    async () =>
      (
        await api({ ...params, ...paramsOption, offset: 0, limit: 'max' })
      ).data.map(({ id }) => id),
    [api, params, paramsOption],
  );

  const itemIdsOnPage = useCallback(
    async () =>
      (await api({ ...params, ...paramsOption })).data.map(({ id }) => id),
    [api, params, paramsOption],
  );

  const _fetch = useCallback(
    async (params) => await api({ ...params, ...paramsOption }),
    [api, paramsOption],
  );

  return {
    ...(result
      ? {
          result,
        }
      : {}),
    ...(error
      ? {
          error,
        }
      : {}),
    loading,
    fetch: _fetch,
    exporter,
    itemIdsInTable,
    itemIdsOnPage,
  };
};

export default useExampleDataQuery;
