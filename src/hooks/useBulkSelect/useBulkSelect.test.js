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

  it('returns a bulk select configuration', () => {
    const { result } = renderHook(
      () => useBulkSelect(defaultOptions),
      DEFAULT_RENDER_OPTIONS,
    );

    expect(result).toMatchSnapshot();
  });

  it('returns a bulk select configuration without select all', () => {
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

    expect(result.current.toolbarProps.bulkSelect.items).toMatchSnapshot();
  });

  it('returns a bulk select configuration with select all', () => {
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

    expect(result.current.toolbarProps.bulkSelect.items).toMatchSnapshot();
  });

  it('returns a bulk select configuration with 1 selected item', () => {
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

    expect(result.current.toolbarProps.bulkSelect.count).toEqual(1);
  });
});
