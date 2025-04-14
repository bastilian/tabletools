import useContextOrInternalStateAndRefs from './useContextOrInternalStateAndRefs';

/**
 * Hook to access actions/callbacks provided by some hooks to trigger a state change
 *
 *  @returns {object} Table state callbacks
 *
 *  @group Hooks
 *
 */
const useStateCallbacks = () => {
  const { callbacks } = useContextOrInternalStateAndRefs();
  return callbacks;
};

export default useStateCallbacks;
