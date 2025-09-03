import { useTableContext } from '~/hooks';

// TODO Refactor to use `useQuery`s cache/context instead of creating a new item in the tablecontext
const useItemsData = () => {
  const context = useTableContext();

  return context?.itemsData?.current || {};
};

export default useItemsData;
