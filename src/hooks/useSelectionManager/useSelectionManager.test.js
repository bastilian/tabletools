import { act, renderHook } from '@testing-library/react';

import useSelectionManager from './useSelectionManager';

describe('useSelectionManager', () => {
  it('returns an object with functions to manage selections', () => {
    const { result } = renderHook(() => useSelectionManager());
    expect(result.current.clear).toBeDefined();
    expect(result.current.set).toBeDefined();
    expect(result.current.reset).toBeDefined();
    expect(result.current.select).toBeDefined();
    expect(result.current.deselect).toBeDefined();
  });

  describe('withGroups: false', () => {
    const selection = [1, 2, 3, 4];
    const defaultArguments = [selection];

    it('returns an object with function to manage selections wihtout groups', () => {
      const { result } = renderHook(() =>
        useSelectionManager(...defaultArguments),
      );
      expect(result.current.selection).toEqual(defaultArguments[0]);
    });

    it('adds an item from the selection when calling select', () => {
      const { result } = renderHook(() =>
        useSelectionManager(...defaultArguments),
      );

      act(() => {
        result.current.select(42);
      });

      expect(result.current.selection).toEqual([42, ...defaultArguments[0]]);
    });

    it('removes an item from the selection when calling deselect', () => {
      const { result } = renderHook(() =>
        useSelectionManager(...defaultArguments),
      );

      act(() => {
        result.current.deselect(3);
      });

      expect(result.current.selection).toEqual(
        defaultArguments[0].filter((v) => v !== 3),
      );
    });

    it('sets items for a selection when calling set', () => {
      const newSelection = [0, 9, 8, 45, 3];
      const { result } = renderHook(() =>
        useSelectionManager(...defaultArguments),
      );

      act(() => {
        result.current.set(newSelection);
      });

      expect(result.current.selection).toEqual(newSelection);
    });

    it('resets selection to preselection', () => {
      const newSelection = [0, 9, 8, 45, 3];
      const { result } = renderHook(() =>
        useSelectionManager(...defaultArguments),
      );

      act(() => {
        result.current.set(newSelection);
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.selection).toEqual(defaultArguments[0]);
    });
  });

  describe('withGroups true', () => {
    const initialSelection = { group1: [1, 2, 3, 4], group2: [12, 23, 34, 45] };
    const defaultArguments = [initialSelection, { withGroups: true }];

    it('returns an object with function to manage selections with groups', () => {
      const { result } = renderHook(() =>
        useSelectionManager(...defaultArguments),
      );
      expect(result.current.clear).toBeDefined();
      expect(result.current.set).toBeDefined();
      expect(result.current.reset).toBeDefined();
      expect(result.current.select).toBeDefined();
      expect(result.current.deselect).toBeDefined();
    });

    it('adds an item from the selection when calling select', () => {
      const { result } = renderHook(() =>
        useSelectionManager(...defaultArguments),
      );

      act(() => {
        result.current.select(42, 'group2');
      });

      expect(result.current.selection).toEqual({
        ...initialSelection,
        group2: [42, ...initialSelection.group2],
      });
    });

    it('removes an item from the selection when calling deselect', () => {
      const { result } = renderHook(() =>
        useSelectionManager(...defaultArguments),
      );

      act(() => {
        result.current.deselect(2, 'group1');
      });

      expect(result.current.selection).toEqual({
        ...initialSelection,
        group1: [1, 3, 4],
      });
    });

    it('sets items for a selection when calling set', () => {
      const { result } = renderHook(() =>
        useSelectionManager(...defaultArguments),
      );
      const newSelection = [0, 9, 8, 45, 3];

      act(() => {
        result.current.set(newSelection, 'group1');
      });

      expect(result.current.selection).toEqual({
        ...initialSelection,
        group1: newSelection,
      });
    });

    it('resets selection to initially passed in selected on reset', () => {
      const { result } = renderHook(() =>
        useSelectionManager(...defaultArguments),
      );
      const newSelection = [1, 2, 3];

      act(() => {
        result.current.set(newSelection, 'group1');
      });

      expect(result.current.selection).toEqual({
        ...initialSelection,
        group1: newSelection,
      });

      act(() => {
        result.current.reset('group1');
      });

      expect(result.current.selection).toEqual(initialSelection);
    });

    it('resets selection of all groups if no specific group is set', () => {
      const { result } = renderHook(() =>
        useSelectionManager(...defaultArguments),
      );
      const newSelection = [1, 2, 3];

      act(() => {
        result.current.set(newSelection, 'group1');
        result.current.set(newSelection, 'group2');
        result.current.set(newSelection, 'group3');
      });

      expect(result.current.selection).toEqual({
        group1: newSelection,
        group2: newSelection,
        group3: newSelection,
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.selection).toEqual(initialSelection);
    });
  });
});
