import { defaultOnChange, stringToId, primitiveEqual } from '../helpers';

const radioType = {
  filterValues: ({ items, label }, handler, value) => ({
    items,
    value: value?.[0],
    ...defaultOnChange(handler, stringToId(label)),
  }),
  filterChips: (configItem, values) => ({
    category: configItem.label,
    chips: values.map((value) => ({
      name: configItem.items.find((item) => primitiveEqual(item.value, value))
        .label,
    })),
  }),
  // The radio filter returns the selectedValues as selectedValue and the other way around
  toSelectValue: (configItem, selectedValue) => [
    [selectedValue],
    stringToId(configItem.label),
    true,
  ],
  toDeselectValue: (configItem) => [
    undefined,
    stringToId(configItem.label),
    true,
  ],
};

export default radioType;
