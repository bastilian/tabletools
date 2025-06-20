import React from 'react';
import propTypes from 'prop-types';
import { NumberInput } from '@patternfly/react-core';

const NumberFilter = ({ onChange, value = 0 }) => {
  const onChangeHandler = ({ target: { value } }) => onChange(+value);

  const onMinus = () => onChange(value - 1);
  const onPlus = () => onChange(value + 1);

  return (
    <NumberInput
      value={value}
      onMinus={onMinus}
      onChange={onChangeHandler}
      onPlus={onPlus}
      inputName="input"
      inputAriaLabel="number input"
      minusBtnAriaLabel="minus"
      plusBtnAriaLabel="plus"
    />
  );
};

NumberFilter.propTypes = {
  onChange: propTypes.func,
  value: propTypes.number,
};

export default NumberFilter;
