import { useMemo } from 'react';

import { toDataViewToolbarActions } from '../helpers/toDataViewToolbarActions';
import { toDataViewPaginationConfig } from '../helpers/toDataViewPaginationConfig';

/**
 * Maps generic toolbar config into PatternFly Data View toolbar props.
 *
 *  @param   {object} [toolbarProps]            Toolbar config
 *  @param   {object} [toolbarProps.pagination] Pagination props
 *  @param   {object} [toolbarProps.actions]    Action building blocks
 *  @param   {object} [toolbarProps.export]     Export building blocks
 *  @returns {object}                           Props for DataViewToolbar
 *
 *  @group Hooks
 */
const useDataViewToolbarProps = (toolbarProps = {}) => {
  const {
    pagination,
    actions,
    export: exportConfig,
    columnManager,
  } = toolbarProps;

  return useMemo(
    () => ({
      pagination: toDataViewPaginationConfig(pagination),
      actions: toDataViewToolbarActions({
        actions,
        export: exportConfig,
        columnManager,
      }),
    }),
    [pagination, actions, exportConfig, columnManager],
  );
};

export default useDataViewToolbarProps;
