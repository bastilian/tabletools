import { useCallback, useState } from 'react';
import { useDeepCompareEffect, useDeepCompareCallback } from 'use-deep-compare';

import { useSerialisedTableState } from '~/hooks';

import useParamsFromTableState from './hooks/useParamsFromTableState';

const useExampleDataQuery = ({ endpoint, params: paramsOption = {} } = {}) => {
  const serialisedTableState = useSerialisedTableState();
  const params = useParamsFromTableState(serialisedTableState);
  const [result, setResult] = useState();
  const [error, setError] = useState();
  // const [loading, setLoading] = useState(true);

  const api = useDeepCompareCallback(
    async (params) => {
      console.log('Yolo params', params);
      const response = await fetch(
        endpoint + '?' + new URLSearchParams(params).toString(),
      );
      const json = await response.json();
      return json;
    },
    [endpoint],
  );

  useDeepCompareEffect(() => {
    const fetchData = async (params) => {
      try {
        const apiResult = await api({ ...params, ...paramsOption });

        setResult(apiResult);
      } catch (e) {
        console.log(e);
        setError(e);
      }

      // setLoading(false);
    };

    if (serialisedTableState) {
      // setLoading(true);
      setResult(undefined);
      setError(undefined);

      fetchData(params);
    }
  }, [api, params, paramsOption, serialisedTableState]);

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
