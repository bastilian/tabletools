import { useCallback, useMemo } from 'react';

import usePaginationState from './hooks/usePaginationState';

/**
 *  @typedef {object} usePaginationReturn
 *
 *  @property {number}   page       Current page
 *  @property {number}   perPage    Items per page
 *  @property {number}   itemCount  Total number of items
 *  @property {Function} setPage    Sets the current page
 *  @property {Function} setPerPage Sets items per page and resets to page 1
 */

/**
 * Provides pagination props for table tools.
 *
 *  @param   {object}              [options]                        AsyncTableTools options
 *  @param   {number}              options.total                    The total number of items (required).
 *  @param   {number}              [options.perPage]                A number that will dictate the amount of items shown per page.
 *  @param   {Function}            [options.serialisers.pagination] A function to provide a serialiser for the table state
 *
 *  @returns {usePaginationReturn}                                  Pagination props, or `{}` when disabled
 *
 *  @group Hooks
 *
 */
const usePagination = (options = {}) => {
  const { total, pagination = true } = options;
  const [paginationState, setPaginationState] = usePaginationState(options);

  const setPagination = useCallback(
    (newState) =>
      setPaginationState((paginationState) => ({
        ...paginationState,
        state: {
          ...paginationState.state,
          ...newState,
        },
      })),
    [setPaginationState],
  );

  const setPage = useCallback(
    (page) => {
      setPaginationState((paginationState) => {
        const nextPage = page < 0 ? paginationState.page + page : page;
        return {
          ...(paginationState || {}),
          state: {
            ...(paginationState?.state || {}),
            page: nextPage > 0 ? nextPage : 1,
          },
        };
      });
    },
    [setPaginationState],
  );

  const setPerPage = useCallback(
    (perPage) => setPagination({ page: 1, perPage }),
    [setPagination],
  );

  return useMemo(
    () =>
      pagination && !(paginationState || {}).isDisabled
        ? {
            page: paginationState?.state?.page,
            perPage: paginationState?.state?.perPage,
            itemCount: total,
            setPage,
            setPerPage,
          }
        : {},
    [pagination, paginationState, total, setPage, setPerPage],
  );
};

export default usePagination;
