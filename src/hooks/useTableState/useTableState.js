import { useCallback } from 'react';
import { useDeepCompareEffect } from 'use-deep-compare';

import useDebug from '~/hooks/useDebug';

import useContextOrInternalStateAndRefs from './hooks/useContextOrInternalStateAndRefs';
import useStateObservers from './hooks/useStateObservers';
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
 *  @param   {object} [options.observers]  An object with properties of an other state namespace and an object or function returning an object with an desired state should the other state change
 *  @param   {object} [options.callbacks]  An object with callbacks
 *
 *  @returns {Array}                       An array with the first item being the tableState, the second a function to set the state and a third optional item with the serialised state if a serialiser was provided
 *
 *  @group Hooks
 *
 */
const useTableState = (namespace, initialState, options = {}) => {
  const debug = useDebug();
  const {
    serialisers,
    observers,
    callbacks,
    state: [state, setState],
  } = useContextOrInternalStateAndRefs();

  useStateObservers(namespace, options.observers, observers);
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
          observers.current,
          serialisers.current,
          callbacks.current,
        );

        if (debug) {
          console.group('State change by', namespace);
          console.log('New state for namespace:', newState);
          console.log('Current state:', currentState?.tableState);
          console.log('Next State:', nextState?.tableState);
          console.groupEnd();
        }

        return nextState;
      });
    },
    [observers, serialisers, callbacks, setState, namespace, debug],
  );

  useDeepCompareEffect(() => {
    setTableState(initialState);
  }, [initialState, setTableState]);

  return [
    state?.tableState?.[namespace],
    setTableState,
    ...(options.serialiser ? [state?.serialisedTableState?.[namespace]] : []),
  ];
};

export default useTableState;
