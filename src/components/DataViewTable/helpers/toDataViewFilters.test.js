import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { title } from '~/support/factories/filters';

import { toDataViewFilters } from './toDataViewFilters';

describe('toDataViewFilters', () => {
  it('returns nothing when filters are disabled', () => {
    expect(toDataViewFilters({ enableFilters: false })).toEqual({});
  });

  it('maps a text filter to DataViewFilters', () => {
    const onFilterUpdate = jest.fn();
    const onFilterDelete = jest.fn();

    const { filters } = toDataViewFilters({
      enableFilters: true,
      filterConfig: [title],
      activeFilters: {},
      onFilterUpdate,
      onFilterDelete,
      isInitialSelection: true,
    });

    render(<>{filters}</>);

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Filter by title')).toBeInTheDocument();
  });

  it('calls onFilterUpdate with FEC-compatible arguments when typing', () => {
    const onFilterUpdate = jest.fn();

    const { filters } = toDataViewFilters({
      enableFilters: true,
      filterConfig: [title],
      activeFilters: {},
      onFilterUpdate,
      onFilterDelete: jest.fn(),
      isInitialSelection: true,
    });

    render(<>{filters}</>);

    fireEvent.change(screen.getByPlaceholderText('Filter by title'), {
      target: { value: 'jazz' },
    });

    expect(onFilterUpdate).toHaveBeenCalledWith('title', undefined, 'jazz');
  });

  it('calls onFilterDelete when clear filters is clicked', () => {
    const onFilterUpdate = jest.fn();
    const onFilterDelete = jest.fn();

    const { customLabelGroupContent } = toDataViewFilters({
      enableFilters: true,
      filterConfig: [title],
      activeFilters: { title: ['jazz'] },
      onFilterUpdate,
      onFilterDelete,
      isInitialSelection: false,
    });

    render(<>{customLabelGroupContent}</>);

    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));

    expect(onFilterDelete).toHaveBeenCalledWith(undefined, [], true);
  });
});
