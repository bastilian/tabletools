import { useTableContext } from '~/hooks';

/**
 * Hook to access the serialised table state
 *
 *  @returns {object} serialised table state
 *
 *  @group Hooks
 *
 */
const useSerialisedTableState = () => {
  const context = useTableContext();

  return context?.state?.[0]?.serialisedTableState;
};

export default useSerialisedTableState;
