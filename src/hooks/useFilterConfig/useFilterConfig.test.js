import { renderHook, act, waitFor } from '@testing-library/react';

import { DEFAULT_RENDER_OPTIONS } from '~/support/testHelpers';
import filterConfig from '~/support/factories/filters';
import { toFilterToolbarConfig } from '~/components/PrimaryToolbar/helpers/toFilterToolbarConfig';

import useFilterConfig from './useFilterConfig';

describe('useFilterConfig', () => {
  beforeAll(() => {
    fetch.mockResponseOnce(JSON.stringify({ data: [] }));
  });

  it('returns filter building blocks', async () => {
    const { result } = renderHook(
      () =>
        useFilterConfig({
          filters: {
            filterConfig,
          },
        }),
      DEFAULT_RENDER_OPTIONS,
    );

    await waitFor(() => expect(result.current.enableFilters).toBe(true));
    expect(result.current.filterConfig).toHaveLength(filterConfig.length);
    expect(result.current.onFilterUpdate).toEqual(expect.any(Function));
    expect(result.current.onFilterDelete).toEqual(expect.any(Function));
  });

  it('returns disabled state if no filters are provided', async () => {
    const { result } = renderHook(
      () => useFilterConfig(),
      DEFAULT_RENDER_OPTIONS,
    );

    await waitFor(() => expect(result.current.enableFilters).toBe(false));
  });

  it('can add and delete filters and clears activeFilters', async () => {
    const { result } = renderHook(
      () =>
        useFilterConfig({
          filters: {
            filterConfig,
          },
        }),
      DEFAULT_RENDER_OPTIONS,
    );

    await waitFor(() => expect(result.current.enableFilters).toBe(true));

    const { toolbarProps } = toFilterToolbarConfig(result.current);

    await waitFor(() => toolbarProps.filterConfig.items[0].filterValues);

    await act(() =>
      toolbarProps.filterConfig.items[0].filterValues.onChange('title', 'asd'),
    );

    const { toolbarProps: updatedToolbarProps } = toFilterToolbarConfig(
      result.current,
    );

    expect(updatedToolbarProps.activeFiltersConfig.filters).toEqual([
      { category: 'Title', chips: [{ name: 'asd' }] },
    ]);

    await act(() =>
      updatedToolbarProps.activeFiltersConfig.onDelete(undefined, [
        {
          category: 'title',
          chips: [
            {
              name: 'asd',
            },
          ],
        },
      ]),
    );

    expect(result.current.activeFilters).toEqual({});
  });
});
