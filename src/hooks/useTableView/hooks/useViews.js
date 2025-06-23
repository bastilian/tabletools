import { useDeepCompareMemo } from 'use-deep-compare';

import views from '../views';

const useViews = (
  tableView = 'loading',
  loading,
  items,
  error,
  total,
  options,
) => {
  const supportedViews = useDeepCompareMemo(() => {
    return Object.fromEntries(
      Object.entries(views).filter(([, { checkOptions }]) =>
        checkOptions?.(options),
      ),
    );
  }, [options]);

  const choosableViews = useDeepCompareMemo(
    () =>
      Object.fromEntries(
        Object.entries(supportedViews).filter(([, { icon }]) => icon),
      ),
    [supportedViews],
  );

  const { tableProps, toolbarProps } = useDeepCompareMemo(
    () => ({
      tableProps:
        supportedViews[tableView]?.tableProps?.(
          loading,
          items,
          error,
          total,
          options,
        ) || {},
      toolbarProps:
        supportedViews[tableView]?.toolbarProps?.(
          loading,
          items,
          error,
          total,
          options,
        ) || {},
    }),
    [supportedViews, tableView, loading, items, error, total, options],
  );

  return { tableProps, toolbarProps, choosableViews };
};

export default useViews;
