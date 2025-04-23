import SimpleTableToolsTable from '../components/SimpleTableToolsTable';
import SimpleTableToolsTableFiltered from '../components/SimpleTableToolsTableFiltered';
import SimpleTableToolsTableSorted from '../components/SimpleTableToolsTableSorted';
import CommonTableToolsTable from '../components/CommonTableToolsTable';
import TableToolsTableWithRowDetails from '../components/TableToolsTableWithRowDetails';
import TableToolsTableWithExport from '../components/TableToolsTableWithExport';
import TableToolsTableWithBulkSelect from '../components/TableToolsTableWithBulkSelect';
import TableToolsTableWithTreeTable from '../components/TableToolsTableWithTreeTable';
import SimpleTableToolsTableWithAsyncFunction from '../components/SimpleTableToolsTableWithAsyncFunction';
import SimpleTableToolsTableWithCustomEmptyRows from '../components/SimpleTableToolsTableWithCustomEmptyRows';
import SimpleTableToolsTableWithCustomEmptyState from '../components/SimpleTableToolsTableWithCustomEmptyState';
import TableToolsTableWithError from '../components/TableToolsTableWithError';
import TableToolsTableWithErrorPassed from '../components/TableToolsTableWithErrorPassed';
import TableToolsTableWithCustomFilter from '../components/TableToolsTableWithCustomFilter';
import TableToolsTableWithFilterModalFilters from '../components/TableToolsTableWithFilterModalFilters';
import StaticTableToolsTable from '../components/StaticTableToolsTable';

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

export const withAsyncFunction = {
  title: 'With async function',
  Component: SimpleTableToolsTableWithAsyncFunction,
  description:
    'Table Tools Table Example with an async function to fetch results',
};

export const withCustomEmptyRows = {
  title: 'With custom emptyRows',
  Component: SimpleTableToolsTableWithCustomEmptyRows,
  description: 'Table Tools Table Example with a custom empty rows provided',
};

export const withCustomEmptyState = {
  title: 'With custom empty state',
  Component: SimpleTableToolsTableWithCustomEmptyState,
  description: 'Table Tools Table Example with a custom empty state provided',
};

export const withError = {
  title: 'With error',
  Component: TableToolsTableWithError,
  description:
    'Table Tools Table Example with a fetch that fails to test error views',
};

export const withErrorPassed = {
  title: 'With error passed in',
  Component: TableToolsTableWithErrorPassed,
  description:
    'Table Tools Table Example with an error passed in to test error views',
};

export const withCustomFilter = {
  title: 'With custom filter',
  Component: TableToolsTableWithCustomFilter,
  description:
    'Table Tools Table Example with a custom filter not provided by the ConditionalFilter component',
};

export const withFilterModalFilters = {
  title: 'With FilterModal filters',
  Component: TableToolsTableWithFilterModalFilters,
  description:
    'Table Tools Table Example with filters that have a modal enabled',
};

export const withStaticTableToolsTable = {
  title: 'with StaticTableToolsTable',
  Component: StaticTableToolsTable,
  description:
    'Table Tools Table Example using the StaticTableToolsTable component to build a table with an static array that should be filtered, sorted and paginated',
};

// TODO Add example with default sorting set to column other than the first
// TODO Add example with default initial filters set
// TODO Add example that makes use of table and row actions
// TODO Add example that accesses the tablestate in some way for something

export default [
  simple,
  simpleFiltered,
  simpleSorted,
  common,
  withDetails,
  withExport,
  withBulkSelect,
  withTreeTable,
  withAsyncFunction,
  withCustomEmptyRows,
  withCustomEmptyState,
  withError,
  withErrorPassed,
  withCustomFilter,
  withFilterModalFilters,
  withStaticTableToolsTable,
];
