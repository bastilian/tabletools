import React from 'react';
import propTypes from 'prop-types';
import { DataViewToolbar as PatternFlyDataViewToolbar } from '@patternfly/react-data-view';
import { Pagination, PaginationVariant } from '@patternfly/react-core';
import useDataViewToolbarProps from './hooks/useDataViewToolbarProps';

/**
 * Data view toolbar component
 *
 *  @param   {object}             toolbarProps Toolbar props
 *  @param   {string}             variant      Variant of the toolbar
 *  @returns {React.ReactElement}              DataViewToolbar component
 */

const DataViewToolbar = ({ toolbarProps, variant = PaginationVariant.top }) => {
  const { pagination, actions } = useDataViewToolbarProps(toolbarProps);

  return (
    <PatternFlyDataViewToolbar
      actions={actions}
      pagination={
        pagination && <Pagination isCompact variant={variant} {...pagination} />
      }
      ouiaId="data-view-table-toolbar"
    />
  );
};

DataViewToolbar.propTypes = {
  toolbarProps: propTypes.shape({
    pagination: propTypes.object,
    actions: propTypes.shape({
      dedicatedAction: propTypes.elementType,
      toolbarActions: propTypes.array,
    }),
    export: propTypes.shape({
      isDisabled: propTypes.bool,
      exportWithFormat: propTypes.func,
    }),
  }),
  variant: propTypes.string,
};

export default DataViewToolbar;
