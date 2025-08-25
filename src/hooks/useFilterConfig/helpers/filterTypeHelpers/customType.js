import React from 'react';
import { stringToId } from '../helpers';

const customType = ({ Component, chips, selectValue, deselectValue }) => ({
  ...(Component
    ? {
        filterValues: (configItem, handler, value) => ({
          children: (
            <Component
              {...configItem}
              onChange={(value) => handler(configItem.label, value)}
              value={value}
            />
          ),
        }),
      }
    : {}),

  ...(chips
    ? {
        filterChips: (configItem, value) => ({
          category: configItem.label,
          chips: chips(value).map((name) => ({ name })),
        }),
      }
    : {}),

  ...(selectValue
    ? {
        toSelectValue: (configItem, selectedValue, selectedValues) => {
          const customSelectValue = selectValue(
            selectedValue || selectedValues,
          );

          return [customSelectValue, stringToId(configItem.label), true];
        },
      }
    : {}),

  ...(deselectValue
    ? {
        toDeselectValue: (configItem, chip) => {
          const customDeselectValue = deselectValue(chip);

          return [customDeselectValue, stringToId(configItem.label), true];
        },
      }
    : {}),
});

export default customType;
