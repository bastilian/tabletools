import React from 'react';
import propTypes from 'prop-types';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  EmptyStateHeader,
} from '@patternfly/react-core';

const CustomEmptyState = ({ kind, items, columns }) => (
  <EmptyState variant={EmptyStateVariant.full}>
    <EmptyStateHeader
      titleText={<>No matching {kind} found</>}
      headingLevel="h5"
    />
    <EmptyStateBody>
      Custom Empty State for {kind}, because there are {items.length} items and
      no data for the{' '}
      <strong>{columns.map(({ title }) => title).join(', ')}</strong> columns.
    </EmptyStateBody>
  </EmptyState>
);

CustomEmptyState.propTypes = {
  kind: propTypes.string,
  options: propTypes.object,
  items: propTypes.array,
  columns: propTypes.array,
};

export default CustomEmptyState;
