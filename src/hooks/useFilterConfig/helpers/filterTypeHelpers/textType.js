import { defaultOnChange, stringToId } from '../helpers';

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

export default textType;
