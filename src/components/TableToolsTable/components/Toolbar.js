import React from 'react';
import propTypes from 'prop-types';

import PrimaryToolbar from '@redhat-cloud-services/frontend-components/PrimaryToolbar';

import { TableViewToggle } from '~/components';

const Toolbar = ({ toolbarProps, tableViewToggleProps }) => (
  <PrimaryToolbar aria-label="Table toolbar" {...toolbarProps}>
    {tableViewToggleProps && <TableViewToggle {...tableViewToggleProps} />}
  </PrimaryToolbar>
);

Toolbar.propTypes = {
  toolbarProps: propTypes.object,
  tableViewToggleProps: propTypes.object,
};

export default Toolbar;
