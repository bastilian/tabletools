import { useDeepCompareMemo } from 'use-deep-compare';

import { useSerialisedTableState } from '~/hooks';

const useParamsFromTableState = () => {
  const serialisedTableState = useSerialisedTableState();

  const params = useDeepCompareMemo(() => {
    const { filters, pagination, sort } = serialisedTableState || {};
    return { filters, ...pagination, sort };
  }, [serialisedTableState]);

  return params;
};

export default useParamsFromTableState;
