import { isNotEmpty, stringToId } from './helpers';
import { getFilterConfigItem } from './filterConfigHelpers';

const filterChipTemplates = (configItem, value, filterTypeHelpers) =>
  filterTypeHelpers?.filterChips(configItem, value);

export const toFilterChips = (
  filterConfig,
  filterTypes,
  activeFilters,
  asyncItems,
) => {
  return Object.entries(activeFilters || {})
    .map(([filter, value]) => {
      const configItem = getFilterConfigItem(filterConfig, filter);
      const itemsProp = configItem.type === 'groups' ? 'groups' : 'items';
      const configItemWithAsyncItems = {
        ...(configItem || {}),
        [itemsProp]: [
          ...(configItem?.[itemsProp] || []),
          ...(asyncItems?.[stringToId(configItem?.label)] || []),
        ],
      };

      return configItem && isNotEmpty(value)
        ? filterChipTemplates(
            configItemWithAsyncItems,
            value,
            filterTypes[configItem.type],
          )
        : undefined;
    })
    .filter((v) => !!v);
};

export const toDeselectValue = (
  filterConfig,
  filterTypes,
  chip,
  activeFilters,
  asyncItems,
) => {
  const configItem = getFilterConfigItem(
    filterConfig,
    stringToId(chip.category),
  );
  const itemsProp = configItem.type === 'groups' ? 'groups' : 'items';

  const configItemWithAsyncItems = {
    ...(configItem || {}),
    [itemsProp]: [
      ...(configItem?.[itemsProp] || []),
      ...(asyncItems?.[stringToId(configItem.label)] || []),
    ],
  };
  return filterTypes[configItem.type]?.toDeselectValue(
    configItemWithAsyncItems,
    chip,
    activeFilters,
  );
};
