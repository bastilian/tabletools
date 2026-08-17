import { toPaginationConfig } from './toPaginationConfig';

describe('toPaginationConfig', () => {
  it('returns nothing if pagination handlers are missing', () => {
    expect(toPaginationConfig({})).toEqual({});
  });

  it('maps pagination props to FEC pagination toolbar props', () => {
    const setPage = jest.fn();
    const setPerPage = jest.fn();

    expect(
      toPaginationConfig({
        page: 2,
        perPage: 25,
        itemCount: 300,
        setPage,
        setPerPage,
      }),
    ).toEqual({
      toolbarProps: {
        pagination: {
          page: 2,
          perPage: 25,
          itemCount: 300,
          onSetPage: expect.any(Function),
          onPerPageSelect: expect.any(Function),
        },
      },
    });
  });
});
