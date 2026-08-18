/**
 * Maps radio select props to deprecated PatternFly Table props.
 *
 *  @param   {object}   [params]               Radio select inputs
 *  @param   {Function} [params.onRadioSelect] Row selection handler
 *  @returns {object}                          Table props, or `{}`
 */
export const toRadioSelectTableProps = ({ onRadioSelect } = {}) =>
  onRadioSelect
    ? {
        onSelect: onRadioSelect,
        selectVariant: 'radio',
      }
    : {};
