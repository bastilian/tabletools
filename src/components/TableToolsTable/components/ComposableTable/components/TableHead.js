import React from 'react';
import propTypes from 'prop-types';
import { Thead, Tr, Th } from '@patternfly/react-table';

const TableHead = ({ columns, hasBulkSelect, isExpandable }) => (
  <Thead>
    <Tr>
      {hasBulkSelect && <Th />}
      {isExpandable && <Th />}
      {columns.map(({ title, sortable }, idx) => (
        <Th
          key={title}
          {...(sortable
            ? {
                sort: {
                  columnIndex: idx,
                  sortBy: { property: sortable },
                  onSort: (_event, index, direction, ...args) => {
                    console.log(_event, index, direction, ...args);
                  },
                },
              }
            : {})}
        >
          {title}
        </Th>
      ))}
    </Tr>
  </Thead>
);

TableHead.propTypes = {
  columns: propTypes.object,
  hasBulkSelect: propTypes.bool,
};

export default TableHead;
