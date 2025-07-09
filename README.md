# Table Tools

The "Table Tools" are a collection of hooks and components to build tables based on the PatternFly (v4) [`Table`](https://www.patternfly.org/components/table/react-deprecated) component and the Red Hat Insights [`PrimaryToolbar`](https://github.com/RedHatInsights/frontend-components/blob/master/packages/components/doc/primary_toolbar.md) component.

It provides implementations and state management for several features and provides a context to access the state to request/provide data to show on the table.

**Supported [`PrimaryToolbar`](https://github.com/RedHatInsights/frontend-components/blob/master/packages/components/doc/primary_toolbar.md) features**

 * pagination - {@link Main.usePagination usePagination}
 * exportConfig - {@link Main.useExport useExport}
 * bulkSelect - {@link Main.useBulkSelect useBulkSelect}
 * column management - {@link Main.useColumnManager useColumnManager}
 * filterConfig & activeFiltersConfig - {@link Main.useFilterConfig useFilterConfig}
 * toolbar actions

**Supported [`Table`](https://www.patternfly.org/components/table/react-deprecated) feature**

 * sorting columns - {@link Main.useTableSort useTableSort}
 * selectable rows - {@link Main.useBulkSelect useBulkSelect}
 * radio selectable rows - {@link Main.useRadioSelect useRadioSelect}
 * expandable rows - {@link Main.useTableView useTableView}
 * TreeTable - {@link Main.useTableView useTableView}
 * EmptyState - {@link Main.useTableView useTableView}

# Install

```sh
$ npm install --save bastilian-tabletools
```

# Basic usage

The tabletools offer three ways of building and filling a table, via an async function that returns an array of paginated items,
via an `useQuery` like hook that provides the table with an array of paginated items or by using the `StaticTableToolsTable` with an "static" array of all items unpaginated.

## Using an async function

An async function can be provided as the `items` prop to retrieve items to show in the table.
The function should return an array with two items, the first being the array of items to show and
the second being the total amount of items available to show in the table.

```js
import { TableToolsTable } from 'bastilian-tabletools';

const BasicExample = () => {
  const fetchItems = async () => {
    const response = await fetch('/api')
    const json = await response.json();

    return [json.data, json.meta.total]
  }

  const columns = [
    {
      title: 'Title',
      key: 'title'
    },
  ];

  return (
    <TableToolsTable items={fetchItems} columns={columns} />
  );
}

export default BasicExample;
```

## Using a `useQuery` (like) hook

To use the `TableToolsTable` component with an `useQuery` like hook, it needs to be passed a `loading`, `items`, `total` and optionally an `error` prop.
The `loading` prop should be the loading state of the hook. The `items` should be the fetched result(s) in an array,
with the `total` being the overall amount of items/results available.


```js
import { TableToolsTable } from 'bastilian-tabletools';

const BasicQueryExample = () => {
  const {
    loading,
    result: { data, meta: { total } = {} } = {},
    error,
  } = useExampleDataQuery({ endpoint: '/api' });

  const columns = [
    {
      title: 'Title',
      key: 'title',
    },
  ];

  return (
    <TableToolsTable
      loading={loading}
      items={data}
      error={error}
      total={total}
      columns={columns}
    />
  );
};

export default BasicQueryExample;
```

## Using the `StaticTableToolsTable`

In cases where it is not possible to fetch paginated results from an API,
or it is unnecessary to only fetch paginated results, the `StaticTableToolsTable` can be used.

It can be passed an array of all available items/results and provides sorting and filtering of arrays out of the box.


```js
import { StaticTableToolsTable } from 'bastilian-tabletools';

const BasicStaticExample = () => {
  const arrayOfItems = itemsFactory(4096);

  const columns = [
    {
      title: 'Title',
      key: 'title',
    },
    {
      title: 'Artist',
    },
  ];

  return (
    <StaticTableToolsTable
      items={arrayOfItems}
      columns={columns}
    />
  );
};

export default BasicStaticExample;
```

For more advance use please see the rest of the documentation at bastilian.github.io/tabletools/
