import React, { useEffect } from 'react';
import { Table, Th } from '@patternfly/react-table';
import { SkeletonTable } from '@patternfly/react-component-groups';

import TableHead from './components/TableHead';
import TableBody from './components/TableBody';
import useTableToolsForComposable from './hooks/useTableToolsForComposable';

const ComposableTable = (props) => {
  const composableTableProps = useTableToolsForComposable(props);
  const {
    columns,
    rows,
    view,
    loading,
    tableTree,
    pagination,
    bulkSelect,
    expandable,
    total,
  } = composableTableProps;

  useEffect(() => {
    console.group('ComposableTable props');
    console.warn(
      'Note: The "composable" variant is considered experimental and not fully featured yet.',
    );

    console.log('props', props);
    console.log('composableTableProps', composableTableProps);

    console.groupEnd();
  }, [composableTableProps, props]);

  return (view === 'rows' || (view === 'tree' && !tableTree)) && loading ? (
    <SkeletonTable
      rowsCount={pagination?.perPage || 10}
      columns={columns.map(({ title, sortable }) => (
        <Th
          key={title}
          {...(sortable
            ? { sort: { columnIndex: 0, sortBy: { property: sortable } } }
            : {})}
        >
          {title}
        </Th>
      ))}
    />
  ) : (
    <Table>
      <TableHead
        columns={columns}
        hasBulkSelect={!!bulkSelect}
        isExpandable={!!expandable}
      />
      <TableBody
        columns={columns}
        rows={rows}
        total={total}
        bulkSelect={bulkSelect}
        expandable={expandable}
      />
    </Table>
  );
};

export default ComposableTable;
