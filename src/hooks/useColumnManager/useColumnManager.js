import { useCallback, useState, useMemo } from 'react';
import { getColumnsForModal, getColumnsToShow } from './helper';

/**
 *  @typedef {object} useColumnManagerReturn
 *
 *  @property {boolean}  enableColumnManager  Whether column management is enabled
 *  @property {Array}    columns              Visible table columns
 *  @property {string}   [label]              Action label for the toolbar
 *  @property {Function} [openColumnManager]  Opens the column manager modal
 *  @property {Function} [closeColumnManager] Closes the column manager modal
 *  @property {Function} [applyColumns]       Applies column selection from the modal
 *  @property {Array}    [appliedColumns]     Columns shown in the modal
 *  @property {boolean}  [isOpen]             Whether the modal is open
 *  @property {boolean}  [enableDragDrop]     Whether drag-and-drop reordering is enabled
 */

/**
 * Provides column management state for table tools.
 *
 *  @param   {object}                 [options]                   AsyncTableTools options
 *  @param   {Array}                  [options.columns]           Columns for a table to be managed
 *  @param   {boolean}                [options.manageColumns]     Enables column management
 *  @param   {string}                 [options.manageColumnLabel] Label for the action item to show
 *  @param   {boolean}                [options.enableDragDrop]    Enable drag and drop reordering in the column manager modal
 *
 *  @returns {useColumnManagerReturn}                             Column manager props for variant adapters
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
  const [isOpen, setIsOpen] = useState(false);

  const openColumnManager = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeColumnManager = useCallback(() => setIsOpen(false), []);

  const applyColumns = useCallback(
    (columnsToApply) => {
      setColumnState(
        columnsToApply.map(({ key, isShown }) => ({ key, isShown })),
      );
      closeColumnManager();
    },
    [closeColumnManager],
  );

  const columnsToShow = useMemo(
    () => getColumnsToShow(columns, columnState),
    [columnState, columns],
  );

  const appliedColumns = useMemo(
    () => getColumnsForModal(columns, columnState, { enableDragDrop }),
    [columns, columnState, enableDragDrop],
  );

  if (!enableColumnManager) {
    return {
      enableColumnManager: false,
      columns,
    };
  }

  return {
    enableColumnManager,
    columns: columnsToShow,
    label: manageColumnLabel,
    openColumnManager,
    closeColumnManager,
    applyColumns,
    appliedColumns,
    isOpen,
    enableDragDrop,
  };
};

export default useColumnManager;
