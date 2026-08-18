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

const detailsRowForRule = ({
  runningIndex,
  item,
  detailsProps = {},
  DetailsComponent,
  detailsComponentProps = {},
  colSpan,
}) => ({
  parent: runningIndex() - 1,
  ...detailsProps,
  props: {
    ...item.props,
    'aria-setsize': 0,
  },
  cells: [
    {
      title: (
        <DetailsComponent
          {...detailsComponentProps}
          item={item}
          key={'item-' + item.rowId}
        />
      ),
      props: {
        ...(colSpan ? { colSpan } : {}),
        // TODO This removes the checkbox, however this should maybe be fixed differently
        className: 'compliance-rule-details',
      },
    },
  ],
});

export const itemDetailsRow = (item, options = {}, runningIndex) =>
  typeof options.detailsComponent !== 'undefined' &&
  detailsRowForRule({
    runningIndex,
    item,
    detailsProps: options.detailsProps,
    DetailsComponent: options.detailsComponent,
    detailsComponentProps: options.detailsComponentProps,
    colSpan: detailsRowColSpan(options),
  });

const expandTreeTableRow = (firstRow, isExpanded) => ({
  ...firstRow,
  props: {
    ...(firstRow.props || {}),
    isExpanded,
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
