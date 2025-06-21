import { act, renderHook } from '@testing-library/react';

import items from '~/support/factories/items';
import columns from '~/support/factories/columns';

import useExport from './useExport';

describe('useExport', () => {
  const exampleItems = items(25);
  const exporter = jest.fn(() => Promise.resolve(exampleItems));
  const defaultOptions = {
    exporter,
    columns,
  };

  it('returns an export config toolbar config', () => {
    const { result } = renderHook(() => useExport(defaultOptions));
    expect(result.current.toolbarProps.exportConfig).toBeDefined();
    expect(result.current).toEqual({
      toolbarProps: {
        exportConfig: {
          isDisabled: false,
          onSelect: expect.any(Function),
        },
      },
    });
  });

  it('returns an export config toolbar config with disabled true', () => {
    const { result } = renderHook(() =>
      useExport({
        ...defaultOptions,
        isDisabled: true,
      }),
    );
    expect(result.current.toolbarProps.exportConfig.isDisabled).toBe(true);
  });

  it('calls the exporter via onSelect', () => {
    const { result } = renderHook(() => useExport(defaultOptions));

    act(() => {
      result.current.toolbarProps.exportConfig.onSelect(null, 'csv');
    });

    expect(exporter).toHaveBeenCalled();

    act(() => {
      result.current.toolbarProps.exportConfig.onSelect(null, 'json');
    });

    expect(exporter).toHaveBeenCalled();
  });
});
