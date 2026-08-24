/**
 * Maps column manager props to ColumnManagementModal props.
 *
 *  @param   {object}           [params]                     Column manager inputs
 *  @param   {boolean}          [params.enableColumnManager] Whether column management is enabled
 *  @param   {Array}            [params.appliedColumns]      Columns shown in the modal
 *  @param   {boolean}          [params.isOpen]              Whether the modal is open
 *  @param   {Function}         [params.closeColumnManager]  Closes the column manager modal
 *  @param   {Function}         [params.applyColumns]        Applies column selection from the modal
 *  @param   {boolean}          [params.enableDragDrop]      Whether drag-and-drop reordering is enabled
 *  @returns {object|undefined}                              Modal props, or `undefined`
 */
export const toColumnManagerModalProps = ({
  enableColumnManager,
  appliedColumns,
  isOpen,
  closeColumnManager,
  applyColumns,
  enableDragDrop,
} = {}) =>
  enableColumnManager
    ? {
        appliedColumns,
        isOpen,
        onClose: closeColumnManager,
        applyColumns,
        enableDragDrop,
      }
    : undefined;
