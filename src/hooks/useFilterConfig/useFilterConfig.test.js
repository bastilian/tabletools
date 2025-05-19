import { renderHook, act, waitFor } from '@testing-library/react';

import { DEFAULT_RENDER_OPTIONS } from '~/support/testHelpers';
import filterConfig from '~/support/factories/filters';

import useFilterConfig from './useFilterConfig';

describe('useFilterConfig', () => {
  it('returns a toolbar configuration', () => {
    const { result } = renderHook(
      () =>
        useFilterConfig({
          filters: {
            filterConfig,
          },
        }),
      DEFAULT_RENDER_OPTIONS
    );

    expect(result.current.toolbarProps).toBeDefined();
  });

  it('returns no toolbar configuration if no filters are provided', () => {
    const { result } = renderHook(
      () => useFilterConfig(),
      DEFAULT_RENDER_OPTIONS
    );

    expect(result.current.toolbarProps).not.toBeDefined();
  });

  it('can add and delete filters and clears activeFilters', async () => {
    const { result } = renderHook(
      () =>
        useFilterConfig({
          filters: {
            filterConfig,
          },
        }),
      DEFAULT_RENDER_OPTIONS
    );

    await waitFor(() => result.current.toolbarProps.filterConfig.items[0]);

    await act(() =>
      result.current.toolbarProps.filterConfig.items[0].filterValues.onChange(
        'title',
        'asd'
      )
    );
    expect(result.current.toolbarProps.activeFiltersConfig.filters).toEqual([
      { category: 'Title', chips: [{ name: 'asd' }] },
    ]);

    await act(() =>
      result.current.toolbarProps.activeFiltersConfig.onDelete(undefined, [
        {
          category: 'title',
          chips: [
            {
              name: 'asd',
            },
          ],
        },
      ])
    );

    expect(result.current.activeFilters).toEqual(undefined);
  });
});
