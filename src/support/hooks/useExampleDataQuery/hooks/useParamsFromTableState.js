import { useMemo } from 'react';

import { useSerialisedTableState } from '~/hooks';

const useParamsFromTableState = () => {
  const serialisedTableState = useSerialisedTableState();

  const params = useMemo(() => {
    const { filters, pagination, sort } = serialisedTableState || {};
    return { filters, ...pagination, sort };
  }, [serialisedTableState]);

  return params;
};

export default useParamsFromTableState;
