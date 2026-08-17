/**
 * Maps pagination props to FEC PrimaryToolbar `pagination` props.
 *
 *  @param   {object}   [params]            Pagination inputs
 *  @param   {number}   [params.page]       Current page
 *  @param   {number}   [params.perPage]    Items per page
 *  @param   {number}   [params.itemCount]  Total number of items
 *  @param   {Function} [params.setPage]    Sets the current page
 *  @param   {Function} [params.setPerPage] Sets items per page
 *  @returns {object}                       `{ toolbarProps }` or `{}`
 */
export const toPaginationConfig = ({
  page,
  perPage,
  itemCount,
  setPage,
  setPerPage,
} = {}) =>
  setPage && setPerPage
    ? {
        toolbarProps: {
          pagination: {
            page,
            perPage,
            itemCount,
            onSetPage: (_, nextPage) => setPage(nextPage),
            onPerPageSelect: (_, nextPerPage) => setPerPage(nextPerPage),
          },
        },
      }
    : {};
