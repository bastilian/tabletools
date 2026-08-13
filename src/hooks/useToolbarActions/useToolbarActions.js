import { useMemo } from 'react';

/**
 * Collects toolbar actions
 *
 *  @param   {object} options                   Table tools options
 *  @param   {object} [options.dedicatedAction] Primary/dedicated action component
 *  @param   {Array}  [options.actions]         Additional toolbar actions
 *  @param   {object} [columnManagerAction]     Column manager toolbar action
 *  @returns {object}                           `{ dedicatedAction, actions }`
 *
 *  @group Hooks
 */
const useToolbarActions = (options, columnManagerAction) => {
  const { dedicatedAction, actions: actionsOption } = options;

  const actions = useMemo(
    () => [
      ...(actionsOption || []),
      ...((columnManagerAction && [columnManagerAction]) || []),
    ],
    [actionsOption, columnManagerAction],
  );

  return {
    dedicatedAction,
    actions,
  };
};

export default useToolbarActions;
