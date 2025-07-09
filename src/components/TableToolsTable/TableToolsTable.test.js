import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import items from '~/support/factories/items';

import TableStateProvider from '../TableStateProvider';
import TableToolsTable from './TableToolsTable';

describe('TableToolsTable', () => {
  const exampleItems = items(100).sort((item) => item.name);
  const itemsFunc = jest.fn(async () => {
    return [exampleItems.slice(0, 10), exampleItems.length];
  });
  const ariaLabel = 'Async Test Table';
  const defaultProps = {
    'aria-label': ariaLabel,
    columns: [
      {
        title: 'Title',
        key: 'title',

      },
    ],
    items: itemsFunc,
    total: exampleItems.length,
  };

  it('should render a basic table', async () => {
    render(
      <TableStateProvider>
        <TableToolsTable {...defaultProps} />
      </TableStateProvider>,
    );

    await waitFor(() => expect(itemsFunc).toHaveBeenCalled());

    expect(screen.getByLabelText(ariaLabel)).toBeInTheDocument();
    expect(await screen.findByText(exampleItems[1].title)).toBeInTheDocument();
  });

  // TODO Extend with more tests for basic filtering, paginating, sorting etc.
});
