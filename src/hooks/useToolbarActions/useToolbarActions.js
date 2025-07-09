import { useMemo } from 'react';
import { toToolbarActions } from '../useTableTools/helpers';

/**
 * Hook for managing toolbar actions including dedicated actions and column manager actions
 * 
 * @param {object} options - Configuration options
 * @param {*} dedicatedAction - The first/dedicated action
 * @param {*} columnManagerAction - Column manager action if available
 * @returns {object} Object containing toolbarProps for actions
 */
const useToolbarActions = (options, dedicatedAction, columnManagerAction) => {
  const { toolbarProps: toolbarActionsProps } = useMemo(
    () =>
      toToolbarActions({
        ...options,
        firstAction: dedicatedAction,
        actions: [
          ...(options?.actions || []),
          ...((columnManagerAction && [columnManagerAction]) || []),
        ],
      }),
    [columnManagerAction, options, dedicatedAction],
  );

  return { toolbarProps: toolbarActionsProps };
};

export default useToolbarActions; 