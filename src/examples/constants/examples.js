import SimpleTableToolsTable from '../components/SimpleTableToolsTable';
import SimpleTableToolsTableFiltered from '../components/SimpleTableToolsTableFiltered';
import SimpleTableToolsTableSorted from '../components/SimpleTableToolsTableSorted';
import CommonTableToolsTable from '../components/CommonTableToolsTable';
import TableToolsTableWithRowDetails from '../components/TableToolsTableWithRowDetails';
import TableToolsTableWithExport from '../components/TableToolsTableWithExport';
import TableToolsTableWithBulkSelect from '../components/TableToolsTableWithBulkSelect';
import TableToolsTableWithTreeTable from '../components/TableToolsTableWithTreeTable';

export const simple = {
  title: 'Simple',
  Component: SimpleTableToolsTable,
  description: 'Simple Table Tools Table Example',
};

export const simpleFiltered = {
  title: 'Simple filtered',
  Component: SimpleTableToolsTableFiltered,
  description: 'Simple Table Tools Table Example with one text filter',
};

export const simpleSorted = {
  title: 'Simple sorted',
  Component: SimpleTableToolsTableSorted,
  description: 'Simple Table Tools Table Example with sorting on columns',
};

export const common = {
  title: 'Common',
  Component: CommonTableToolsTable,
  description: 'Table Tools Table Example with common features set up',
};

export const withDetails = {
  title: 'With details row',
  Component: TableToolsTableWithRowDetails,
  description:
    'Table Tools Table Example with a details/expandable row component',
};

export const withExport = {
  title: 'With export',
  Component: TableToolsTableWithExport,
  description:
    'Table Tools Table Example with an `exporter` function provided to enable the export configurtation',
};

export const withBulkSelect = {
  title: 'With BulkSelect',
  Component: TableToolsTableWithBulkSelect,
  description:
    'Table Tools Table Example with an `onSelect`, an `itemIdsInTable` and an `itemIdsOnPage` function provided to enable the full BulkSelect',
};

export const withTreeTable = {
  title: 'With TreeTable',
  Component: TableToolsTableWithTreeTable,
  description: 'Table Tools Table Example with a tableTree provided',
};

// TODO Add example that uses an async function and not a query hook
// TODO Add example with default sorting set to column other than the first
// TODO Add example with default initial filters set
// TODO Add example with custom emptyRows/empty state

export default [
  simple,
  simpleFiltered,
  simpleSorted,
  common,
  withDetails,
  withExport,
  withBulkSelect,
  withTreeTable,
];
