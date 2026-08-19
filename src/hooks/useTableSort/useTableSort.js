import { useCallback, useMemo } from 'react';
import { useDeepCompareMemo } from 'use-deep-compare';

import useTableState, { useRawTableState } from '~/hooks/useTableState';

import { addSortableTransform, columnOffset } from './helpers';
import { TABLE_STATE_NAMESPACE } from './constants';

/**
 *  @typedef {object} useTableSortReturn
 *
 *  @property {object}   sortBy          Current sort state with column offset applied
 *  @property {Function} onSort          Sort change handler
 *  @property {Array}    sortableColumns Columns with sortable transforms applied
 */

/**
 * Provides sort props for table tools.
 *
 *  @param   {Array}              columns                    Columns for a table, with a "sortable" prop
 *  @param   {object}             [options]                  AsyncTableTools options
 *  @param   {object}             [options.sortBy]           An initial sortBy state like `{index: 1, direction: 'desc'}`
 *  @param   {object}             [options.onSort]           A function to call after setting a new sort state.
 *  @param   {object}             [options.serialisers.sort] A function to provide a serialiser for the table state
 *
 *  @returns {useTableSortReturn}                            Sort props for variant adapters
 *
 *  @example
 *
 * const columns = [{ title: 'Name', sortable: true }]
 * const tableSort = useTableSort(columns)
 *
 *  @group Hooks
 *
 */
const useTableSort = (columns, options = {}) => {
  const {
    sortBy: initialSortBy,
    serialisers: { sort: serialiser } = {},
    onSort: onSortOption,
  } = options;

  const { tableView } = useRawTableState() || {};
  const offset = columnOffset({ ...options, tableView });

  const stateOptions = useDeepCompareMemo(
    () => ({
      ...(serialiser
        ? {
            serialiser: (state) => serialiser(state, columns),
          }
        : {}),
    }),
    [serialiser, columns],
  );
  const [sortBy, setSortBy] = useTableState(
    TABLE_STATE_NAMESPACE,
    initialSortBy || {
      index: 0,
      direction: 'asc',
    },
    stateOptions,
  );

  const onSort = useCallback(
    (_, index, direction) => {
      setSortBy({
        index: index - offset,
        direction,
      });
      onSortOption?.(index, direction);
    },
    [onSortOption, setSortBy, offset],
  );

  const sortByOffset = useMemo(
    () =>
      sortBy && {
        ...sortBy,
        index: sortBy?.index + offset,
      },
    [sortBy, offset],
  );

  const sortableColumns = useMemo(
    () => addSortableTransform(columns),
    [columns],
  );

  return useMemo(
    () => ({
      sortBy: sortByOffset,
      onSort,
      sortableColumns,
    }),
    [sortByOffset, onSort, sortableColumns],
  );
};

export default useTableSort;
