import { useDeepCompareMemo } from 'use-deep-compare';

import views from '../views';

const useViews = (options) => {
  const supportedViews = useDeepCompareMemo(
    () =>
      Object.fromEntries(
        Object.entries(views).filter(([, { checkOptions }]) =>
          checkOptions?.(options),
        ),
      ),
    [options],
  );

  const choosableViews = useDeepCompareMemo(
    () =>
      Object.fromEntries(
        Object.entries(supportedViews).filter(([, { icon }]) => icon),
      ),
    [supportedViews],
  );

  return { supportedViews, choosableViews };
};

export default useViews;
