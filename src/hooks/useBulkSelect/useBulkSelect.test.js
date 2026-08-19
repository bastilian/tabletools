import { renderHook } from '@testing-library/react';
import { DEFAULT_RENDER_OPTIONS } from '~/support/testHelpers';

import useBulkSelect from './useBulkSelect';

jest.mock('../useTableState/hooks/useStateCallbacks', () => ({
  __esModule: true,
  default: () => ({
    current: { resetSelection: () => {} },
  }),
}));

describe('useBulkSelect', () => {
  const defaultOptions = {
    total: 0,
    onSelect: () => ({}),
    itemIdsInTable: () => [],
    itemIdsOnPage: [],
  };

  it('returns bulk select building blocks', () => {
    const { result } = renderHook(
      () => useBulkSelect(defaultOptions),
      DEFAULT_RENDER_OPTIONS,
    );

    expect(result.current).toEqual(
      expect.objectContaining({
        enableBulkSelect: true,
        selectedIds: [],
        selectedIdsTotal: 0,
        isDisabled: true,
        checked: false,
        total: 0,
        isItemSelected: expect.any(Function),
        select: expect.any(Function),
        deselect: expect.any(Function),
        markRowSelected: expect.any(Function),
        selectOne: expect.any(Function),
        bulkSelectItems: expect.any(Array),
        onToolbarSelect: expect.any(Function),
      }),
    );
  });

  it('returns bulk select items without select all', () => {
    const { result } = renderHook(
      () =>
        useBulkSelect({
          ...defaultOptions,
          total: 2,
          selected: ['ID'],
          itemIdsInTable: () => {
            return ['ID', 'ID1'];
          },
          itemIdsOnPage: ['ID', 'ID1'],
        }),
      DEFAULT_RENDER_OPTIONS,
    );

    expect(result.current.bulkSelectItems).toMatchSnapshot();
    expect(result.current.selectedIdsTotal).toEqual(1);
  });

  it('returns bulk select items with select all', () => {
    const { result } = renderHook(
      () =>
        useBulkSelect({
          ...defaultOptions,
          total: 2,
          selected: ['ID'],
          fetchAll: Promise.resolve(['2417de', '51b20a']),
          itemIdsOnPage: ['ID', 'ID1'],
        }),
      DEFAULT_RENDER_OPTIONS,
    );

    expect(result.current.bulkSelectItems).toMatchSnapshot();
  });

  it('tracks selected item count', () => {
    const { result } = renderHook(
      () =>
        useBulkSelect({
          ...defaultOptions,
          total: 2,
          selected: ['ID'],
          itemIdsInTable: () => ['ID', 'ID2'],
          itemIdsOnPage: ['ID'],
        }),
      DEFAULT_RENDER_OPTIONS,
    );

    expect(result.current.selectedIdsTotal).toEqual(1);
  });

  it('disables bulk select when onSelect is not provided', () => {
    const { result } = renderHook(
      () =>
        useBulkSelect({
          total: 2,
          itemIdsOnPage: ['ID'],
        }),
      DEFAULT_RENDER_OPTIONS,
    );

    expect(result.current.enableBulkSelect).toBe(false);
  });
});
