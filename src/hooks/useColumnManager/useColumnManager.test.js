import { renderHook, act } from '@testing-library/react';

import columns from '~/support/factories/columns';

import useColumnManager from './useColumnManager';

describe('useColumnManager', () => {
  const defaultArguments = [{ columns, manageColumns: true }];

  it('returns just columns if not enabled', () => {
    const { result } = renderHook(() => useColumnManager({ columns }));
    expect(result.current.columns).toBeDefined();
    expect(result.current.columnManagerModalProps).not.toBeDefined();
  });

  it('returns a columnManagerModalProps if enabled', () => {
    const { result } = renderHook(() => useColumnManager(...defaultArguments));
    expect(result.current.columnManagerModalProps).toBeDefined();
    expect(result.current.columnManagerModalProps.enableDragDrop).toBe(false);
  });

  it('passes enableDragDrop to the modal props when set', () => {
    const { result } = renderHook(() =>
      useColumnManager({ columns, manageColumns: true, enableDragDrop: true }),
    );

    expect(result.current.columnManagerModalProps.enableDragDrop).toBe(true);
    expect(
      result.current.columnManagerModalProps.appliedColumns.map(
        ({ key }) => key,
      ),
    ).toEqual(['Title', 'Artist', 'column-2', 'Genre', 'Rating']);
  });

  it('applies columns and preserves order', () => {
    const { result } = renderHook(() => useColumnManager(...defaultArguments));
    const reorderedColumns = [
      {
        title: 'Genre',
        key: 'Genre',
        isShown: true,
        isShownByDefault: true,
      },
      {
        title: 'Title',
        key: 'Title',
        isShown: true,
        isShownByDefault: true,
      },
      {
        title: 'Artist',
        key: 'Artist',
        isShown: false,
        isShownByDefault: true,
      },
      {
        title: columns[2].title,
        key: 'column-2',
        isShown: true,
        isShownByDefault: true,
      },
    ];

    act(() => {
      result.current.columnManagerModalProps.applyColumns(reorderedColumns);
    });

    expect(result.current.columns.map(({ title }) => title)).toEqual([
      'Genre',
      'Title',
      columns[2].title,
      'Rating',
    ]);
    expect(
      result.current.columnManagerModalProps.appliedColumns.map(
        ({ key, isShown }) => ({ key, isShown }),
      ),
    ).toEqual([
      { key: 'Genre', isShown: true },
      { key: 'Title', isShown: true },
      { key: 'Artist', isShown: false },
      { key: 'column-2', isShown: true },
    ]);
  });
});
