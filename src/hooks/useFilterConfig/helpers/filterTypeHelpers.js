import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import {
  configItemItemByLabel,
  defaultOnChange,
  itemForLabelInGroups,
  itemForValueInGroups,
  stringToId,
} from './helpers';

const textType = {
  // Creates the filterValues prop for the filterConfig passed to the toolbar/table provided the current value/state
  filterValues: ({ label }, handler, value) => ({
    value: value || '',
    ...defaultOnChange(handler, stringToId(label)),
  }),
  // Returns (all/a) filter chip for a given filter active value(s)
  filterChips: (configItem, value) => ({
    category: configItem.label,
    chips: [{ name: value[0] }],
  }),
  // Returns "select" arguments for the selection manager from a selected value
  // The returning of selectedValue/selectedValues is inconsistent.
  toSelectValue: (configItem, selectedValue) => [
    selectedValue.length === 0 ? undefined : [selectedValue],
    stringToId(configItem.label),
    true,
  ],
  // Returns "deselect" arguments from a filter chip
  toDeselectValue: (configItem, chip) => [
    chip.chips[0].name,
    stringToId(configItem.label),
  ],
};

const checkboxType = {
  filterValues: ({ items, label, modal }, handler, value, openFilterModal) => ({
    items: [
      ...items,
      ...(modal
        ? [
            {
              // TODO The checkbox filter in frontend-components does not really support "Show more", like the group filter.
              label: 'Show more',
              value: 'modal',
              onClick: () => openFilterModal?.(stringToId(label)),
            },
          ]
        : []),
    ],
    value,
    ...defaultOnChange(handler, stringToId(label)),
  }),
  filterChips: (configItem, value) => ({
    category: configItem.label,
    chips: value.map((chipValue) => ({
      name: configItem.items.find((item) => item.value === chipValue).label,
    })),
  }),
  toSelectValue: (configItem, selectedValues) => [
    selectedValues,
    stringToId(configItem.label),
    true,
  ],
  toDeselectValue: (configItem, chip) => [
    configItemItemByLabel(configItem, chip.chips[0].name).value,
    stringToId(configItem.label),
  ],
};

const radioType = {
  filterValues: ({ items, label }, handler, value) => ({
    items,
    value: value?.[0],
    ...defaultOnChange(handler, stringToId(label)),
  }),
  filterChips: (configItem, value) => ({
    category: configItem.label,
    chips: [
      { name: configItem.items.find((item) => item.value === value[0]).label },
    ],
  }),
  // The radio filter returns the selectedValues as selectedValue and the other way around
  toSelectValue: (configItem, selectedValue) => [
    [selectedValue],
    stringToId(configItem.label),
    true,
  ],
  toDeselectValue: (configItem, chip) => [
    configItemItemByLabel(configItem, chip.chips[0].name).value,
    stringToId(configItem.label),
  ],
};

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
    if (item.parent?.value) {
      delete activeValues[item.parent.value][item.value];
    } else {
      delete activeValues[item.value][item.value];
    }

    return [activeValues, filter, true];
  },
};

export default {
  [conditionalFilterType.text]: textType,
  [conditionalFilterType.checkbox]: checkboxType,
  [conditionalFilterType.radio]: radioType,
  [conditionalFilterType.singleSelect]: radioType,
  [conditionalFilterType.group]: groupType,
};
