import { toSortTableProps } from './toSortTableProps';

describe('toSortTableProps', () => {
  it('returns nothing if onSort is missing', () => {
    expect(toSortTableProps({})).toEqual({});
  });

  it('maps sort props to deprecated table props', () => {
    const onSort = jest.fn();
    const sortBy = { index: 1, direction: 'desc' };
    const sortableColumns = [{ title: 'Name' }];

    expect(
      toSortTableProps({
        sortBy,
        onSort,
        sortableColumns,
      }),
    ).toEqual({
      onSort,
      sortBy,
      cells: sortableColumns,
    });
  });
});
