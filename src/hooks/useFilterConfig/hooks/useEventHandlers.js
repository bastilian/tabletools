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
          selectedValues
        )
      );

      onFilterUpdateCallback?.();
    },
    [filterConfig, select, onFilterUpdateCallback, filterTypes]
  );

  const onFilterDelete = useCallback(
    async (_event, chips, clearAll = false) => {
      if (clearAll) {
        if (resetOnClear) {
          reset();
        } else {
          clear();
        }
      } else {
        deselect(
          ...toDeselectValue(filterConfig, filterTypes, chips[0], activeFilters)
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
    ]
  );

  return { onFilterUpdate, onFilterDelete };
};

export default useEventHandlers;
