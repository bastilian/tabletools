import { useDeepCompareMemo } from 'use-deep-compare';

import filterTypeHelpers from '../helpers/filterTypeHelpers';
import { prepareCustomFilterTypes } from '../helpers/helpers';

import useResolvedProps from './useResolvedProps';

const useFilterOptions = (options) => {
  const { filters, serialisers } = options || {};
  const {
    filterConfig: staticFilterConfig = [],
    activeFilters: initialActiveFilters,
    customFilterTypes,
  } = filters || {};
  const filterConfig = useResolvedProps(staticFilterConfig, [
    'items',
    'groups',
  ]);
  const enableFilters = !!filters && filterConfig?.length;

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
    ],
  );

  return config;
};

export default useFilterOptions;
