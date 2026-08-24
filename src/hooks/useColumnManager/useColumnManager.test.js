import { renderHook, act } from '@testing-library/react';

import columns from '~/support/factories/columns';
import { toColumnManagerModalProps } from '~/utilities/helpers/toColumnManagerModalProps';

import useColumnManager from './useColumnManager';

describe('useColumnManager', () => {
  const defaultArguments = [{ columns, manageColumns: true }];

  it('returns just columns if not enabled', () => {
    const { result } = renderHook(() => useColumnManager({ columns }));
    expect(result.current.columns).toBeDefined();
    expect(result.current.enableColumnManager).toBe(false);
    expect(toColumnManagerModalProps(result.current)).toBeUndefined();
  });

  it('returns column manager building blocks when enabled', () => {
    const { result } = renderHook(() => useColumnManager(...defaultArguments));

    expect(result.current.enableColumnManager).toBe(true);
    expect(toColumnManagerModalProps(result.current)).toBeDefined();
    expect(toColumnManagerModalProps(result.current).enableDragDrop).toBe(
      false,
    );
  });

  it('passes enableDragDrop to the modal props when set', () => {
    const { result } = renderHook(() =>
      useColumnManager({ columns, manageColumns: true, enableDragDrop: true }),
    );

    const modalProps = toColumnManagerModalProps(result.current);

    expect(modalProps.enableDragDrop).toBe(true);
    expect(modalProps.appliedColumns.map(({ key }) => key)).toEqual([
      'Title',
      'Artist',
      'column-2',
      'Genre',
      'Rating',
    ]);
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
      result.current.applyColumns(reorderedColumns);
    });

    expect(result.current.columns.map(({ title }) => title)).toEqual([
      'Genre',
      'Title',
      columns[2].title,
      'Rating',
    ]);
    expect(
      toColumnManagerModalProps(result.current).appliedColumns.map(
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
