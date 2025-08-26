import { configItemItemByLabel, defaultOnChange, stringToId } from '../helpers';

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

export default checkboxType;
