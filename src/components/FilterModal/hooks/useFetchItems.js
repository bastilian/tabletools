import { useCallback } from 'react';
import { stringToId } from '~/hooks/useFilterConfig/helpers';
import { labelToid } from '../helpers';

const useFetchItems = ({ items, filter, setAsyncItems }) => {
  const id = stringToId(filter.label);

  const fetchItems = useCallback(
    async (...args) => {
      const filterItems = await items(...args);
      // TODO extract identifying "table tools request returns"
      if (Array.isArray(filterItems[0]) && typeof filterItems[1] === 'number') {
        setAsyncItems(id, filterItems[0]);

        return [filterItems[0].map(labelToid), filterItems[1]];
      } else {
        setAsyncItems(id, filterItems);

        return [filterItems.map(labelToid), filterItems.length];
      }
    },
    [id, items, setAsyncItems],
  );

  return fetchItems;
};

export default useFetchItems;
