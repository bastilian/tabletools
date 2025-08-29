import React from 'react';
import propTypes from 'prop-types';

import { FormSelect, FormSelectOption } from '@patternfly/react-core';

import { genres } from '../factories/items';

const GenresDropdown = ({ selected, onSelect: onSelectProp }) => {
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
      {genres.map((genre, index) => (
        <FormSelectOption key={index} value={genre} label={genre} />
      ))}
    </FormSelect>
  );
};

GenresDropdown.propTypes = {
  selected: propTypes.array,
  onSelect: propTypes.func,
};

export default GenresDropdown;
