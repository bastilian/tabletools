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
  });

  it('applies columns', () => {
    const { result } = renderHook(() => useColumnManager(...defaultArguments));
    const columnsToSelect = result.current.columns.filter(
      ({ key }) => key === 'desc',
    );

    // Unmanageable columns are always visible in the table
    const unManageableColumns = columns
      .filter((col) => !col.manageable)
      .map((col) => col.id);

    act(() => {
      result.current.columnManagerModalProps.applyColumns(columnsToSelect);
    });

    const appliedIds = columnsToSelect.map((col) => col.id);
    const resultIds = result.current.columns.map((col) => col.id);

    expect(resultIds).toEqual([...appliedIds, ...unManageableColumns]);
  });
});
