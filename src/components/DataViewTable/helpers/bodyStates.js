import React from 'react';
import { ErrorState } from '@patternfly/react-component-groups';
import { EmptyState, EmptyStateBody } from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import { Tbody, Td, Tr } from '@patternfly/react-table';

export const getErrorBodyState = (columnsCount) => (
  <Tbody>
    <Tr key="error">
      <Td colSpan={columnsCount}>
        <ErrorState
          titleText="Unable to load data"
          bodyText="There was an error retrieving data. Check your connection and reload the page."
        />
      </Td>
    </Tr>
  </Tbody>
);

export const getDefaultEmptyBodyState = (columns) => (
  <Tbody>
    <Tr>
      <Td colSpan={columns.length}>
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
