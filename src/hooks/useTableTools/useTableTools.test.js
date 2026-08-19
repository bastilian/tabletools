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
});
