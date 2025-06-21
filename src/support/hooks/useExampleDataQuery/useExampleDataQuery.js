import { useCallback, useState } from 'react';
import { useDeepCompareEffect } from 'use-deep-compare';

import fakeApi from '~/support/fakeApi';
import useParamsFromTableState from './hooks/useParamsFromTableState';

const useExampleDataQuery = ({
  api = fakeApi,
  params: paramsOption = {},
} = {}) => {
  const params = useParamsFromTableState();
  const [result, setResult] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  // TODO Check why the API gets called twice on initialisation
  useDeepCompareEffect(() => {
    const fakeFetchDate = async (params) => {
      setLoading(true);

      try {
        const apiResult = await api({ ...params, ...paramsOption });

        setResult(apiResult);
      } catch (e) {
        console.log(e);
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fakeFetchDate(params);

    return () => {
      setLoading(false);
    };
  }, [api, params, paramsOption]);

  const exporter = useCallback(
    async () =>
      (await api({ ...params, ...paramsOption, offset: 0, limit: 10000 })).data,
    [api, params, paramsOption],
  );

  const itemIdsInTable = useCallback(
    async () =>
      (
        await api({ ...params, ...paramsOption, offset: 0, limit: 10000 })
      ).data.map(({ id }) => id),
    [api, params, paramsOption],
  );

  const itemIdsOnPage = useCallback(
    async () =>
      (await api({ ...params, ...paramsOption })).data.map(({ id }) => id),
    [api, params, paramsOption],
  );

  const fetch = useCallback(
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
    fetch,
    exporter,
    itemIdsInTable,
    itemIdsOnPage,
  };
};

export default useExampleDataQuery;
