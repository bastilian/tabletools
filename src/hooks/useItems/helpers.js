export const itemObserver = (
  _currentState,
  _observedPreviousState,
  observedNextItems
) =>
  typeof observedNextItems?.items?.length !== 'undefined' ||
  typeof observedNextItems?.error !== 'undefined';

export const identifyItems = (items) =>
  items?.map((item) => ({ ...item, itemId: item.itemId || item.id }));
