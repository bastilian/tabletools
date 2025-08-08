import { useCallback, useReducer, useRef } from 'react';

import reducer, { init as initReducer } from './reducer';

/**
 * Provides a generic API to manage selection stats of one (default) or multiple groups of selections.
 *
 *  @param   {Array}  selected  Array of items initially selected
 *  @param   {object} [options] function to call when a selection is made
 *
 *  @returns {object}           Object containing the current selection state and functions to manipulate it
 *
 *  @group Hooks
 *
 */
const useSelectionManager = (selected, { withGroups = false } = {}) => {
  const initialSelection = useRef(selected);
  const [selection, dispatch] = useReducer(
    reducer,
    selected,
    initReducer(withGroups),
  );

  const set = useCallback(
    (items, group) => dispatch({ type: 'set', group, items }),
    [dispatch],
  );

  const select = useCallback(
    (item, group, useSet = false) =>
      useSet ? set(item, group) : dispatch({ type: 'select', group, item }),
    [set, dispatch],
  );

  const deselect = useCallback(
    (item, group, useSet = false) =>
      useSet ? set(item, group) : dispatch({ type: 'deselect', group, item }),
    [dispatch, set],
  );

  const toggle = useCallback(
    (item, group) => dispatch({ type: 'toggle', group, item }),
    [dispatch],
  );

  const reset = useCallback(
    (group) => {
      set(initialSelection.current, group);
    },
    [set, initialSelection],
  );

  const clear = useCallback((group) => set(undefined, group), [set]);

  return {
    set,
    select,
    deselect,
    toggle,
    reset,
    clear,
    selection: withGroups ? selection : selection.default,
  };
};

export default useSelectionManager;
