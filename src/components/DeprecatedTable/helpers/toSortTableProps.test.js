import { toSortTableProps } from './toSortTableProps';

describe('toSortTableProps', () => {
  it('returns nothing if onSort is missing', () => {
    expect(toSortTableProps({})).toEqual({});
  });

  it('maps sort props to deprecated table props without offset', () => {
    const onSort = jest.fn();
    const sortBy = { index: 1, direction: 'desc' };
    const sortableColumns = [{ title: 'Name' }];

    const result = toSortTableProps({
      sortBy,
      onSort,
      sortableColumns,
    });

    expect(result.sortBy).toEqual(sortBy);
    expect(result.cells).toEqual(sortableColumns);

    result.onSort(null, 1, 'desc');
    expect(onSort).toHaveBeenCalledWith(null, 1, 'desc', undefined);
  });

  it('applies offset to sortBy and subtracts offset on onSort callback using numeric offset', () => {
    const onSort = jest.fn();
    const sortBy = { index: 1, direction: 'desc' };
    const sortableColumns = [{ title: 'Name' }, { title: 'Artist' }];

    const result = toSortTableProps(
      {
        sortBy,
        onSort,
        sortableColumns,
      },
      2,
    );

    // Initial sortBy index should be shifted by offset (+2)
    expect(result.sortBy).toEqual({
      index: 3,
      direction: 'desc',
    });

    // When PatternFly triggers onSort with visual column index (e.g. 3),
    // handler should subtract offset and pass data index (1) to the underlying onSort
    result.onSort(null, 3, 'asc');
    expect(onSort).toHaveBeenCalledWith(null, 1, 'asc', undefined);
  });

  it('calculates offset correctly with options object (hasSelect and hasExpand)', () => {
    const onSort = jest.fn();
    const sortBy = { index: 1, direction: 'desc' };
    const sortableColumns = [{ title: 'Name' }, { title: 'Artist' }];

    const result = toSortTableProps(
      {
        sortBy,
        onSort,
        sortableColumns,
      },
      {
        hasSelect: true,
        hasExpand: true,
      },
    );

    expect(result.sortBy).toEqual({
      index: 3,
      direction: 'desc',
    });

    result.onSort(null, 3, 'asc');
    expect(onSort).toHaveBeenCalledWith(null, 1, 'asc', undefined);
  });

  it('handles tree tables adjustment in options object', () => {
    const onSort = jest.fn();
    const sortBy = { index: 1, direction: 'desc' };
    const sortableColumns = [{ title: 'Name' }, { title: 'Artist' }];

    const result = toSortTableProps(
      {
        sortBy,
        onSort,
        sortableColumns,
      },
      {
        hasSelect: true,
        hasExpand: true,
        isTree: true,
      },
    );

    expect(result.sortBy).toEqual({
      index: 2,
      direction: 'desc',
    });
  });
});
