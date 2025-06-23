import { renderHook, waitFor } from '@testing-library/react';

import { DEFAULT_RENDER_OPTIONS } from '~/support/testHelpers';
import items from '~/support/factories/items';

import useItems from './useItems';

const appendMockItemId = (item, idx) => ({ ...item, itemId: idx + 1 });

describe('useItems', () => {
  const exampleItems = items(30).sort((item) => item.name);

  it('accepts an array as items and sets it as the state directly', async () => {
    const { result } = renderHook(
      () => useItems(false, exampleItems, undefined, exampleItems.length),
      DEFAULT_RENDER_OPTIONS,
    );

    await waitFor(() =>
      expect(result.current.items).toEqual(exampleItems.map(appendMockItemId)),
    );
  });

  it('accepts an async function returning an array as items and sets it as the state directly and set loaded to true', async () => {
    const tenItems = exampleItems.slice(0, 10).map(appendMockItemId);
    const asyncItems = async () => [tenItems, exampleItems.length];
    const { result } = renderHook(
      () => useItems(undefined, asyncItems, undefined, undefined),
      DEFAULT_RENDER_OPTIONS,
    );

    await waitFor(() =>
      expect(result.current).toEqual({
        loading: false,
        items: tenItems,
        total: exampleItems.length,
      }),
    );
  });
});
