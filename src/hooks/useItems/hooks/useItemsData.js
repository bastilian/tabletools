import { useTableContext } from '~/hooks';

const useItemsData = () => {
  const context = useTableContext();

  return context?.itemsData?.current || {};
};

export default useItemsData;
