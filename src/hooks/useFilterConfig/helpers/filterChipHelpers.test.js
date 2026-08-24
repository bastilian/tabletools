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

  it('flattens filterChips that return multiple groups', () => {
    const filterTypes = {
      ...filterTypeHelpers,
      text: {
        ...filterTypeHelpers.text,
        filterChips: () => [
          { category: 'Group A', chips: [{ name: 'one' }] },
          { category: 'Group B', chips: [{ name: 'two' }] },
        ],
      },
    };

    expect(
      toFilterChips(filters, filterTypes, { title: ['TEST NAME'] }),
    ).toEqual([
      { category: 'Group A', chips: [{ name: 'one' }] },
      { category: 'Group B', chips: [{ name: 'two' }] },
    ]);
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
      }),
    ).toEqual(['TEST NAME', 'title']);
  });

  it('looks up the filter by chip.key', () => {
    expect(
      toDeselectValue(filters, filterTypeHelpers, {
        key: 'title',
        category: 'Group A',
        chips: [{ name: 'TEST NAME' }],
      }),
    ).toEqual(['TEST NAME', 'title']);
  });
});
