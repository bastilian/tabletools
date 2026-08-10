import React from 'react';
import DownloadButton from '@redhat-cloud-services/frontend-components/DownloadButton';

/**
 * Adapts PrimaryToolbar `exportConfig` into a DataViewToolbar actions slot node.
 *
 *  @param   {object}                  [exportConfig] exportConfig from useExport / toolbarProps
 *  @returns {React.ReactElement|null}                DownloadButton or null when export is off
 */
export const toDataViewExport = (exportConfig) => {
  if (!exportConfig?.onSelect && !exportConfig?.extraItems) {
    return null;
  }

  return <DownloadButton key="export" {...exportConfig} />;
};
