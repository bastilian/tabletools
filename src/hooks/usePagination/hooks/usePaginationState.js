import {
  useDeepCompareCallback,
  useDeepCompareEffect,
  useDeepCompareMemo,
} from 'use-deep-compare';

import useTableState, { useRawTableState } from '~/hooks/useTableState';

import { TABLE_STATE_NAMESPACE } from '../constants';

const usePaginationState = (options) => {
  const { perPage = 10, serialisers } = options;
  const defaultState = useDeepCompareMemo(() => {
    return {
      perPage,
      page: 1,
    };
  }, [perPage]);
  const [paginationState, setPaginationState] = useTableState(
    TABLE_STATE_NAMESPACE,
    {
      state: defaultState,
      isDisabled: false,
    },
    {
      ...(serialisers?.pagination
        ? {
            serialiser: (currentState) =>
              serialisers?.pagination(currentState?.state),
          }
        : {}),
    }
  );

  return [paginationState, setPaginationState];
};

export default usePaginationState;
