import React from 'react';
import propTypes from 'prop-types';
import { Td } from '@patternfly/react-table';

const Cell = ({ row, column: { title, key, Component } }) => (
  <Td>
    {Component ? (
      <Component {...row.item} />
    ) : (
      row.item[key || title?.toLowerCase()]
    )}
  </Td>
);

Cell.propTypes = {
  row: propTypes.object,
  column: propTypes.object,
};

export default Cell;
