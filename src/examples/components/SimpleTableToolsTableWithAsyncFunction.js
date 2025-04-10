import React, { useCallback } from 'react';

import { title, artist } from '~/support/factories/columns';
import { titleOrArtist } from '~/support/factories/filters';

import ExamplesTable from './ExamplesTable';
import useExampleDataQuery from '../hooks/useExampleDataQuery';

const SimpleTableToolsTableWithAsyncFunction = () => {
  const { fetch } = useExampleDataQuery();

  const fetchItems = useCallback(
    async ({ pagination = {}, filters, sort } = {}) => {
      const {
        data: items,
        meta: { total },
      } = await fetch({
        ...pagination,
        filters,
        sort,
      });

      return [items, total];
    },
    [fetch]
  );

  return (
    <ExamplesTable
      items={fetchItems}
      columns={[title, artist]}
      filters={{ filterConfig: [titleOrArtist] }}
    />
  );
};

export default SimpleTableToolsTableWithAsyncFunction;
