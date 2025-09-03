import { useTableContext } from '~/hooks';

/**
 * Hook to access the "raw" table state
 *
 *  @returns {object} raw table state
 *
 *  @group Hooks
 *
 */
const useRawTableState = () => {
  const context = useTableContext();

  return context?.state?.[0]?.tableState;
};

export default useRawTableState;
