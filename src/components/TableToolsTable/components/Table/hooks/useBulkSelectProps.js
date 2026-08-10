import { useMemo } from 'react';

const useBulkSelectProps = ({ total, selectOne }) => {
  const props = useMemo(
    () => ({
      tableProps: {
        onSelect: total > 0 ? selectOne : undefined,
        canSelectAll: false,
      },
    }),
    [total, selectOne],
  );

  return props;
};

export default useBulkSelectProps;
