export const getColumnsForModal = (columns = [], selectedColumns) =>
  columns.map(({ title, manageable, isShown: isShownProp }) => {
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
  });
