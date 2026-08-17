import React from 'react';
import {
  ResponsiveAction,
  ResponsiveActions,
} from '@patternfly/react-component-groups';

import { toDataViewToolbarExport } from './toDataViewToolbarExport';
import { toColumnManagerAction } from './toColumnManagerAction';

const isElementAction = (action) =>
  React.isValidElement(action) ||
  (action?.label && typeof action.label !== 'string');

/**
 * Maps action building blocks to a Data View toolbar actions node
 *
 *  @param   {object}                  [config]                         Toolbar action config
 *  @param   {object}                  [config.actions]                 Action inputs
 *  @param   {object}                  [config.actions.dedicatedAction] Primary action component
 *  @param   {Array}                   [config.actions.toolbarActions]  Secondary toolbar actions
 *  @param   {object}                  [config.export]                  Export inputs
 *  @param   {object}                  [config.columnManager]           Column manager props
 *  @returns {React.ReactElement|null}                                  Actions slot content
 */
export const toDataViewToolbarActions = ({
  actions: { dedicatedAction: DedicatedAction, toolbarActions = [] } = {},
  export: exportConfig = {},
  columnManager = {},
} = {}) => {
  const exportNode = toDataViewToolbarExport(exportConfig);
  const columnManagerNode = toColumnManagerAction(columnManager);

  const elementActions = [];
  const responsiveActions = [];

  (toolbarActions || []).filter(Boolean).forEach((action, i) => {
    if (isElementAction(action)) {
      elementActions.push(
        <React.Fragment key={i}>
          {React.isValidElement(action) ? action : action.label}
        </React.Fragment>,
      );
      return;
    }

    const { label, onClick } = action;

    responsiveActions.push(
      <ResponsiveAction key={i} onClick={onClick}>
        {label}
      </ResponsiveAction>,
    );
  });
  if (columnManagerNode) {
    responsiveActions.push(columnManagerNode);
  }

  if (
    !DedicatedAction &&
    !elementActions.length &&
    !responsiveActions.length &&
    !exportNode
  ) {
    return null;
  }

  return (
    <>
      {DedicatedAction && <DedicatedAction />}
      {elementActions}
      {responsiveActions.length > 0 && (
        <ResponsiveActions breakpoint="lg" ouiaId="data-view-table-actions">
          {responsiveActions}
        </ResponsiveActions>
      )}
      {exportNode}
    </>
  );
};
