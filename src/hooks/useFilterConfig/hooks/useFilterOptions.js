import { useDeepCompareMemo } from 'use-deep-compare';

import filterTypeHelpers from '../helpers/filterTypeHelpers';
import { prepareCustomFilterTypes } from '../helpers/helpers';

const useFilterOptions = (options) => {
  const { filters, serialisers } = options || {};
  const enableFilters = !!filters;
  const {
    filterConfig = [],
    activeFilters: initialActiveFilters,
    customFilterTypes,
  } = filters || {};

  const config = useDeepCompareMemo(
    () => ({
      enableFilters,
      filters,
      filterConfig,
      filterTypes: {
        ...filterTypeHelpers,
        ...(customFilterTypes
          ? prepareCustomFilterTypes(customFilterTypes)
          : {}),
      },
      initialActiveFilters,
      serialisers,
    }),
    [
      enableFilters,
      filters,
      filterConfig,
      customFilterTypes,
      initialActiveFilters,
      serialisers,
    ]
  );

  return config;
};

export default useFilterOptions;
