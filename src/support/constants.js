import React from 'react';
import { Button } from '@patternfly/react-core';

export const actions = [
  {
    label: 'Example action #1',
    onClick: () => alert('Clicked first action'),
  },
  {
    label: (
      <Button
        variant="link"
        ouiaId="Primary"
        onClick={() => alert('Clicked second action')}
      >
        Second Action
      </Button>
    ),
  },
];

export const rowActionResolver = (rowData) => {
  const thirdAction = [
    {
      isSeparator: true,
    },
    {
      title: `${rowData.type} action`,
      onClick: (_event, rowId, rowData, extra) =>
        console.log(
          `clicked on ${rowData.type} action, on row ${rowId} of type ${rowData.type}`,
          extra,
        ),
    },
  ];

  return [
    {
      title: 'actionResolver action',
      onClick: (_event, rowId, rowData, extra) =>
        console.log(
          `clicked on Some action, on row ${rowId} of type ${rowData.type}`,
          extra,
        ),
    },
    {
      title: <div>Another action</div>,
      onClick: (_event, rowId, rowData, extra) =>
        console.log(
          `clicked on Another action, on row ${rowId} of type ${rowData.type}`,
          extra,
        ),
    },
    ...(rowData.type ? thirdAction : []),
  ];
};
