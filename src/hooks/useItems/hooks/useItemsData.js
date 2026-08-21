import { useTableContext } from '~/hooks';

// TODO Refactor to use `useQuery`s cache/context instead of creating a new item in the tablecontext

/**
 * Allows access to items stored in the table context
 *
 *  @returns {object} Items data
 *
 *  @group Hooks
 *
 */
const useItemsData = () => {
  const context = useTableContext();

  return context?.itemsData?.current || {};
};

export default useItemsData;
