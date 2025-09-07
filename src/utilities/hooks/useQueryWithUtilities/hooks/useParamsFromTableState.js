import { useDeepCompareMemo } from 'use-deep-compare';

import { useSerialisedTableState } from '~/hooks';

const useParamsFromTableState = ({ paramsOption, useTableState }) => {
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

    // TODO There may be issues here if for example there is a filter passed via the paramsOption
    // We should maybe have a "combineWithTableState" option to pass in a "transforming" function
    const combinedParams = {
      ...(tableStateParams ? tableStateParams : {}),
      ...(paramsOption ? paramsOption : {}),
    };

    return Object.keys(combinedParams).length ? combinedParams : undefined;
  }, [serialisedTableState, useTableState, paramsOption]);

  return params;
};

export default useParamsFromTableState;
