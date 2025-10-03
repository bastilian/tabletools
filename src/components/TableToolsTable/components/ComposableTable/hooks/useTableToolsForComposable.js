import { useMemo } from 'react';

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
const useTableToolsForComposable = ({
  loading,
  view,
  total,
  bulkSelect,
  expandable,
  tableProps: { cells: columns, rows, tableTree },
  toolbarProps: { pagination },
}) => {
  const composableReturn = useMemo(
    () => ({
      columns,
      rows,
      tableTree,
      loading,
      view,
      pagination,
      bulkSelect,
      expandable,
      total,
    }),
    [
      columns,
      rows,
      tableTree,
      loading,
      view,
      pagination,
      bulkSelect,
      total,
      expandable,
    ],
  );

  return composableReturn;
};

export default useTableToolsForComposable;
