const isManageable = ({ manageable }) => manageable !== false;

export const getColumnKey = (column, index) => {
  if (typeof column.title === 'string') {
    return column.title;
  }

  return `column-${index}`;
};

const toModalColumn = (column, index, isShown) => {
  const isUntoggleable =
    typeof column.manageable !== 'undefined' ? !column.manageable : false;

  return {
    title: column.title,
    key: getColumnKey(column, index),
    isUntoggleable,
    isShownByDefault: isShown,
    isShown,
  };
};

/**
 * Build columns including visibility and order based on columnState if provided.
 * When `enableDragDrop` is true, unmanageable columns are included (with
 * disabled checkboxes) so we can reorder them.
 *
 *  @param   {Array}   columns                  Table column definitions
 *  @param   {Array}   [columnState]            Previously applied modal columns `{ key, isShown }[]`
 *  @param   {object}  [options]                Modal column options
 *  @param   {boolean} [options.enableDragDrop] Include unmanageable columns for reordering
 *  @returns {Array}                            Columns shaped for ColumnManagementModal
 */
export const getColumnsForModal = (
  columns = [],
  columnState,
  { enableDragDrop = false } = {},
) => {
  const columnsForModal = columns
    .map((column, index) => ({ column, index }))
    .filter(({ column }) => enableDragDrop || isManageable(column));

  let modalColumns;

  if (columnState?.length) {
    const columnsByKey = new Map(
      columnsForModal.map(({ column, index }) => [
        getColumnKey(column, index),
        { column, index },
      ]),
    );
    const usedKeys = new Set();

    modalColumns = [];

    columnState.forEach(({ key, isShown }) => {
      const entry = columnsByKey.get(key);

      if (entry) {
        modalColumns.push(toModalColumn(entry.column, entry.index, isShown));
        usedKeys.add(key);
      }
    });

    columnsForModal.forEach(({ column, index }) => {
      const key = getColumnKey(column, index);

      if (!usedKeys.has(key)) {
        modalColumns.push(toModalColumn(column, index, column.isShown ?? true));
      }
    });
  } else {
    modalColumns = columnsForModal.map(({ column, index }) =>
      toModalColumn(column, index, column.isShown ?? true),
    );
  }

  return modalColumns.map((column, idx) => ({
    ...column,
    // TODO this is a workaround to prevent users from deselecting all columns and see an empty table
    // However, this should actually be handled directly within the Column management modal in the pf component groups component
    isUntoggleable: idx === 0 ? true : column.isUntoggleable,
  }));
};

/**
 * Resolves table columns to show from applied modal state, preserving order.
 *
 *  @param   {Array} columns     Table column definitions
 *  @param   {Array} columnState Applied modal columns `{ key, isShown }[]`
 *  @returns {Array}             Ordered columns currently visible in the table
 */
export const getColumnsToShow = (columns = [], columnState = []) => {
  const columnsByKey = new Map(
    columns.map((column, index) => [getColumnKey(column, index), column]),
  );

  const shownColumns = columnState
    .filter(({ isShown }) => isShown)
    .map(({ key }) => columnsByKey.get(key))
    .filter(Boolean);

  const shownKeys = new Set(
    columnState.filter(({ isShown }) => isShown).map(({ key }) => key),
  );
  const alwaysVisibleColumns = columns.filter(
    (column, index) =>
      !isManageable(column) && !shownKeys.has(getColumnKey(column, index)),
  );

  return [...shownColumns, ...alwaysVisibleColumns];
};
