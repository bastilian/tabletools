const applySerialisers = (serialisers, newState) =>
  Object.entries(serialisers).reduce(
    (newSerialisedState, [serialiserNamespace, serialiser]) => {
      return {
        ...newSerialisedState,
        ...(serialiser && typeof serialiser === 'function'
          ? {
              [serialiserNamespace]: serialiser(newState[serialiserNamespace]),
            }
          : {}),
      };
    },
    {}
  );

const compileState = (
  namespace,
  currentState,
  newStateForNameSpace,
  serialisers,
  callbacks
) => {
  const newStateTableState = {
    ...(currentState?.tableState || {}),
    [namespace]: newStateForNameSpace,
  };
  const newSerialisedState = applySerialisers(serialisers, newStateTableState);

  return {
    tableState: newStateTableState,
    ...(Object.keys(newSerialisedState).length
      ? { serialisedTableState: newSerialisedState }
      : {}),
    callbacks: callbacks,
  };
};

export default compileState;
