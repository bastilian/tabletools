import React from 'react';
import TableToolsTable from '~/components/TableToolsTable';

import useWithDefaults from './hooks/useWithDefaults';

/**
 * A wrapper around the TableToolsTable that allows defining defaults for columns, filters and options
 * that can be further extended with other wrapper components
 *
 *  @param   {object}             props            Building blocks from useTableTools plus presentation extras
 *  @param   {object}             [props.props]    Props of the TableToolsTable component
 *  @param   {object}             [props.defaults] Defaults for the props of the TableToolsTable component
 *  @returns {React.ReactElement}                  Deprecated table with toolbars
 *
 *  @group Components
 */
const BaseTableToolsTable = (props) => {
  const propsWithDefaults = useWithDefaults(props);

  return <TableToolsTable {...propsWithDefaults} />;
};

export default BaseTableToolsTable;
