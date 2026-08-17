/**
 * Provides radio select props for table tools.
 *
 *  @param   {object}   [options]               TableTools options
 *  @param   {Function} [options.onRadioSelect] A function to call when a row is selected
 *  @param   {number}   [options.total]         The total of items to determine wether or not to show the radio buttons
 *
 *  @returns {object}                           `{ onRadioSelect }`, or `{}` when disabled
 *
 *  @group Hooks
 *
 */
const useRadioSelect = ({ onRadioSelect, total }) => {
  const isRadioSelectEnabled = !!onRadioSelect;
  return isRadioSelectEnabled && total > 0 ? { onRadioSelect } : {};
};

export default useRadioSelect;
