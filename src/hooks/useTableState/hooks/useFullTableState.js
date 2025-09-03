import { useTableContext } from '~/hooks';

/**
 * Hook to access both the "raw" and the serialised  table state
 *
 *  @returns {object} table state
 *
 *  @group Hooks
 *
 */
const useFullTableState = () => {
  const context = useTableContext();

  return context?.state?.[0];
};

export default useFullTableState;
