import { title } from '~/support/factories/filters';
import filterTypeHelpers from '~/hooks/useFilterConfig/helpers/filterTypeHelpers';

import { toFilterToolbarConfig } from './toFilterToolbarConfig';

describe('toFilterToolbarConfig', () => {
  it('returns nothing when filters are disabled', () => {
    expect(toFilterToolbarConfig({ enableFilters: false })).toEqual({});
  });

  it('maps filter props to FEC ConditionalFilter toolbar props', () => {
    const onFilterUpdate = jest.fn();
    const onFilterDelete = jest.fn();
    const openFilterModal = jest.fn();

    const result = toFilterToolbarConfig({
      enableFilters: true,
      filterConfig: [title],
      filterTypes: filterTypeHelpers,
      activeFilters: { title: ['test'] },
      isInitialSelection: false,
      useReset: true,
      onFilterUpdate,
      onFilterDelete,
      openFilterModal,
    });

    expect(result.toolbarProps).toEqual(
      expect.objectContaining({
        filterConfig: expect.objectContaining({
          items: expect.arrayContaining([
            expect.objectContaining({ label: 'Title' }),
          ]),
        }),
        activeFiltersConfig: expect.objectContaining({
          deleteTitle: 'Reset filters',
          showDeleteButton: true,
          onDelete: onFilterDelete,
          filters: [{ category: 'Title', chips: [{ name: 'test' }] }],
        }),
      }),
    );
  });
});
