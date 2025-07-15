import React from 'react';
import propTypes from 'prop-types';
import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  EmptyStateFooter,
  EmptyStateActions,
} from '@patternfly/react-core';
import { useStateCallbacks } from '~/hooks';

const CustomEmptyState = ({ kind, items, columns }) => {
  const {
    current: { clearFilters },
  } = useStateCallbacks();
  return (
    <EmptyState
      variant={EmptyStateVariant.full}
      titleText={<>No matching {kind} found</>}
      headingLevel="h5"
    >
      <EmptyStateBody>
        Custom Empty State for {kind}, because there are {items.length} items
        and no data for the{' '}
        <strong>{columns.map(({ title }) => title).join(', ')}</strong> columns.
      </EmptyStateBody>

      <EmptyStateFooter>
        <EmptyStateActions>
          <Button onClick={() => clearFilters()}>Clear filters</Button>
        </EmptyStateActions>
      </EmptyStateFooter>
    </EmptyState>
  );
};

CustomEmptyState.propTypes = {
  kind: propTypes.string,
  options: propTypes.object,
  items: propTypes.array,
  columns: propTypes.array,
};

export default CustomEmptyState;
