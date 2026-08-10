import { useMemo } from 'react';

import useBulkSelectProps from './useBulkSelectProps';

/**
 * This hook is an adapter to put required props into the right place and
 * form to be consumable by the ComposableTable components
 *
 *  @param   {object} [options] AsyncTableTools options
 *
 *  @returns {object}
 *
 *  @group Hooks
 *
 */
const useTableToolsForTable = (tableToolsProps) => {
  const { loading, total, bulkSelect, toolbarProps, tableProps } =
    tableToolsProps;
  console.log('ta', tableToolsProps);
  const { tableProps: bulkSelectTableProps } = useBulkSelectProps({
    ...bulkSelect,
    total,
  });

  const properProps = useMemo(() => {
    return {
      toolbarProps: {
        ...toolbarProps,
      },
      tableProps: {
        ...bulkSelectTableProps,
        ...tableProps,
      },
    };
  }, [toolbarProps, tableProps, bulkSelectTableProps]);

  return properProps;
};

export default useTableToolsForTable;
