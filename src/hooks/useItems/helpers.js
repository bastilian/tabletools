export const identifyItems = (items) =>
  items?.map((item) => ({ ...item, itemId: item.itemId || item.id }));
