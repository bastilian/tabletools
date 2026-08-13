import { useCallback } from 'react';

import { useFullTableState } from '~/hooks';

import { downloadItems, exportableColumns } from './helpers';

/**
 *  @typedef {object} useExportReturn
 *
 *  @property {boolean}  [isDisabled]       Whether export is disabled
 *  @property {Function} [exportWithFormat] Runs export for a given format
 */

/**
 * Provides export props for table tools.
 *
 *  @param   {object}          [options]            AsyncTableTools options
 *  @param   {Function}        [options.exporter]   Function to return an array of items to be exported
 *  @param   {Array}           [options.columns]    columns for the export
 *  @param   {boolean}         [options.isDisabled] Wether or not export is enabled
 *  @param   {Function}        [options.onStart]    Function to call before the export
 *  @param   {Function}        [options.onComplete] Function to call when the export succeeded
 *  @param   {Function}        [options.onError]    Function to call when there was an error exporting
 *
 *  @returns {useExportReturn}                      Export props, or `{}` when disabled
 *
 *  @group Hooks
 *
 */
const useExport = ({
  exporter,
  columns = [],
  isDisabled = false,
  onStart,
  onComplete,
  onError,
}) => {
  const enableExport = !!exporter;
  const exportColumns = exportableColumns(columns);
  const { tableState, serialisedTableState } = useFullTableState() || {};

  const exportWithFormat = useCallback(
    async (format) => {
      onStart?.();

      try {
        const items = await exporter(serialisedTableState, tableState);

        downloadItems(exportColumns, items, format);
        onComplete?.(items);
      } catch (error) {
        console.error(error);
        onError?.(error);
      }
    },
    [
      onStart,
      onError,
      onComplete,
      exporter,
      exportColumns,
      tableState,
      serialisedTableState,
    ],
  );

  return enableExport
    ? {
        isDisabled,
        exportWithFormat,
      }
    : {};
};

export default useExport;
