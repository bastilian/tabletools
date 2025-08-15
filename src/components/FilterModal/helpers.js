const convertGroupsToArray = (groupFilterItems) =>
  (groupFilterItems || []).reduce(
    (items, group) => [
      ...items,
      ...group.items.map((item) => ({
        ...item,
        group: group.label,
        itemId: `${group.value}-${item.value}`,
      })),
    ],
    [],
  );

// TODO Replace with "proper" jsonQuery based static "fetch"
export const fetchStatic = (
  filterItems,
  filterType,
  _serialisedState,
  { pagination: { state: { page = 1, perPage = 10 } = {} } = {} } = {},
) => {
  const items =
    filterType === 'group'
      ? convertGroupsToArray(filterItems)
      : filterItems.map((item) => ({ ...item, itemId: item.value }));
  const offset = (page - 1) * perPage;
  const limit = perPage;

  return [
    items.length > limit ? items.slice(offset, offset + limit) : items,
    items.length,
  ];
};

export const convertToFilterValues = (selectedValues, filter) => {
  if (filter.type === 'group') {
    return selectedValues.reduce((filterValues, selectedValue) => {
      const [group, groupItem] = selectedValue.split('-');

      return {
        ...filterValues,
        [group]: {
          ...filterValues[group],
          [groupItem]: true,
        },
      };
    }, {});
  } else {
    return selectedValues;
  }
};

export const convertToSelectValues = (filterValues, filter) => {
  if (filter.type === 'group') {
    return Object.entries(filterValues || {}).reduce(
      (selection, [group, groupSelection]) => [
        ...selection,
        ...Object.keys(groupSelection).map(
          (groupItem) => `${group}-${groupItem}`,
        ),
      ],
      [],
    );
  } else {
    return filterValues;
  }
};

export const labelToid = (item) => ({
  ...item,
  id: item.label,
});
