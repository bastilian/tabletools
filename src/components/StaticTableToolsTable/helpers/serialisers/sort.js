const sortSerialiser = ({ index, direction } = {}, columns) =>
  columns[index]?.sortable && `${columns[index].sortable}:${direction}`;

export default sortSerialiser;
