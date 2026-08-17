import { toFilterConfig } from '~/hooks/useFilterConfig/helpers/filterConfigHelpers';
import { toFilterChips } from '~/hooks/useFilterConfig/helpers/filterChipHelpers';

/**
 * Maps filter props to FEC PrimaryToolbar ConditionalFilter props.
 *
 *  @param   {object}   [params]                    Filter inputs
 *  @param   {boolean}  [params.enableFilters]      Whether filters are enabled
 *  @param   {Array}    [params.filterConfig]       Consumer filter definitions
 *  @param   {object}   [params.filterTypes]        Filter type helpers
 *  @param   {object}   [params.activeFilters]      Current active filter state
 *  @param   {boolean}  [params.isInitialSelection] Whether the selection matches initial state
 *  @param   {boolean}  [params.useReset]           Whether to show reset instead of clear
 *  @param   {Function} [params.onFilterUpdate]     Handler for filter value changes
 *  @param   {Function} [params.onFilterDelete]     Handler for filter chip deletion
 *  @param   {Function} [params.openFilterModal]    Opens the filter modal for a filter
 *  @returns {object}                               `{ toolbarProps }` or `{}`
 */
export const toFilterToolbarConfig = ({
  enableFilters,
  filterConfig,
  filterTypes,
  activeFilters,
  isInitialSelection,
  useReset,
  onFilterUpdate,
  onFilterDelete,
  openFilterModal,
} = {}) =>
  enableFilters
    ? {
        toolbarProps: {
          filterConfig: toFilterConfig(
            filterConfig,
            filterTypes,
            activeFilters,
            onFilterUpdate,
            openFilterModal,
          ),
          activeFiltersConfig: {
            ...(useReset
              ? {
                  deleteTitle: 'Reset filters',
                  showDeleteButton: isInitialSelection ? false : true,
                }
              : {}),
            filters: toFilterChips(filterConfig, filterTypes, activeFilters),
            onDelete: onFilterDelete,
          },
        },
      }
    : {};
