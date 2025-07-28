import React from 'react';
import propTypes from 'prop-types';
import { Tbody, Td, Tr } from '@patternfly/react-table';

import NoResultsTable from '~/components/NoResultsTable';

import Cell from './Cell';

const TableBody = ({ total, columns, rows, bulkSelect, expandable }) => (
  <Tbody>
    {total === 0 ? (
      <Tr>
        <Td colSpan={columns?.length + (bulkSelect ? 1 : 0)}>
          <NoResultsTable />
        </Td>
      </Tr>
    ) : (
      rows?.map((row, idx) => (
        <Tr key={row?.item?.id || idx}>
          {!!expandable && (
            <Td
              {...(expandable
                ? {
                    expand: {
                      rowIndex: idx,
                      isExpanded: expandable.isExpanded(row?.item?.itemId),
                      onToggle: () => expandable.onToggle(row?.item?.itemId),
                    },
                  }
                : {})}
            />
          )}
          {!!bulkSelect && (
            <Td
              {...(bulkSelect
                ? {
                    select: {
                      rowIndex: idx,
                      onSelect: () => bulkSelect.selectOne(row?.item),
                      isSelected: bulkSelect.isItemSelected(row?.item?.itemId),
                    },
                  }
                : {})}
            />
          )}

          {columns.map((column) => (
            <Cell key={column.title + `-${idx}`} row={row} column={column} />
          ))}
        </Tr>
      ))
    )}
  </Tbody>
);

TableBody.propTypes = {
  rows: propTypes.array,
  columns: propTypes.array,
};

export default TableBody;
