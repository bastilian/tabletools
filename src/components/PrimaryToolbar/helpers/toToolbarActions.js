import React from 'react';

/**
 * Maps toolbar actions to FEC PrimaryToolbar `actionsConfig` props.
 *
 *  @param   {object} params               Action inputs
 *  @param   {Array}  [params.actions]     Toolbar action items
 *  @param   {object} [params.firstAction] Dedicated primary action component
 *  @returns {object}                      `{ toolbarProps }` or `{}`
 */
export const toToolbarActions = ({
  actions: actionsOption = [],
  firstAction: PrimaryAction = undefined,
}) =>
  actionsOption?.length || PrimaryAction
    ? {
        toolbarProps: {
          actionsConfig: {
            actions: [
              PrimaryAction && <PrimaryAction key="primaryAction" />,
              ...actionsOption,
            ],
          },
        },
      }
    : {};
