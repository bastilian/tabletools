import React from 'react';

const detailsRowColSpan = (options = {}) => {
  const baseColumns = options.columns?.length || 0;

  const hasExpandableControlColumn =
    !!options.detailsComponent || !!options.treeTable;
  const hasSelectableControlColumn =
    !!options.onRadioSelect || !!options.onSelect;

  return (
    baseColumns +
    (hasExpandableControlColumn ? 1 : 0) +
    (hasSelectableControlColumn ? 1 : 0)
  );
};

const detailsRowForRule = (
  item,
  DetailsComponent,
  colSpan,
  runningIndex,
  detailsProps = {},
) => ({
  parent: runningIndex() - 1,
  ...detailsProps,
  props: {
    ...item.props,
    'aria-setsize': 0,
  },
  cells: [
    {
      title: <DetailsComponent item={item} key={'item-' + item.rowId} />,
      props: {
        ...(colSpan ? { colSpan } : {}),
        // TODO This removes the checkbox, however this should maybe be fixed differently
        className: 'compliance-rule-details',
      },
    },
  ],
});

export const itemDetailsRow = (item, options, runningIndex) =>
  typeof options?.detailsComponent !== 'undefined' &&
  detailsRowForRule(
    item,
    options.detailsComponent,
    detailsRowColSpan(options),
    runningIndex,
    options?.detailsProps || {},
  );

const expandTreeTableRow = (firstRow, isOpen) => ({
  ...firstRow,
  props: {
    ...(firstRow.props || {}),
    isExpanded: isOpen,
  },
});

const expandTableRow = (firstRow, isOpen) => ({
  ...firstRow,
  isOpen,
});

export const addExpandProp = (firstRow, isTreeTable, isOpen) =>
  isTreeTable
    ? expandTreeTableRow(firstRow, isOpen)
    : expandTableRow(firstRow, isOpen);
