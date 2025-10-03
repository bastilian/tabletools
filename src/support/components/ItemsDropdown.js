import React from 'react';
import propTypes from 'prop-types';

import { FormSelect, FormSelectOption } from '@patternfly/react-core';

const ItemsDropdown = ({ items, selected, onSelect: onSelectProp }) => {
  const onSelect = (_event, value) => {
    onSelectProp?.(value);
  };

  return (
    <FormSelect
      value={selected}
      onChange={onSelect}
      aria-label="FormSelect Input"
      ouiaId="BasicFormSelect"
    >
      {items.map(({ label, value }, index) => (
        <FormSelectOption key={index} value={value} label={label} />
      ))}
    </FormSelect>
  );
};

ItemsDropdown.propTypes = {
  items: propTypes.array,
  selected: propTypes.string,
  onSelect: propTypes.func,
};

export default ItemsDropdown;
