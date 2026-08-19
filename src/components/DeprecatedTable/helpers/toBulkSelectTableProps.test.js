import { toBulkSelectTableProps } from './toBulkSelectTableProps';

describe('toBulkSelectTableProps', () => {
  it('returns nothing when bulk select is disabled', () => {
    expect(
      toBulkSelectTableProps({
        enableBulkSelect: false,
        selectOne: jest.fn(),
      }),
    ).toEqual({});
  });

  it('maps bulk select props to deprecated table props', () => {
    const selectOne = jest.fn();

    expect(
      toBulkSelectTableProps({
        enableBulkSelect: true,
        total: 5,
        selectOne,
      }),
    ).toEqual({
      onSelect: selectOne,
      canSelectAll: false,
    });
  });

  it('omits onSelect when total is zero', () => {
    expect(
      toBulkSelectTableProps({
        enableBulkSelect: true,
        total: 0,
        selectOne: jest.fn(),
      }),
    ).toEqual({
      onSelect: undefined,
      canSelectAll: false,
    });
  });
});
