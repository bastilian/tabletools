const textFilterSerialiser = (filterConfigItem, value) =>
  `regex(.${filterConfigItem.filterAttribute}, "${value}", "i")`;

const checkboxFilterSerialiser = (filterConfigItem, values) =>
  `.${filterConfigItem.filterAttribute} in [${values
    .map((value) => `"${value}"`)
    .join(',')}]`;

const raidoFilterSerialiser = (filterConfigItem, values) =>
  `.${filterConfigItem.filterAttribute} == "${values[0]}"`;

const numberFilterSerialiser = (filterConfigItem, value) =>
  `.${filterConfigItem.filterAttribute} == ${value}`;

const filterSerialisers = {
  text: textFilterSerialiser,
  checkbox: checkboxFilterSerialiser,
  radio: raidoFilterSerialiser,
  singleSelect: raidoFilterSerialiser,
  number: numberFilterSerialiser,
};

const findFilterSerialiser = (filterConfigItem) => {
  if (filterConfigItem.filterSerialiser) {
    return filterConfigItem.filterSerialiser;
  } else {
    return (
      filterConfigItem.filterAttribute &&
      filterSerialisers[filterConfigItem?.type]
    );
  }
};

export const filtersSerialiser = (state, filters) => {
  const queryParts = Object.entries(state || {}).reduce(
    (filterQueryParts, [filterId, value]) => {
      const filterConfigItem = filters.find((filter) => filter.id === filterId);
      const filterSerialiser = findFilterSerialiser(filterConfigItem);

      return [
        ...filterQueryParts,
        ...(filterSerialiser
          ? [filterSerialiser(filterConfigItem, value)]
          : []),
      ];
    },
    []
  );

  return queryParts.length > 0
    ? queryParts.map((part) => `(${part})`).join(' and ')
    : undefined;
};

export default filtersSerialiser;
