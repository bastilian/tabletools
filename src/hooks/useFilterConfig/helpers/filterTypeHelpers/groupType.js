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
  filterChips: (configItem, value) => ({
    category: configItem.label,
    chips: Object.entries(value).flatMap((groupItem) =>
      Object.keys(groupItem[1]).map((itemValue) => ({
        name: itemForValueInGroups(configItem, itemValue).label,
      })),
    ),
  }),
  toSelectValue: (configItem, selectedValues) => {
    const cleanedUpFilter = Object.fromEntries(
      Object.entries(selectedValues)
        .map(([group, groupItems]) => {
          const filteredItems = Object.entries(groupItems).filter(
            ([, value]) => value,
          );
          return filteredItems.length
            ? [
                group,
                Object.fromEntries(
                  Object.entries(groupItems).filter(([, value]) => value),
                ),
              ]
            : undefined;
        })
        .filter((v) => !!v),
    );

    return [
      Object.keys(cleanedUpFilter).length ? cleanedUpFilter : undefined,
      stringToId(configItem.label),
      true,
    ];
  },
  toDeselectValue: (configItem, chip, activeFilters) => {
    const filter = stringToId(configItem.label);
    const activeValues = activeFilters[filter];
    const item = itemForLabelInGroups(configItem, chip.chips[0].name);
    console.log('iii', { activeValues, item, configItem, chip, activeFilters });
    if (item.parent?.value) {
      delete activeValues[item.parent.value][item.value];
    } else {
      delete activeValues[item.value][item.value];
    }

    return [activeValues, filter, true];
  },
};

export default groupType;
