export const getColumnsForModal = (columns = [], selectedColumns) =>
  columns
    .map(({ title, manageable, isShown: isShownProp }) => {
      const isShown = selectedColumns?.includes(title) || isShownProp;
      const isUntoggleable =
        typeof manageable !== 'undefined' ? !manageable : false;

      return {
        title,
        key: title,
        isUntoggleable,
        isShownByDefault: isShown,
        isShown,
      };
    })
    .filter(({ isUntoggleable }) => !isUntoggleable)
    .map((column, idx) => ({
      ...column,
      // TODO this is a workaround to prevent users from deselecting all columns and see an empty table
      // However, this should actually be handled directly within the Column management modal in the pf component groups component
      isUntoggleable: idx === 0,
    }));
