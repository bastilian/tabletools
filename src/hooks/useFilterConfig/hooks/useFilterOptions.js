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
    useReset,
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
      useReset,
    }),
    [
      enableFilters,
      filters,
      filterConfig,
      customFilterTypes,
      initialActiveFilters,
      serialisers,
      useReset,
    ],
  );

  return config;
};

export default useFilterOptions;
