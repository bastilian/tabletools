import { useDeepCompareEffect } from 'use-deep-compare';
import { useFullTableState } from '~/hooks';

import useSearchParamsState from './hooks/useSearchParamsState';

const useTableSearchParams = ({ searchParams, setSearchParams }) => {
  const fullTableState = useFullTableState();
  const {
    tableState: { pagination: { state: pagination } = {}, filters, sort } = {},
  } = fullTableState || {};

  const [searchParamsState, setSearchParamsState] = useSearchParamsState({
    searchParams,
    setSearchParams,
  });

  useDeepCompareEffect(() => {
    if (setSearchParamsState) {
      setSearchParamsState({
        ...(pagination || {}),
        filters,
        ...(sort ? { sort } : {}),
      });
    }
  }, [pagination, filters, sort, setSearchParamsState]);

  return searchParamsState;
};

export default useTableSearchParams;
