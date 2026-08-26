import React from 'react';
import propTypes from 'prop-types';
import { EmptyState, EmptyStateBody } from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import { Tbody, Td, Tr } from '@patternfly/react-table';

export const EmptyTableState = ({ columnsCount }) => (
  <Tbody>
    <Tr>
      <Td colSpan={columnsCount}>
        <EmptyState
          headingLevel="h4"
          icon={CubesIcon}
          titleText="No data found"
        >
          <EmptyStateBody>
            There are no matching data to be displayed.
          </EmptyStateBody>
        </EmptyState>
      </Td>
    </Tr>
  </Tbody>
);

EmptyTableState.propTypes = {
  columnsCount: propTypes.number.isRequired,
};

export default EmptyTableState;
