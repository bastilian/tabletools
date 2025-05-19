const FilterOptionText = ({ title, label, name }) => title || label || name;
const FilterGroupText = ({ group }) => group;

export const filterOption = {
  title: '',
  Component: FilterOptionText,
};

export const filterGroup = {
  title: 'Group',
  Component: FilterGroupText,
};
