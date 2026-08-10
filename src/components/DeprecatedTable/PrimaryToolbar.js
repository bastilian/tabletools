import React from 'react';
import propTypes from 'prop-types';

import FECPrimaryToolbar from '@redhat-cloud-services/frontend-components/PrimaryToolbar';

import TableViewToggle from '../TableViewToggle';

const PrimaryToolbar = ({ toolbarProps, tableViewToggleProps }) => (
  <FECPrimaryToolbar aria-label="Table toolbar" {...toolbarProps}>
    {toolbarProps?.children}
    {tableViewToggleProps && <TableViewToggle {...tableViewToggleProps} />}
  </FECPrimaryToolbar>
);

PrimaryToolbar.propTypes = {
  toolbarProps: propTypes.object,
  tableViewToggleProps: propTypes.object,
};

export default PrimaryToolbar;
