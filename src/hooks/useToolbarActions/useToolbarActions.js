import { useMemo } from 'react';

/**
 * Collects consumer toolbar actions from options.
 *
 *  @param   {object} options                   Table tools options
 *  @param   {object} [options.dedicatedAction] Primary/dedicated action component
 *  @param   {Array}  [options.actions]         Additional toolbar actions
 *  @returns {object}                           `{ dedicatedAction, actions }`
 *
 *  @group Hooks
 */
const useToolbarActions = (options) => {
  const { dedicatedAction, actions: actionsOption } = options;

  const actions = useMemo(() => [...(actionsOption || [])], [actionsOption]);

  return {
    dedicatedAction,
    actions,
  };
};

export default useToolbarActions;
