import React from 'react';
import { Button, ToolbarItem } from '@patternfly/react-core';
import {
  DataViewFilters,
  DataViewTextFilter,
} from '@patternfly/react-data-view';
import { stringToId } from '~/hooks/useFilterConfig/helpers';

const toDataViewFilterValues = (filterConfig, activeFilters) =>
  Object.fromEntries(
    filterConfig
      .filter(({ type }) => type === 'text')
      .map(({ label }) => {
        const id = stringToId(label);
        return [id, activeFilters?.[id]?.[0] || ''];
      }),
  );

export const toDataViewFilters = ({
  enableFilters,
  filterConfig = [],
  activeFilters,
  onFilterUpdate,
  onFilterDelete,
  isInitialSelection,
} = {}) => {
  const textFilters = filterConfig.filter(({ type }) => type === 'text');
  if (!enableFilters || !textFilters.length) return {};

  return {
    filters: (
      <DataViewFilters
        values={toDataViewFilterValues(filterConfig, activeFilters)}
        onChange={(filterId, partial) =>
          // FEC compatible call, refactor in the future
          onFilterUpdate(filterId, undefined, partial[filterId])
        }
      >
        {textFilters.map(({ label, placeholder }) => (
          <DataViewTextFilter
            key={stringToId(label)}
            filterId={stringToId(label)}
            title={label}
            placeholder={placeholder ?? `Filter by ${label.toLowerCase()}`}
          />
        ))}
      </DataViewFilters>
    ),
    // DataViewToolbar stores clearAllFilters in a ref on first mount, so a handler
    // that appears later is never wired. Pass customLabelGroupContent instead.
    customLabelGroupContent: isInitialSelection ? (
      <></>
    ) : (
      <ToolbarItem>
        <Button
          variant="link"
          onClick={() => onFilterDelete(undefined, [], true)}
          isInline
        >
          Clear filters
        </Button>
      </ToolbarItem>
    ),
  };
};
