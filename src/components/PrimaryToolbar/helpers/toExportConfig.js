import React from 'react';
import { DropdownItem } from '@patternfly/react-core';

export const pdfExport = (exportWithFormat, isDisabled) => [
  <DropdownItem
    key="download-pdf"
    ouiaId="DownloadPDF"
    component="button"
    onClick={() => exportWithFormat('pdf')}
    isDisabled={isDisabled}
    aria-label="Export to PDF"
  >
    Export to PDF
  </DropdownItem>,
];

/**
 * Maps export props to FEC PrimaryToolbar `exportConfig` props.
 *
 *  @param   {object}   [params]                  Export inputs
 *  @param   {boolean}  [params.isDisabled]       Whether export is disabled
 *  @param   {Function} [params.exportWithFormat] Export runner
 *  @param   {Function} [params.pdfExport]        Optional PDF export menu item
 *  @returns {object}                             `{ toolbarProps }` or `{}`
 */
export const toExportConfig = ({
  isDisabled,
  exportWithFormat,
  pdfExport: pdfExportProp,
} = {}) =>
  exportWithFormat
    ? {
        toolbarProps: {
          exportConfig: {
            isDisabled,
            onSelect: (_, format) => exportWithFormat(format),
            ...(pdfExportProp
              ? {
                  extraItems: pdfExportProp(exportWithFormat, isDisabled),
                }
              : {}),
          },
        },
      }
    : {};
