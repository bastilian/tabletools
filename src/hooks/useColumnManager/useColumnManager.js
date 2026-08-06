import { useCallback, useState, useMemo } from 'react';
import { getColumnsForModal, getColumnsToShow } from './helper';

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
 *  @param   {boolean}                [options.enableDragDrop]          Enable drag and drop reordering in the column manager modal
 *
 *  @returns {useColumnManagerReturn}                                   Props and function to integrate the column manager
 *
 *  @group Hooks
 *
 */
const useColumnManager = (options = {}) => {
  const {
    columns,
    manageColumns: enableColumnManager,
    manageColumnLabel = 'Manage columns',
    enableDragDrop = false,
  } = options;

  const [columnState, setColumnState] = useState(() =>
    getColumnsForModal(columns, undefined, { enableDragDrop }).map(
      ({ key, isShown }) => ({
        key,
        isShown,
      }),
    ),
  );
  const [isManagerOpen, setIsManagerOpen] = useState(false);

  const onClick = useCallback(() => {
    setIsManagerOpen(true);
  }, []);

  const onClose = useCallback(() => setIsManagerOpen(false), []);

  const applyColumns = useCallback(
    (columnsToApply) => {
      setColumnState(
        columnsToApply.map(({ key, isShown }) => ({ key, isShown })),
      );
      onClose();
    },
    [onClose],
  );

  const columnsToShow = useMemo(
    () => getColumnsToShow(columns, columnState),
    [columnState, columns],
  );

  const appliedColumns = useMemo(
    () => getColumnsForModal(columns, columnState, { enableDragDrop }),
    [columns, columnState, enableDragDrop],
  );

  return enableColumnManager
    ? {
        columns: columnsToShow,
        columnManagerAction: {
          label: manageColumnLabel,
          onClick,
        },
        columnManagerModalProps: {
          appliedColumns,
          isOpen: isManagerOpen,
          onClose,
          applyColumns,
          enableDragDrop,
        },
      }
    : { columns };
};

export default useColumnManager;
