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

  it('returns export props when exporter is set', () => {
    const { result } = renderHook(() => useExport(defaultOptions));
    expect(result.current).toEqual({
      isDisabled: false,
      exportWithFormat: expect.any(Function),
    });
  });

  it('returns isDisabled true when configured', () => {
    const { result } = renderHook(() =>
      useExport({
        ...defaultOptions,
        isDisabled: true,
      }),
    );
    expect(result.current.isDisabled).toBe(true);
  });

  it('calls the exporter via exportWithFormat', () => {
    const { result } = renderHook(() => useExport(defaultOptions));

    act(() => {
      result.current.exportWithFormat('csv');
    });

    expect(exporter).toHaveBeenCalled();

    act(() => {
      result.current.exportWithFormat('json');
    });

    expect(exporter).toHaveBeenCalled();
  });

  it('returns an empty object when exporter is not set', () => {
    const { result } = renderHook(() => useExport({ columns }));
    expect(result.current).toEqual({});
  });
});
