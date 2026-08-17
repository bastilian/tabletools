/**
 * Maps pagination building blocks to PatternFly Pagination props.
 *
 *  @param   {object}           [params]            Pagination inputs from usePagination
 *  @param   {number}           [params.page]       Current page
 *  @param   {number}           [params.perPage]    Items per page
 *  @param   {number}           [params.itemCount]  Total number of items
 *  @param   {Function}         [params.setPage]    Sets the current page
 *  @param   {Function}         [params.setPerPage] Sets items per page
 *  @returns {object|undefined}                     Pagination props, or `undefined`
 */
export const toDataViewPaginationConfig = ({
  page,
  perPage,
  itemCount,
  setPage,
  setPerPage,
} = {}) =>
  setPage && setPerPage
    ? {
        page,
        perPage,
        itemCount,
        onSetPage: (_, nextPage) => setPage(nextPage),
        onPerPageSelect: (_, nextPerPage) => setPerPage(nextPerPage),
      }
    : undefined;
