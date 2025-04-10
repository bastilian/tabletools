import React from 'react';
import propTypes from 'prop-types';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  EmptyStateHeader,
} from '@patternfly/react-core';

/**
 * This component is the default view/rows shown if there is a `total` of *0* items.
 *
 *  @param   {object}             [props]      TableTools Options
 *  @param   {string}             [props.kind] Kind of items shown in the table
 *
 *  @returns {React.ReactElement}              The passed in component wrapped in a TableContext provider
 *
 *  @group Components
 *
 */
export const NoResultsTable = ({ kind = 'results' }) => (
  <EmptyState variant={EmptyStateVariant.full}>
    <EmptyStateHeader
      titleText={<>No matching {kind} found</>}
      headingLevel="h5"
    />
    <EmptyStateBody>
      This filter criteria matches no {kind}.<br />
      Try changing your filter settings.
    </EmptyStateBody>
  </EmptyState>
);

NoResultsTable.propTypes = {
  kind: propTypes.string,
};

export default NoResultsTable;
