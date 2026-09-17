import { renderHook, waitFor } from '@testing-library/react';

import { DEFAULT_RENDER_OPTIONS } from '~/support/testHelpers';
import items from '~/support/factories/items';
import columns from '~/support/factories/columns';

import useTableTools from './useTableTools';

describe('useTableTools', () => {
  const exampleItems = items(30).sort((item) => item.name);

  const defaultArguments = [
    false,
    exampleItems,
    undefined,
    exampleItems.length,
    { columns },
  ];

  it('returns building-block props even with no items', async () => {
    const { result } = renderHook(
      () => useTableTools(false, [], undefined, 0, { columns }),
      DEFAULT_RENDER_OPTIONS,
    );

    await waitFor(() => expect(result.current.columns).toBeDefined());
    await waitFor(() => expect(result.current.pagination).toBeDefined());
    expect(result.current.tableProps).toBeUndefined();
    expect(result.current.toolbarProps).toBeUndefined();
  });

  it('returns building-block props with items array', async () => {
    const { result } = renderHook(
      () => useTableTools(...defaultArguments),
      DEFAULT_RENDER_OPTIONS,
    );

    await waitFor(() => expect(result.current.columns).toBeDefined());
    await waitFor(() => expect(result.current.tableSort).toBeDefined());
    expect(result.current.loading).toBe(false);
  });

  it('returns columnManager and toolbarActions as separate building blocks', async () => {
    const { result } = renderHook(
      () =>
        useTableTools(false, exampleItems, undefined, exampleItems.length, {
          columns,
          manageColumns: true,
          actions: [{ label: 'Example', onClick: jest.fn() }],
        }),
      DEFAULT_RENDER_OPTIONS,
    );

    await waitFor(() => expect(result.current.columnManager).toBeDefined());

    expect(result.current.toolbarActions).toEqual([
      { label: 'Example', onClick: expect.any(Function) },
    ]);
    expect(result.current.columnManager.enableColumnManager).toBe(true);
    expect(result.current.columnManagerModalProps).toBeDefined();
    expect(result.current.columnManagerModalProps.isOpen).toBe(false);
  });

  it('returns building-block props while fetching items async', async () => {
    const asyncFunction = jest.fn(async () => [
      exampleItems,
      exampleItems.length,
    ]);

    renderHook(
      () =>
        useTableTools(undefined, asyncFunction, undefined, undefined, {
          columns,
        }),
      DEFAULT_RENDER_OPTIONS,
    );

    await waitFor(() => expect(asyncFunction).toHaveBeenCalled());
  });

  it('correctly offsets sortBy when detailsComponent is present without selection', async () => {
    const { result } = renderHook(
      () =>
        useTableTools(false, exampleItems, undefined, exampleItems.length, {
          columns,
          sortBy: { index: 2, direction: 'desc' },
          detailsComponent: () => null,
        }),
      DEFAULT_RENDER_OPTIONS,
    );

    await waitFor(() => expect(result.current.tableSort).toBeDefined());
    // Offset should be 1 (only expand column), so index becomes 2 + 1 = 3
    expect(result.current.tableSort.sortBy).toEqual({
      index: 3,
      direction: 'desc',
    });
  });

  it('correctly offsets sortBy when onSelect is present without detailsComponent', async () => {
    const { result } = renderHook(
      () =>
        useTableTools(false, exampleItems, undefined, exampleItems.length, {
          columns,
          sortBy: { index: 2, direction: 'desc' },
          onSelect: () => {},
        }),
      DEFAULT_RENDER_OPTIONS,
    );

    await waitFor(() => expect(result.current.tableSort).toBeDefined());
    // Offset should be 1 (only select column), so index becomes 2 + 1 = 3
    expect(result.current.tableSort.sortBy).toEqual({
      index: 3,
      direction: 'desc',
    });
  });

  it('correctly offsets sortBy when both detailsComponent and onSelect are present', async () => {
    const { result } = renderHook(
      () =>
        useTableTools(false, exampleItems, undefined, exampleItems.length, {
          columns,
          sortBy: { index: 2, direction: 'desc' },
          detailsComponent: () => null,
          onSelect: () => {},
        }),
      DEFAULT_RENDER_OPTIONS,
    );

    await waitFor(() => expect(result.current.tableSort).toBeDefined());
    // Offset should be 2 (1 select column + 1 expand column), so index becomes 2 + 2 = 4
    expect(result.current.tableSort.sortBy).toEqual({
      index: 4,
      direction: 'desc',
    });
  });
});
