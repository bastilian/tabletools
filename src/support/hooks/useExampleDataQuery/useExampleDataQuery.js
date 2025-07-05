import { useCallback, useState, useRef } from 'react';
import { useDeepCompareEffect, useDeepCompareCallback } from 'use-deep-compare';

import { useSerialisedTableState } from '~/hooks';

import useParamsFromTableState from './hooks/useParamsFromTableState';

const useExampleDataQuery = ({
  endpoint,
  skip,
  useTableState = false,
  params: paramsOption = {},
} = {}) => {
  const serialisedTableState = useSerialisedTableState();
  const params = useParamsFromTableState(serialisedTableState);
  const [result, setResult] = useState();
  const [error, setError] = useState();
  const queryCache = useRef();
  const responseCache = useRef();
  const okCache = useRef();

  const api = useDeepCompareCallback(
    async (params) => {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';

      if (queryCache.current !== endpoint + query) {
        const response = await fetch(endpoint + query);
        queryCache.current = endpoint + query;
        okCache.current = response.ok;
        responseCache.current = await response.json();
      }

      if (okCache.current) {
        return responseCache.current;
      } else {
        throw responseCache.current;
      }
    },
    [endpoint],
  );

  useDeepCompareEffect(() => {
    if (!skip) {
      setResult(undefined);
      setError(undefined);

      const fetchData = async (params) => {
        try {
          const apiResult = await api({ ...params, ...paramsOption });

          setResult(apiResult);
        } catch (e) {
          console.log(e);
          setError(e);
        }
      };

      if (useTableState) {
        if (serialisedTableState) {
          fetchData(params);
        }
      } else {
        fetchData(params);
      }
    }
  }, [skip, api, params, paramsOption, serialisedTableState, useTableState]);

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
    loading: !(result || error),
    fetch: _fetch,
    exporter,
    itemIdsInTable,
    itemIdsOnPage,
  };
};

export default useExampleDataQuery;
