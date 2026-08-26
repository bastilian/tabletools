import React from 'react';
import propTypes from 'prop-types';
import { ErrorState } from '@patternfly/react-component-groups';
import { Tbody, Td, Tr } from '@patternfly/react-table';

export const ErrorTableState = ({ columnsCount }) => (
  <Tbody>
    <Tr>
      <Td colSpan={columnsCount}>
        <ErrorState
          titleText="Unable to load data"
          bodyText="There was an error retrieving data. Check your connection and reload the page."
        />
      </Td>
    </Tr>
  </Tbody>
);

ErrorTableState.propTypes = {
  columnsCount: propTypes.number.isRequired,
};

export default ErrorTableState;
