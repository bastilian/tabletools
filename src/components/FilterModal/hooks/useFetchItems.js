import { useCallback } from 'react';
import { fetchStatic } from '../helpers';

const useFetchItems = ({
  items: filterItems,
  groups: groupItems,
  modal: { items: modalItems } = {},
  type,
}) => {
  const fetchItems = useCallback(
    (...args) => {
      if (modalItems) {
        return modalItems(...args);
      } else if (
        typeof filterItems === 'function' ||
        typeof groupItems === 'function'
      ) {
        return (filterItems || groupItems)(...args);
      } else {
        return fetchStatic(filterItems || groupItems, type, ...args);
      }
    },
    [modalItems, filterItems, groupItems, type],
  );

  return fetchItems;
};

export default useFetchItems;
