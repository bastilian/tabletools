import { useEffect, useMemo } from 'react';
import { useDebouncedCallback } from '@tanstack/react-pacer/debouncer';

import useSelectionManager from '~/hooks/useSelectionManager';
import useTableState from '~/hooks/useTableState';
import useCallbacksCallback from '~/hooks/useTableState/hooks/useCallbacksCallback';

import { toFilterConfig, toIdedFilters } from './helpers/filterConfigHelpers';
import { toFilterChips } from './helpers/filterChipHelpers';
import useEventHandlers from './hooks/useEventHandlers';
import useFilterOptions from './hooks/useFilterOptions';
import useFilterModal from './hooks/useFilterModal';
import useAsyncFilterCache from './hooks/useAsyncFilterCache';

import { TABLE_STATE_NAMESPACE } from './constants';

/**
 *  @typedef {object} FilterConfig
 *
 *  @property {object} toolbarProps                     Object containing PrimaryToolbar props
 *  @property {object} toolbarProps.filterConfig        Object containing the filterConfig prop for the PrimaryToolbar
 *  @property {object} toolbarProps.activeFiltersConfig Object containing the activeFiltersConfigs prop for the PrimaryToolbar
 */

/**
 * Provides `PrimaryToolbar` props for the `ConditionalFilter` component filter configuration.
 *
 *  @param   {object}       [options]                       AsyncTableTools options
 *  @param   {object}       [options.filters.filterConfig]  An object containing filter definition
 *  @param   {object}       [options.filters.activeFilters] An object containing an initial active filters state
 *  @param   {object}       [options.serialisers.filters]   A function to serialise the filter table state
 *  @param   {object}       [options.customFilterTypes]     An object containing definitions for custom filter type
 *
 *  @returns {FilterConfig}                                 props for PrimaryToolbar/ConditionalFilter component
 *
 *  @group Hooks
 *
 */
const useFilterConfig = (options) => {
  const {
    filterConfig,
    initialActiveFilters,
    serialisers,
    enableFilters,
    filterTypes,
  } = useFilterOptions(options);
  const [asyncItems, setAsyncItems] = useAsyncFilterCache();

  const { selection: activeFilters, ...selectionActions } = useSelectionManager(
    initialActiveFilters,
    { withGroups: true },
  );
  const { onFilterUpdate, onFilterDelete } = useEventHandlers({
    ...options,
    filterConfig,
    activeFilters,
    selectionActions,
    filterTypes,
    asyncItems,
  });

  const { isFilterModalOpen, openFilterModal, filterModalProps } =
    useFilterModal({
      filterConfig: options.filters?.filterConfig,
      activeFilters,
      onFilterUpdate,
      serialisers: options.serialisers,
      setAsyncItems,
    });

  const builtFilterConfig = useMemo(
    () =>
      filterConfig
        ? toFilterConfig(
            filterConfig,
            filterTypes,
            activeFilters,
            onFilterUpdate,
            openFilterModal,
          )
        : [],
    [filterConfig, activeFilters, onFilterUpdate, filterTypes, openFilterModal],
  );

  const [, setTableState] = useTableState(
    TABLE_STATE_NAMESPACE,
    initialActiveFilters,
    serialisers?.filters
      ? {
          serialiser: (state) =>
            serialisers.filters(state, filterConfig?.map(toIdedFilters)),
        }
      : {},
  );

  const debouncedSetState = useDebouncedCallback(setTableState, { wait: 500 });

  useEffect(() => {
    debouncedSetState(activeFilters);
  }, [activeFilters, debouncedSetState]);

  useCallbacksCallback('clearFilters', selectionActions.clear);

  return enableFilters
    ? {
        toolbarProps: {
          filterConfig: builtFilterConfig,
          activeFiltersConfig: {
            filters: toFilterChips(
              filterConfig,
              filterTypes,
              activeFilters,
              asyncItems,
            ),
            onDelete: onFilterDelete,
          },
        },
        ...(isFilterModalOpen ? { filterModalProps } : {}),
      }
    : {};
};

export default useFilterConfig;
