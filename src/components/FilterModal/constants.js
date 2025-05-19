const FilterOptionText = ({ title, label, name }) => title || label || name;

const filterOption = {
  title: '',
  Component: FilterOptionText,
};

export const DEFAULT_FILTER_MODAL_TABLE_COLUMNS = [filterOption];
