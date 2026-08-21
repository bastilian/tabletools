import { useCallback, useEffect } from 'react';
import { useDebouncedCallback } from '@tanstack/react-pacer/debouncer';

import useSelectionManager from '~/hooks/useSelectionManager';
import useTableState from '~/hooks/useTableState';
import useCallbacksCallback from '~/hooks/useTableState/hooks/useCallbacksCallback';

import { toIdedFilters } from './helpers/filterConfigHelpers';
import useEventHandlers from './hooks/useEventHandlers';
import useFilterOptions from './hooks/useFilterOptions';
import useFilterModal from './hooks/useFilterModal';
import { TABLE_STATE_NAMESPACE } from './constants';

/**
 *  @typedef {object} FilterConfigProps
 *
 *  @property {boolean}  enableFilters      Whether filters are enabled
 *  @property {Array}    filterConfig       Consumer filter definitions
 *  @property {object}   filterTypes        Filter type helpers
 *  @property {object}   activeFilters      Current active filter state
 *  @property {boolean}  isInitialSelection Whether the selection matches initial state
 *  @property {boolean}  [useReset]         Whether to show reset instead of clear
 *  @property {Function} onFilterUpdate     Handler for filter value changes
 *  @property {Function} onFilterDelete     Handler for filter chip deletion
 *  @property {Function} openFilterModal    Opens the filter modal for a filter
 *  @property {Function} setFilter          Sets a filter value programmatically
 *  @property {object}   [filterModalProps] Props for FilterModal when open
 */

/**
 * Provides filter state and actions for table tools.
 *
 *  @param   {object}            [options]                       AsyncTableTools options
 *  @param   {object}            [options.filters.filterConfig]  An object containing filter definition
 *  @param   {object}            [options.filters.activeFilters] An object containing an initial active filters state
 *  @param   {object}            [options.serialisers.filters]   A function to serialise the filter table state
 *  @param   {object}            [options.customFilterTypes]     An object containing definitions for custom filter type
 *
 *  @returns {FilterConfigProps}                                 Filter props for variant adapters
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
    useReset,
  } = useFilterOptions(options);

  const {
    selection: activeFilters,
    isInitialSelection,
    ...selectionActions
  } = useSelectionManager(initialActiveFilters, { withGroups: true });
  const { onFilterUpdate, onFilterDelete } = useEventHandlers({
    ...options,
    filterConfig,
    activeFilters,
    selectionActions,
    filterTypes,
    useReset,
  });

  const { isFilterModalOpen, openFilterModal, filterModalProps } =
    useFilterModal({ filterConfig, activeFilters, onFilterUpdate });

  const [, setTableState] = useTableState(
    TABLE_STATE_NAMESPACE,
    initialActiveFilters,
    serialisers?.filters
      ? {
          serialiser: (state) =>
            serialisers.filters(state, filterConfig.map(toIdedFilters)),
        }
      : {},
  );

  const debouncedSetState = useDebouncedCallback(setTableState, { wait: 500 });

  useEffect(() => {
    debouncedSetState(activeFilters);
  }, [activeFilters, debouncedSetState]);

  const setFilter = useCallback(
    (filter, value) => {
      selectionActions.set(value, filter);
    },
    [selectionActions],
  );

  useCallbacksCallback('resetFilters', selectionActions.rest);
  useCallbacksCallback('clearFilters', selectionActions.clear);
  useCallbacksCallback('setFilter', setFilter);

  if (!enableFilters) {
    return { enableFilters: false };
  }

  return {
    enableFilters,
    filterConfig,
    filterTypes,
    activeFilters,
    isInitialSelection,
    useReset,
    onFilterUpdate,
    onFilterDelete,
    openFilterModal,
    setFilter,
    ...(isFilterModalOpen ? { filterModalProps } : {}),
  };
};

export default useFilterConfig;
