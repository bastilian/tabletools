import { useCallback } from 'react';
import axios from 'axios';

import { useQueryWithUtilities } from '~/utilities';

const api = axios.create();

const useExampleDataQuery = ({
  endpoint,
  queryKey = [],
  ...queryUtilsOptions
} = {}) => {
  const fetchFn = useCallback(
    async ({ pagination, ...params }) => {
      const { data } = await api.get(endpoint, {
        params: {
          ...pagination,
          ...params,
        },
      });

      return data;
    },
    [endpoint],
  );

  const queryResultWithUtils = useQueryWithUtilities({
    queryKey: [...queryKey, endpoint],
    fetchFn,
    ...queryUtilsOptions,
  });

  return queryResultWithUtils;
};

export default useExampleDataQuery;
