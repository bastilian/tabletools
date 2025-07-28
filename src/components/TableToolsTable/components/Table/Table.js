import React, { useEffect } from 'react';
import propTypes from 'prop-types';
import {
  Table as PatternflyTable,
  TableBody,
  TableHeader,
} from '@patternfly/react-table/deprecated';
import { SkeletonTable } from '@patternfly/react-component-groups';

import useTableToolsForTable from './hooks/useTableToolsForTable';

const Table = (props) => {
  const tableToolsProps = useTableToolsForTable(props);
  const { view, loading, toolbarProps, tableProps, tableTree } =
    tableToolsProps;

  useEffect(() => {
    console.group('Table props');

    console.log('props', props);
    console.log('tableToolsProps', tableToolsProps);

    console.groupEnd();
  }, [tableToolsProps, props]);

  // TODO This is a bit hackish. We should rather have an indicator if data necessary for the current view is loading.
  return (view === 'rows' || (view === 'tree' && !tableTree)) && loading ? (
    <SkeletonTable
      rowSize={toolbarProps?.pagination?.perPage || 10}
      columns={tableProps.cells.map(({ title }) => title)}
    />
  ) : (
    <PatternflyTable aria-label="Table" {...tableProps}>
      <TableHeader />
      <TableBody />
    </PatternflyTable>
  );
};

Table.propTypes = {
  view: propTypes.string,
  loading: propTypes.bool,
  hasTreeTable: propTypes.bool,
  toolbarProps: propTypes.object,
  tableProps: propTypes.object,
  tableTree: propTypes.object,
};

export default Table;
