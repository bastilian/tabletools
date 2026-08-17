import React from 'react';
import DownloadButton from '@redhat-cloud-services/frontend-components/DownloadButton';

/**
 * Maps export building blocks to a Data View toolbar export node
 *
 *  @param   {object}                  [params]                  Export inputs
 *  @param   {boolean}                 [params.isDisabled]       Whether export is disabled
 *  @param   {Function}                [params.exportWithFormat] Export runner
 *  @returns {React.ReactElement|null}                           Export node or null
 */
export const toDataViewToolbarExport = ({
  isDisabled,
  exportWithFormat,
} = {}) => {
  if (!exportWithFormat) {
    return null;
  }

  return (
    <DownloadButton
      key="export"
      isDisabled={isDisabled}
      onSelect={(_, format) => exportWithFormat(format)}
    />
  );
};
