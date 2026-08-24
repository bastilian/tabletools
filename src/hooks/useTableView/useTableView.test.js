import { renderHook, waitFor } from '@testing-library/react';

import { DEFAULT_RENDER_OPTIONS } from '~/support/testHelpers';
import useItems from '~/hooks/useItems';
import { toTableViewTableProps } from '~/components/DeprecatedTable/helpers/toTableViewTableProps';
import { toTableViewToggleProps } from '~/components/PrimaryToolbar/helpers/toTableViewToggleProps';

import items from '~/support/factories/items';
import columns from '~/support/factories/columns';
import tableTree from '~/support/factories/staticTableTree';

import useTableView from './useTableView';

const useRowsView = (
  veiwLoading,
  viewItems,
  viewError,
  viewTotal,
  viewColumns,
) => {
  const { loading, items, error, total } = useItems(
    veiwLoading,
    viewItems,
    viewError,
    viewTotal,
  );
  const tableView = useTableView(loading, items, error, total, {
    columns: viewColumns,
  });

  return {
    items,
    tableView,
  };
};

describe('useTableView', () => {
  const exampleItems = items(100).sort((item) => item.name);

  it('returns rows when everything is loaded and has items', async () => {
    const { result } = renderHook(
      () =>
        useRowsView(
          false,
          exampleItems,
          undefined,
          exampleItems.length,
          columns,
        ),
      DEFAULT_RENDER_OPTIONS,
    );

    await waitFor(() =>
      expect(
        toTableViewTableProps(result.current.tableView).rows.length,
      ).toEqual(100),
    );
  });

  it('returns an empty state if it is loaded, but has no items', () => {
    const { result } = renderHook(
      () => useRowsView(false, [], undefined, 0, columns),
      DEFAULT_RENDER_OPTIONS,
    );

    expect(
      toTableViewTableProps(result.current.tableView).rows[0].cells[0].title()
        .props,
    ).toEqual(
      expect.objectContaining({
        items: expect.any(Array),
        options: expect.any(Object),
        columns: expect.any(Array),
      }),
    );
  });

  it('returns table view building blocks', () => {
    const { result } = renderHook(
      () =>
        useTableView(false, exampleItems, undefined, exampleItems.length, {
          columns,
        }),
      DEFAULT_RENDER_OPTIONS,
    );

    expect(result.current).toEqual(
      expect.objectContaining({
        view: 'rows',
        setTableView: expect.any(Function),
        choosableViews: expect.any(Object),
        supportedViews: expect.any(Object),
        enableToggle: false,
        loading: false,
        items: exampleItems,
        total: exampleItems.length,
        viewOptions: expect.objectContaining({ columns }),
      }),
    );
  });

  describe('useTableView TableViewToggle', () => {
    it('returns no toggle by default', () => {
      const { result } = renderHook(
        () =>
          useTableView(false, exampleItems, undefined, exampleItems.length, {
            columns,
          }),
        DEFAULT_RENDER_OPTIONS,
      );

      expect(toTableViewToggleProps(result.current)).toBeUndefined();
    });

    it('returns a toggle if enabled via showViewToggle', () => {
      const { result } = renderHook(
        () =>
          useTableView(false, exampleItems, undefined, exampleItems.length, {
            columns,
            showViewToggle: true,
          }),
        DEFAULT_RENDER_OPTIONS,
      );

      expect(toTableViewToggleProps(result.current)).toBeDefined();
    });

    it('returns a toggle if there is a table tree', () => {
      const { result } = renderHook(
        () =>
          useTableView(false, exampleItems, undefined, exampleItems.length, {
            columns,
            enableTreeView: true,
            tableTree,
          }),
        DEFAULT_RENDER_OPTIONS,
      );

      expect(toTableViewToggleProps(result.current)).toBeDefined();
    });

    it('returns no toggle if there is a table tree, but showViewToggle is false', () => {
      const { result } = renderHook(
        () =>
          useTableView(false, exampleItems, undefined, exampleItems.length, {
            columns,
            showViewToggle: false,
            tableTree,
          }),
        DEFAULT_RENDER_OPTIONS,
      );

      expect(toTableViewToggleProps(result.current)).toBeUndefined();
    });
  });

  describe('useTableView Tree Table', () => {});
});
