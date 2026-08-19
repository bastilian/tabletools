import { renderHook, waitFor, act } from '@testing-library/react';

import { DEFAULT_RENDER_OPTIONS } from '~/support/testHelpers';
import columns from '~/support/factories/columns';
import { useSerialisedTableState } from '~/hooks/useTableState';

import useTableSort from './useTableSort';

describe('useTableSort', () => {
  const exampleSortBy = {
    index: 3,
    direction: 'asc',
  };

  it('returns sort props', () => {
    const { result } = renderHook(
      () => useTableSort(columns),
      DEFAULT_RENDER_OPTIONS,
    );
    expect(result.current.onSort).toBeDefined();
    expect(result.current.sortableColumns).toBeDefined();
  });

  it('returns sort props with an inital state', async () => {
    const { result } = renderHook(
      () =>
        useTableSort(columns, {
          sortBy: exampleSortBy,
        }),
      DEFAULT_RENDER_OPTIONS,
    );

    await waitFor(() => expect(result.current.sortBy).toEqual(exampleSortBy));
  });

  it('should allow changing the sort via onSort', async () => {
    const { result } = renderHook(
      () =>
        useTableSort(columns, {
          sortBy: exampleSortBy,
        }),
      DEFAULT_RENDER_OPTIONS,
    );

    act(() => {
      result.current.onSort(undefined, 1, 'desc');
    });

    await waitFor(() =>
      expect(result.current.sortBy).toEqual({
        index: 1,
        direction: 'desc',
      }),
    );
  });

  it('should allow changing the sort via onSort', async () => {
    const useTableSortWithSerialisedState = (...args) => {
      const serialised = useSerialisedTableState();
      const sort = useTableSort(...args);

      return {
        sort,
        serialised,
      };
    };
    const sortSerialiser = () => {
      return 'Serialised sort';
    };
    const { result } = renderHook(
      () =>
        useTableSortWithSerialisedState(columns, {
          sortBy: exampleSortBy,
          serialisers: {
            sort: sortSerialiser,
          },
        }),
      DEFAULT_RENDER_OPTIONS,
    );

    act(() => {
      result.current.sort.onSort(undefined, 2, 'desc');
    });

    await waitFor(() =>
      expect(result.current.sort.sortBy).toEqual({
        index: 2,
        direction: 'desc',
      }),
    );

    expect(result.current.serialised.sort).toEqual('Serialised sort');
  });
});
