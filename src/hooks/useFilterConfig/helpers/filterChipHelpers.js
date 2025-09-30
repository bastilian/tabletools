import { isNotEmpty, stringToId } from './helpers';
import { getFilterConfigItem } from './filterConfigHelpers';

const filterChipTemplates = (configItem, value, filterTypeHelpers) =>
  filterTypeHelpers?.filterChips(configItem, value);

export const toFilterChips = (filterConfig, filterTypes, activeFilters) =>
  Object.entries(activeFilters || {})
    .map(([filter, value]) => {
      const configItem = getFilterConfigItem(filterConfig, filter);
      const filterChips =
        configItem &&
        filterChipTemplates(configItem, value, filterTypes[configItem.type]);

      return configItem && isNotEmpty(value) && filterChips
        ? filterChips
        : undefined;
    })
    .filter((v) => !!v);

export const toDeselectValue = (
  filterConfig,
  filterTypes,
  chip,
  activeFilters,
) => {
  const configItem = getFilterConfigItem(
    filterConfig,
    stringToId(chip.category),
  );

  return filterTypes[configItem.type]?.toDeselectValue(
    configItem,
    chip,
    activeFilters,
  );
};
