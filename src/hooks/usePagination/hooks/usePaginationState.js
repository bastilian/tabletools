import { useCallback, useMemo } from 'react';

import { TABLE_STATE_NAMESPACE as FILTERS_TABLE_NAMESPACE } from '~/hooks/useFilterConfig/constants';
import { TABLE_STATE_NAMESPACE as SORT_TABLE_NAMESPACE } from '~/hooks/useTableSort/constants';
import { TABLE_STATE_NAMESPACE as VIEW_TABLE_NAMESPACE } from '~/hooks/useTableView/constants';
import useTableState from '~/hooks/useTableState';

import { TABLE_STATE_NAMESPACE } from '../constants';

const usePaginationState = (options) => {
  const { perPage = 10, serialisers } = options;
  const defaultState = useMemo(() => {
    return {
      perPage,
      page: 1,
    };
  }, [perPage]);
  // TODO fixme
  // const resetPage = useCallback(
  //   (currentState) => {
  //     return {
  //       ...currentState,
  //       state: {
  //         ...(currentState?.state || defaultState),
  //         page: 1,
  //       },
  //     };
  //   },
  //   [defaultState],
  // );

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
    },
  );

  return [paginationState, setPaginationState];
};

export default usePaginationState;
