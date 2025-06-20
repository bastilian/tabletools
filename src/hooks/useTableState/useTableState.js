import { useCallback } from 'react';
import { useDeepCompareEffect } from 'use-deep-compare';

import useContextOrInternalStateAndRefs from './hooks/useContextOrInternalStateAndRefs';
import useSerialisers from './hooks/useSerialisers';
import useCallbacks from './hooks/useCallbacks';
import compileState from './helpers/compileState';

/**
 * Provides an interface for hooks to store their states name-spaced into the tableState in the TableContext
 *
 *  @param   {object} namespace            A key to namespace the state under (e.g. 'filters', 'sort')
 *  @param   {object} [initialState]       Initial state to put into the table state
 *  @param   {object} [options]            Options for the state
 *  @param   {object} [options.serialiser] A function to serialise the table state and allow access it via the useSerialisedTableState hook
 *  @param   {object} [options.callbacks]  An object with callbacks
 *
 *  @returns {Array}                       An array with the first item being the tableState, the second a function to set the state and a third optional item with the serialised state if a serialiser was provided
 *
 *  @group Hooks
 *
 */
const useTableState = (namespace, initialState, options = {}) => {
  const {
    serialisers,
    callbacks,
    state: [state, setState],
  } = useContextOrInternalStateAndRefs();

  useSerialisers(namespace, options.serialiser, serialisers);
  useCallbacks(namespace, options.callbacks, callbacks);

  const setTableState = useCallback(
    function setTableState(newStateForNameSpace) {
      return setState((currentState) => {
        const newState =
          typeof newStateForNameSpace === 'function'
            ? newStateForNameSpace(currentState?.tableState?.[namespace])
            : newStateForNameSpace;

        const nextState = compileState(
          namespace,
          currentState,
          newState,
          serialisers.current,
          callbacks.current
        );

        // Comment out for debugging table issues
        // console.group('State change by', namespace);
        // console.log('New state for namespace', newState);
        // console.log('Current state:', currentState?.tableState);
        // console.log('Next State:', nextState?.tableState);
        // console.groupEnd();

        return nextState;
      });
    },
    [serialisers, callbacks, setState, namespace]
  );

  useDeepCompareEffect(() => {
    console.log('asdasdasd');
    setTableState(initialState);
  }, [initialState, setTableState]);

  return [
    state?.tableState?.[namespace],
    setTableState,
    ...(options.serialiser ? [state?.serialisedTableState?.[namespace]] : []),
  ];
};

export default useTableState;
