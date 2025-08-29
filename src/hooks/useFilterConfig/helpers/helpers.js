import isArray from 'lodash/isEmpty';
import isObject from 'lodash/isObject';
import defaultCustomTypeHelper from './filterTypeHelpers/customType';

export const stringToId = (string) =>
  string.split(/\s+/).join('-').toLowerCase();

export const findWithString = (value) => (item) =>
  String(item.value) === String(value);

export const defaultPlaceholder = (label) => `Filter by ${label.toLowerCase()}`;

export const defaultOnChange = (handler, label) => ({
  onChange: (_event, selectedValues, selectedValue) =>
    handler(label, selectedValue, selectedValues),
});

export const flattenConfigItems = (configItem) =>
  (configItem.items || configItem.groups).flatMap((parentItem) => [
    parentItem,
    ...parentItem.items.map((item) => ({ ...item, parent: parentItem })),
  ]);

export const configItemItemByLabel = (configItem, label) =>
  configItem.items.find(({ label: itemLabel }) => itemLabel === label);

export const itemForValueInGroups = (configItem, value) =>
  flattenConfigItems(configItem).find(
    ({ value: itemValue }) => `${itemValue}` === `${value}`,
  );

export const itemForLabelInGroups = (configItem, label) =>
  flattenConfigItems(configItem).find(
    ({ label: ItemLabel }) => `${ItemLabel}` === `${label}`,
  );

export const isNotEmpty = (value) =>
  (isArray(value) && value?.length > 0) ||
  value !== '' ||
  (isObject(value) && Object.keys(value).length > 0) ||
  typeof value === 'number';

export const primitiveEqual = (firstValue, secondValue) =>
  JSON.stringify(firstValue) == JSON.stringify(secondValue);

const prepareCustomFilterType = ([filterTypeKey, filterTypeConfig]) => {
  const {
    filterValues: defaultCustomFilterValues,
    filterChips: defaultCustomFilterChips,
    toSelectValue: defaultCustomToSelecteValue,
    toDeselectValue: defaultCustomToDeselectValue,
  } = defaultCustomTypeHelper(filterTypeConfig);
  const {
    filterValues = defaultCustomFilterValues,
    filterChips = defaultCustomFilterChips,
    toSelectValue = defaultCustomToSelecteValue,
    toDeselectValue = defaultCustomToDeselectValue,
  } = filterTypeConfig;

  return [
    filterTypeKey,
    {
      ...(filterValues ? { filterValues } : {}),
      ...(filterChips ? { filterChips } : {}),
      ...(toSelectValue ? { toSelectValue } : {}),
      ...(toDeselectValue ? { toDeselectValue } : {}),
    },
  ];
};

export const prepareCustomFilterTypes = (customFilterTypes) =>
  Object.fromEntries(
    Object.entries(customFilterTypes).map(prepareCustomFilterType),
  );
