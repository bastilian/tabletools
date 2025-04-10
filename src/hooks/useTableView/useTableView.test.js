import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { Spinner } from '@patternfly/react-core';

import { DEFAULT_RENDER_OPTIONS } from '~/support/testHelpers';
import useItems from '~/hooks/useItems';

import items from '~/support/factories/items';
import columns from '~/support/factories/columns';
import tableTree from '~/support/factories/staticTableTree';

import useTableView from './useTableView';

const useRowsView = (viewItems, viewColumns) => {
  const items = useItems(viewItems);
  const table = useTableView(items.items, viewColumns);

  return {
    items,
    table,
  };
};

describe('useTableView', () => {
  const exampleItems = items(100).sort((item) => item.name);

  it('returns a loading state if loaded is false', () => {
    const { result } = renderHook(
      () => useRowsView(undefined, columns, {}),
      DEFAULT_RENDER_OPTIONS
    );

    expect(result.current.table.tableProps.rows[0].cells[0].title()).toEqual(
      <Spinner />
    );
  });

  it('returns rows when everything is loaded and has items', async () => {
    const { result } = renderHook(
      () => useRowsView(exampleItems, columns),
      DEFAULT_RENDER_OPTIONS
    );

    await waitFor(() =>
      expect(result.current.table.tableProps.rows.length).toEqual(100)
    );
  });

  it('returns an empty state if it is loaded, but has no items', () => {
    const { result } = renderHook(
      () => useRowsView([], columns),
      DEFAULT_RENDER_OPTIONS
    );

    expect(
      result.current.table.tableProps.rows[0].cells[0].title().props
    ).toEqual(
      expect.objectContaining({
        items: expect.any(Array),
        options: expect.any(Object),
        columns: expect.any(Array),
      })
    );
  });

  describe('useTableView TableViewToggle', () => {
    it('returns no toggle by default', () => {
      const { result } = renderHook(
        () => useTableView(exampleItems, columns, {}),
        DEFAULT_RENDER_OPTIONS
      );

      expect(result.current.TableViewToggle).not.toBeDefined();
    });

    it('returns a toggle if enabled via showViewToggle', () => {
      const { result } = renderHook(
        () => useTableView(exampleItems, columns, { showViewToggle: true }),
        DEFAULT_RENDER_OPTIONS
      );

      expect(result.current.TableViewToggle).toBeDefined();
    });

    it('returns a toggle if there is a table tree', () => {
      const { result } = renderHook(
        () =>
          useTableView(exampleItems, columns, {
            enableTreeView: true,
            tableTree,
          }),
        DEFAULT_RENDER_OPTIONS
      );

      expect(result.current.TableViewToggle).toBeDefined();
    });

    it('returns no toggle if there is a table tree, but showViewToggle is false', () => {
      const { result } = renderHook(
        () =>
          useTableView(exampleItems, columns, {
            showViewToggle: false,
            tableTree,
          }),
        DEFAULT_RENDER_OPTIONS
      );

      expect(result.current.TableViewToggle).not.toBeDefined();
    });
  });

  describe('useTableView Tree Table', () => {});
});
