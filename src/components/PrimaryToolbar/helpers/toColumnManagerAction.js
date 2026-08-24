/**
 * Maps column manager props to a toolbar action item.
 *
 *  @param   {object}           [params]                     Column manager inputs
 *  @param   {boolean}          [params.enableColumnManager] Whether column management is enabled
 *  @param   {string}           [params.label]               Action label
 *  @param   {Function}         [params.openColumnManager]   Opens the column manager modal
 *  @returns {object|undefined}                              Toolbar action item, or `undefined`
 */
export const toColumnManagerAction = ({
  enableColumnManager,
  label,
  openColumnManager,
} = {}) =>
  enableColumnManager
    ? {
        label,
        onClick: openColumnManager,
      }
    : undefined;
