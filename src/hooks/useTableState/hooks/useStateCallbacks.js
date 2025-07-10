import useContextOrInternalStateAndRefs from './useContextOrInternalStateAndRefs';

/**
 * Hook to access "callbacks" provided by some of the other hooks
 *
 *  @returns {object} table state
 *
 *  @group Hooks
 *
 */
const useStateCallbacks = () => {
  const { callbacks } = useContextOrInternalStateAndRefs();

  return callbacks;
};

export default useStateCallbacks;
