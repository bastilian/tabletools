import { useCallback, useState } from 'react';
import { useDeepCompareEffect, useDeepCompareCallback } from 'use-deep-compare';

import fakeApi from '~/support/fakeApi';
import useParamsFromTableState from './hooks/useParamsFromTableState';

const useExampleDataQuery = ({
  endpoint = '/api',
  fetchApi = fakeApi,
  params: paramsOption = {},
  errorToThrow,
} = {}) => {
  const params = useParamsFromTableState();
  const [result, setResult] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);

  const api = useDeepCompareCallback(
    async (...args) => {
      if (errorToThrow) {
        throw errorToThrow;
      } else {
        return await fetchApi(endpoint, ...args);
      }
    },
    [fetchApi, errorToThrow, endpoint]
  );

  useDeepCompareEffect(() => {
    console.log('Yello', api, params, paramsOption);
    setLoading(true);
    setResult(undefined);
    setError(undefined);

    const fakeFetchDate = async (params) => {
      try {
        const apiResult = await api({ ...params, ...paramsOption });

        setResult(apiResult);
      } catch (e) {
        console.log(e);
        setError(e);
      }

      setLoading(false);
    };

    fakeFetchDate(params);
  }, [api, params, paramsOption]);

  const exporter = useCallback(
    async () =>
      (await api({ ...params, ...paramsOption, offset: 0, limit: 'max' })).data,
    [api, params, paramsOption]
  );

  const itemIdsInTable = useCallback(
    async () =>
      (
        await api({ ...params, ...paramsOption, offset: 0, limit: 'max' })
      ).data.map(({ id }) => id),
    [api, params, paramsOption]
  );

  const itemIdsOnPage = useCallback(
    async () =>
      (await api({ ...params, ...paramsOption })).data.map(({ id }) => id),
    [api, params, paramsOption]
  );

  const fetch = useCallback(
    async (params) => await api({ ...params, ...paramsOption }),
    [api, paramsOption]
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
    fetch,
    exporter,
    itemIdsInTable,
    itemIdsOnPage,
  };
};

export default useExampleDataQuery;
