import { useDeepCompareMemo } from 'use-deep-compare';

import { useSerialisedTableState } from '~/hooks';

const defaultCombine = (tableParams, optionParams) => ({
  ...(tableParams || {}),
  ...(optionParams || {}),
});

const useParamsFromTableState = ({
  paramsOption,
  useTableState,
  combineParamsWithTableState = defaultCombine,
}) => {
  const serialisedTableState = useSerialisedTableState();

  const params = useDeepCompareMemo(() => {
    const { filters, pagination, sort } = serialisedTableState || {};
    const tableStateParams = useTableState
      ? {
          ...(filters ? { filters } : {}),
          ...(pagination ? pagination : {}),
          ...(sort ? { sort } : {}),
        }
      : undefined;

    const combinedParams = combineParamsWithTableState(
      tableStateParams,
      paramsOption,
    );

    return Object.keys(combinedParams).length ? combinedParams : undefined;
  }, [
    serialisedTableState,
    useTableState,
    paramsOption,
    combineParamsWithTableState,
  ]);

  return params;
};

export default useParamsFromTableState;
