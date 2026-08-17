import React from 'react';
import { render, screen } from '@testing-library/react';

import TableStateProvider from '../TableStateProvider';
import TableToolsTable from '../TableToolsTable';

describe('DataViewTable', () => {
  const exampleItems = [
    { id: 1, itemId: 1, title: 'Data view row one' },
    { id: 2, itemId: 2, title: 'Data view row two' },
  ];
  const defaultProps = {
    tableToolsTableVariant: 'dataViewTable',
    columns: [
      {
        title: 'Title',
        key: 'title',
      },
    ],
    items: exampleItems,
    total: exampleItems.length,
  };

  it('should render a basic data view table', () => {
    render(
      <TableStateProvider>
        <TableToolsTable {...defaultProps} />
      </TableStateProvider>,
    );

    expect(screen.getByLabelText('DataViewTable')).toBeInTheDocument();
    expect(screen.getByText('Data view row two')).toBeInTheDocument();
  });
});
