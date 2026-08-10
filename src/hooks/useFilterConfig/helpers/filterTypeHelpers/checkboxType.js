import { configItemItemByLabel, defaultOnChange, stringToId } from '../helpers';

export const DEFAULT_MODAL_VISIBLE_ITEM_COUNT = 10;

const getVisibleItemCount = (modal) =>
  modal?.visibleItemCount ?? DEFAULT_MODAL_VISIBLE_ITEM_COUNT;

const checkboxType = {
  filterValues: ({ items, label, modal }, handler, value, openFilterModal) => {
    const dropdownItems = modal
      ? items.slice(0, getVisibleItemCount(modal))
      : items;

    return {
      items: [
        ...dropdownItems,
        ...(modal
          ? [
              {
                label: 'Show more',
                value: 'modal',
                hasCheckbox: false,
                isLoadButton: true,
                onClick: () => openFilterModal?.(stringToId(label)),
              },
            ]
          : []),
      ],
      value,
      ...defaultOnChange(handler, stringToId(label)),
    };
  },
  filterChips: (configItem, value) => ({
    category: configItem.label,
    chips: value.map((chipValue) => {
      const item = configItem.items.find((i) => i.value === chipValue);
      return {
        name: item.label,
        ...(item.icon && { icon: item.icon }),
      };
    }),
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
