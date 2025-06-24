import { useCallback, useState, useMemo } from 'react';
import { getFixedColumns } from './helper';

/**
 *  @typedef {object} useColumnManagerReturn
 *
 *  @property {Array}    columns               Patternfly table columns
 *  @property {Function} [columnManagerAction] Action props for a Toolbar action
 *  @property {object}   [ColumnManager]       ColumnManager modal component to be shown to manage columns
 */

/**
 * Provides columns for a Patternfly table, a (Primary)Toolbar action and a `ColumnManager` component
 *
 *  @param   {Array}                  columns                           Columns for a table to be managed
 *  @param   {object}                 [options]                         AsyncTableTools options
 *  @param   {string}                 [options.columnManagerSelectProp] Property to use for the selection manager to identify columns
 *  @param   {string}                 [options.manageColumnLabel]       Label for the action item to show
 *
 *  @returns {useColumnManagerReturn}                                   Props and function to integrate the column manager
 *
 *  @group Hooks
 *
 */
const useColumnManager = (options = {}) => {
  const {
    columns,
    columnManagerSelectProp: selectProp = 'key',
    manageColumns: enableColumnManager,
    manageColumnLabel = 'Manage columns',
  } = options;
  const fixedColumns = useMemo(() => getFixedColumns(columns), [columns]);
  const manageableColumns = fixedColumns.filter(({ manageable }) => manageable);
  const unManagableColumns = fixedColumns.filter(
    ({ manageable }) => !manageable,
  );
  const [selectedColumns, setSelectedColumns] = useState(manageableColumns);
  const [isManagerOpen, setIsManagerOpen] = useState(false);

  const onClick = useCallback(function innerClick() {
    setIsManagerOpen(true);
  }, []);

  const applyColumns = useCallback((newSelectedColumns, ...rest) => {
    console.log('newSelectedColumns', newSelectedColumns, ...rest);
    setSelectedColumns(newSelectedColumns);
    setIsManagerOpen(false);
  }, []);

  const columnsToShow = useMemo(
    () => [
      ...selectedColumns.filter(({ isShown }) => isShown),
      ...unManagableColumns,
    ],
    [selectedColumns, unManagableColumns],
  );

  return enableColumnManager
    ? {
        columns: columnsToShow,
        columnManagerAction: {
          label: manageColumnLabel,
          onClick,
        },
        columnManagerModalProps: {
          appliedColumns: selectedColumns,
          isOpen: isManagerOpen,
          onClose: () => setIsManagerOpen(false),
          applyColumns: applyColumns,
          selectProp: selectProp,
        },
      }
    : { columns };
};

export default useColumnManager;
