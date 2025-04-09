import filters from '~/support/factories/filters';

import filterTypeHelpers from './filterTypeHelpers';
import { toDeselectValue, toFilterChips } from './filterChipHelpers';

describe('toFilterChips', () => {
  it('returns filterchips for active filters', () => {
    const filterChips = toFilterChips(filters, filterTypeHelpers, {
      title: ['TEST NAME'],
    });

    expect(filterChips[0].chips[0].name).toEqual('TEST NAME');
  });
});

describe('toDeselectValue', () => {
  it('should return a value to pass as action to the seleciton manager', () => {
    expect(
      toDeselectValue(filters, filterTypeHelpers, {
        category: 'Title',
        chips: [
          {
            name: 'TEST NAME',
          },
        ],
      })
    ).toEqual(['TEST NAME', 'title']);
  });
});
