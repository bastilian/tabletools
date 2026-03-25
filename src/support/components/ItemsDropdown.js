import React from 'react';
import propTypes from 'prop-types';

import { Select, SelectOption } from '@patternfly/react-core';

const ItemsDropdown = ({ items, selected, onSelect: onSelectProp }) => {
  const onSelect = (_event, value) => {
    onSelectProp?.(value);
  };

  return (
    <Select
      value={selected}
      onChange={onSelect}
      aria-label="Select Input"
      ouiaId="BasicSelect"
    >
      {items.map(({ label, value }, index) => (
        <SelectOption key={index} value={value} label={label} />
      ))}
    </Select>
  );
};

ItemsDropdown.propTypes = {
  items: propTypes.array,
  selected: propTypes.string,
  onSelect: propTypes.func,
};

export default ItemsDropdown;
