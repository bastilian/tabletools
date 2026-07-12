import React from 'react';
import { render, screen } from '@testing-library/react';

import items from '~/support/factories/items';
import columns from '~/support/factories/columns';
import filters, {
  customNumberFilterType,
  customNumberFilter,
} from '~/support/factories/filters';

import TableStateProvider from '../TableStateProvider';
import BaseTableToolsTable from './BaseTableToolsTable';

const ShareableTable = (props) => (
  <BaseTableToolsTable
    props={props}
    defaults={{
      options: {
        // debug: true,
      },
      columns,
      filters: {
        filterConfig: [...filters, customNumberFilter],
        customFilterTypes: {
          number: customNumberFilterType,
        },
      },
    }}
  />
);

const SharableVariantTable = (props) => (
  <ShareableTable
    props={props}
    defaults={{
      columns: [
        {
          title: 'Another Artist',
          Component: ({ artist }) => artist,
        },
      ],
    }}
  />
);

describe('BaseTableToolsTable', () => {
  const exampleItems = items(100).sort((item) => item.name);
  const itemsFunc = async () => [
    exampleItems.slice(0, 10),
    exampleItems.length,
  ];

  it('should render a table with all defaults', async () => {
    render(
      <TableStateProvider>
        <SharableVariantTable items={itemsFunc} />
      </TableStateProvider>,
    );

    expect(await screen.findByText(exampleItems[1].title)).toBeInTheDocument();

    expect(
      screen.getByRole('columnheader', {
        name: /title/i,
      }),
    ).toBeInTheDocument();
  });

  it('should render a table with one default and one additional column', async () => {
    const ariaLabel = 'Async Test Table';
    const props = {
      'aria-label': ariaLabel,
      columns: [
        'another-artist',
        {
          title: 'Title',
          key: 'title',
        },
      ],
      items: itemsFunc,
    };

    render(
      <TableStateProvider>
        <SharableVariantTable {...props} />
      </TableStateProvider>,
    );

    expect(await screen.findByText(exampleItems[1].title)).toBeInTheDocument();

    expect(await screen.findByText('Another Artist')).toBeInTheDocument();

    expect(
      screen.getByRole('columnheader', {
        name: /title/i,
      }),
    ).toBeInTheDocument();
  });
});
