import React from 'react';
import propTypes from 'prop-types';

import { Select, SelectOption } from '@patternfly/react-core';

import { genres } from '../factories/items';

// TODO Change to use the `ItemsDropdown` component
const GenresDropdown = ({ selected, onSelect: onSelectProp }) => {
  const onSelect = (_event, value) => {
    onSelectProp?.(value);
  };

  return (
    <Select
      value={selected}
      onChange={onSelect}
      aria-label="FormSelect Input"
      ouiaId="BasicFormSelect"
    >
      {genres.map((genre, index) => (
        <SelectOption key={index} value={genre} label={genre} />
      ))}
    </Select>
  );
};

GenresDropdown.propTypes = {
  selected: propTypes.string,
  onSelect: propTypes.func,
};

export default GenresDropdown;
