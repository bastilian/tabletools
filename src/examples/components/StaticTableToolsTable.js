import React from 'react';

import { title, artist } from '~/support/factories/columns';
import { title as titleFilter } from '~/support/factories/filters';
import itemsFactory from '~/support/factories/items';

import { StaticTableToolsTable } from '~/components';

const arrayOfItems = itemsFactory(500);

const StaticTableToolsTableExample = () => {
  return (
    <StaticTableToolsTable
      items={arrayOfItems}
      columns={[title, artist]}
      filters={{ filterConfig: [titleFilter] }}
    />
  );
};

export default StaticTableToolsTableExample;
