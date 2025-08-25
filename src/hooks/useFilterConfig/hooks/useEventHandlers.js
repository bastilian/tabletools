import { useCallback } from 'react';

import { toSelectValue } from '../helpers/filterConfigHelpers';
import { toDeselectValue } from '../helpers/filterChipHelpers';

const useEventHandlers = ({
  filterConfig,
  activeFilters,
  onFilterUpdate: onFilterUpdateCallback,
  onDeleteFilter,
  resetOnClear,
  filterTypes,
  asyncItems,
  selectionActions: { select, deselect, reset, clear },
}) => {
  const onFilterUpdate = useCallback(
    (filter, selectedValue, selectedValues) => {
      // This is a hack to prevent any filters from being set via their onChange/onSelect handlers when the modal option is clicked
      if (selectedValue === 'modal') {
        return;
      }
      select(
        ...toSelectValue(
          filterConfig,
          filterTypes,
          filter,
          selectedValue,
          selectedValues,
        ),
      );

      onFilterUpdateCallback?.();
    },
    [filterConfig, select, onFilterUpdateCallback, filterTypes],
  );

  const onFilterDelete = useCallback(
    async (_event, chips, clearAll = false) => {
      if (clearAll) {
        const filtersToClear = Object.keys(activeFilters);

        if (resetOnClear) {
          for (const filter of filtersToClear) {
            reset(filter);
          }
        } else {
          for (const filter of filtersToClear) {
            clear(filter);
          }
        }
      } else {
        deselect(
          ...toDeselectValue(
            filterConfig,
            filterTypes,
            chips[0],
            activeFilters,
            asyncItems,
          ),
        );
      }
      onDeleteFilter?.(chips, clearAll);
    },
    [
      filterConfig,
      activeFilters,
      onDeleteFilter,
      reset,
      clear,
      deselect,
      resetOnClear,
      filterTypes,
      asyncItems,
    ],
  );

  return { onFilterUpdate, onFilterDelete };
};

export default useEventHandlers;
