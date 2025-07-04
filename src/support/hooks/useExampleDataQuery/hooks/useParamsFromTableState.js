import { useDeepCompareMemo } from 'use-deep-compare';

const useParamsFromTableState = (serialisedTableState) => {
  const params = useDeepCompareMemo(() => {
    const { filters, pagination, sort } = serialisedTableState || {};

    return {
      ...(filters ? { filters } : {}),
      ...(pagination ? pagination : {}),
      ...(sort ? { sort } : {}),
    };
  }, [serialisedTableState]);

  return params;
};

export default useParamsFromTableState;
