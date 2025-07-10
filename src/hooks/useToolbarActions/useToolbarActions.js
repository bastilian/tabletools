import { useMemo } from 'react';
import { toToolbarActions } from '../useTableTools/helpers';

/**
 * Hook for managing toolbar actions including dedicated actions and column manager actions
 * 
 * @param {object} options - Configuration options
 * @param {*} columnManagerAction - Column manager action if available
 * @returns {object} Object containing toolbarProps for actions
 */
const useToolbarActions = (options, columnManagerAction) => {
  const { dedicatedAction } = options;
  
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