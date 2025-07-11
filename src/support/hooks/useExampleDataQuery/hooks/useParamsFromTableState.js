import { useDeepCompareMemo } from 'use-deep-compare';

const useParamsFromTableState = ({
  paramsOption,
  serialisedTableState,
  useTableState,
}) => {
  const params = useDeepCompareMemo(() => {
    const { filters, pagination, sort } = serialisedTableState || {};

    return useTableState
      ? {
          ...(filters ? { filters } : {}),
          ...(pagination ? pagination : {}),
          ...(sort ? { sort } : {}),
          ...paramsOption,
        }
      : paramsOption;
  }, [serialisedTableState, useTableState, paramsOption]);

  return params;
};

export default useParamsFromTableState;
