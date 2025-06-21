import { renderHook, waitFor } from '@testing-library/react';

import { DEFAULT_RENDER_OPTIONS } from '~/support/testHelpers';
import items from '~/support/factories/items';
import columns from '~/support/factories/columns';

import useTableTools from './useTableTools';

describe('useTableTools', () => {
  const exampleItems = items(30).sort((item) => item.name);

  const defaultArguments = [exampleItems, columns, {}];

  it('returns a object with tableProps and toolbarProps even with no items, columns or options passed', () => {
    const { result } = renderHook(
      () => useTableTools([], []),
      DEFAULT_RENDER_OPTIONS,
    );

    expect(result.current.tableProps).toBeDefined();
    expect(result.current.toolbarProps).toBeDefined();
  });

  it('returns a object with tableProps and toolbarProps with items array', () => {
    const { result } = renderHook(
      () => useTableTools(...defaultArguments),
      DEFAULT_RENDER_OPTIONS,
    );

    expect(result.current.tableProps).toBeDefined();
    expect(result.current.toolbarProps).toBeDefined();
  });

  it('returns a object with tableProps and toolbarProps while fetching items async', async () => {
    const asyncFunction = jest.fn(async () => [
      exampleItems,
      exampleItems.length,
    ]);

    renderHook(
      () => useTableTools(asyncFunction, columns),
      DEFAULT_RENDER_OPTIONS,
    );

    await waitFor(() => {
      return expect(asyncFunction).toHaveBeenCalled();
    });
  });
});
