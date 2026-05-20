import {
  defaultOnChange,
  itemForLabelInGroups,
  itemForValueInGroups,
  stringToId,
} from '../helpers';

const groupType = {
  filterValues: (
    { groups, label, modal },
    handler,
    value,
    openFilterModal,
  ) => ({
    selected: value,
    groups: groups?.map((item) => ({
      type: 'checkbox',
      ...item,
      items: item.items?.map((subItem) => ({
        type: 'checkbox',
        ...subItem,
      })),
    })),
    ...(modal
      ? {
          showMoreTitle: 'Show more',
          onShowMore: () => openFilterModal?.(stringToId(label)),
        }
      : {}),
    ...defaultOnChange(handler, stringToId(label)),
  }),
  filterChips: (configItem, value) => {
    const chips = Object.entries(value).flatMap(([groupKey, groupItem]) =>
      Object.entries(groupItem)
        .filter(([itemKey, value]) => {
          return itemKey !== groupKey && value === true;
        })
        .map(([key]) => ({
          name: itemForValueInGroups(configItem, key).label,
        })),
    );

    return chips.length
      ? {
          category: configItem.label,
          chips,
        }
      : undefined;
  },
  toSelectValue: (configItem, selectedValues) => [
    selectedValues,
    stringToId(configItem.label),
    true,
  ],
  toDeselectValue: (configItem, chip, activeFilters) => {
    const filter = stringToId(configItem.label);
    const activeValues = activeFilters[filter];
    const item = itemForLabelInGroups(configItem, chip.chips[0].name);

    if (item.parent?.value) {
      delete activeValues[item.parent.value][item.value];
    } else {
      delete activeValues[item.value][item.value];
    }

    return [activeValues, filter, true];
  },
};

export default groupType;
