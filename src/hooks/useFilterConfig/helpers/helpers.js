import React from 'react';
import isArray from 'lodash/isEmpty';
import isObject from 'lodash/isObject';

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
  // TODO This is a hack. Somewhere an `items` prop with an empty array is introduced to group filters
  // it should be either one or the other, but a filter should never have to have both `items` and `groups`
  [...(configItem.items || []), ...(configItem.groups || [])].flatMap(
    (parentItem) => [
      parentItem,
      ...parentItem.items.map((item) => ({ ...item, parent: parentItem })),
    ],
  );

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

export const prepareCustomFilterTypes = (customFilterTypes) =>
  Object.fromEntries(
    Object.entries(customFilterTypes).map(
      ([
        filterTypeKey,
        {
          filterValues,
          Component,
          filterChips,
          chips,
          toSelectValue,
          selectValue,
          toDeselectValue,
          deselectValue,
        },
      ]) => [
        filterTypeKey,
        {
          ...(filterValues
            ? { filterValues }
            : {
                filterValues: (configItem, handler, value) => ({
                  children: (
                    <Component
                      onChange={(value) => handler(configItem.label, value)}
                      value={value}
                    />
                  ),
                }),
              }),

          ...(filterChips
            ? { filterChips }
            : {
                filterChips: (configItem, value) => ({
                  category: configItem.label,
                  chips: chips(value).map((name) => ({ name })),
                }),
              }),

          ...(toSelectValue
            ? { toSelectValue }
            : {
                toSelectValue: (configItem, selectedValue, selectedValues) => {
                  const customSelectValue = selectValue(
                    selectedValue || selectedValues,
                  );

                  return [
                    customSelectValue[0],
                    stringToId(configItem.label),
                    customSelectValue[1],
                  ];
                },
              }),

          ...(toDeselectValue
            ? { toDeselectValue }
            : {
                toDeselectValue: (configItem, chip) => {
                  const customDeselectValue = deselectValue(chip);

                  return [
                    customDeselectValue[0],
                    stringToId(configItem.label),
                    customDeselectValue[1],
                  ];
                },
              }),
        },
      ],
    ),
  );
