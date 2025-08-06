import React from 'react';
import { render, screen } from '@testing-library/react';
import { genre, artistByGenre } from '~/support/factories/filters';

import FilterModal from './FilterModal';

describe('FilterModal', () => {
  describe('with checkbox filter', function () {
    it('expect to render without error', async () => {
      render(<FilterModal filter={genre} isFilterModalOpen={true} />);

      await screen.findByRole('heading', 'Filter by genre');
      await screen.findByRole('button', { name: /apply selected/i });
    });
  });

  describe('with group filter', function () {
    it('expect to render without error', async () => {
      render(
        <FilterModal
          filter={artistByGenre}
          activeFilters={{ Enka: { 1: true } }}
          isFilterModalOpen={true}
        />,
      );

      await screen.findByRole('heading', 'Filter by genre');
      await screen.findByRole('button', { name: /apply selected/i });
    });
  });
});
