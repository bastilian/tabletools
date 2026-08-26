import React from 'react';
import { ResponsiveAction } from '@patternfly/react-component-groups';

/**
 * Maps column manager props to a Data View toolbar action node
 *
 *  @param   {object}                   [params]                     Column manager inputs
 *  @param   {boolean}                  [params.enableColumnManager] Whether column management is enabled
 *  @param   {string}                   [params.label]               Action label
 *  @param   {Function}                 [params.openColumnManager]   Opens the column manager modal
 *  @returns {React.ReactElement|false}                              ResponsiveAction node, or `false`
 */
export const toColumnManagerAction = ({
  enableColumnManager,
  label,
  openColumnManager,
} = {}) =>
  enableColumnManager && (
    <ResponsiveAction key="column-manager" onClick={openColumnManager}>
      {label}
    </ResponsiveAction>
  );
