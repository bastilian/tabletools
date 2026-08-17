import { toDataViewPaginationConfig } from './toDataViewPaginationConfig';

describe('toDataViewPaginationConfig', () => {
  it('returns nothing if pagination handlers are missing', () => {
    expect(toDataViewPaginationConfig({})).toBeUndefined();
  });

  it('maps pagination building blocks to PatternFly Pagination props', () => {
    const setPage = jest.fn();
    const setPerPage = jest.fn();

    expect(
      toDataViewPaginationConfig({
        page: 2,
        perPage: 25,
        itemCount: 300,
        setPage,
        setPerPage,
      }),
    ).toEqual({
      page: 2,
      perPage: 25,
      itemCount: 300,
      onSetPage: expect.any(Function),
      onPerPageSelect: expect.any(Function),
    });
  });
});
