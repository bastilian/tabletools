---
title: Using the StaticTableToolsTable component
group: Documents
category: Guides
---

# Using the StaticTableToolsTable component

The `StaticTableToolsTable` component is a wrapper component around the `TableToolsTable`, which
can handle "static" arrays of items and paginate them for cases where an API can not paginate or
any other situation where it is not possible to dynamically get paginated items.

A simple example of using the `StaticTableToolsTable` would look like this:

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

The `StaticTableToolsTable` component also allows sorting and filtering via [jsonquery](https://jsonquerylang.org/).

## Sorting the StaticTableToolsTable

To enable sorting for any column, a `sortable` prop needs to be provided to identify the property the column should be sorted by.

```js
import { StaticTableToolsTable } from 'bastilian-tabletools';

const BasicStaticSortedExample = () => {
  const arrayOfItems = itemsFactory(4096);

  const columns = [
    {
      title: 'Title',
      key: 'title',
      sortable: 'title',
    },
    {
      title: 'Artist',
      sortable: 'artist',
    },
  ];

  return <StaticTableToolsTable items={arrayOfItems} columns={columns} />;
};

export default BasicStaticSortedExample;
```

## Filtering the StaticTableToolsTable

Filters can be provided as with any other `TableToolsTable` based table and can have a `filterAttribute` to identify the property the items should be filtered by.
For more complex filtering a `filterSerialiser` function can be passed, which should return a [jsonquery](https://jsonquerylang.org/) filter snippet as shown in the following example:

```js
import { StaticTableToolsTable } from 'bastilian-tabletools';

const BasicStaticSortedFilteredExample = () => {
  const arrayOfItems = itemsFactory(4096);

  const columns = [
    {
      title: 'Title',
      key: 'title',
      sortable: 'title',
      exportKey: 'title',
    },
    {
      title: 'Artist',
      sortable: 'artist',
    },
  ];

  const filters = [
    { type: 'text', label: 'Title', filterAttribute: 'title' },
    { type: 'text', label: 'Artist', filterAttribute: 'artist' },
    {
      type: 'text',
      label: 'Title or Artist',
      filterSerialiser: (_config, [value]) =>
        `regex(.artist, "${value}", "i") or regex(.title, "${value}", "i")`,
    },
  ];

  return (
    <StaticTableToolsTable
      items={arrayOfItems}
      columns={columns}
      filters={{ filterConfig: filters }}
    />
  );
};

export default BasicStaticSortedFilteredExample;
```

## Bulk selecting a StaticTableToolsTable

The `StaticTableToolsTable` component already provides necessary functions to make the correct selections
and only requires being passed a `onSelect` function in the options to enable bulk selection.

```js
import { StaticTableToolsTable } from 'bastilian-tabletools';

const BasicBulkSelectExample = () => {
  const arrayOfItems = itemsFactory(4096);

  const columns = [
    {
      title: 'Title',
      key: 'title',
      sortable: 'title',
      exportKey: 'title',
    },
    {
      title: 'Artist',
      sortable: 'artist',
    },
  ];

  const filters = [
    { type: 'text', label: 'Title', filterAttribute: 'title' },
    { type: 'text', label: 'Artist', filterAttribute: 'artist' },
    {
      type: 'text',
      label: 'Title or Artist',
      filterSerialiser: (_config, [value]) =>
        `regex(.artist, "${value}", "i") or regex(.title, "${value}", "i")`,
    },
  ];

  return (
    <StaticTableToolsTable
      items={arrayOfItems}
      columns={columns}
      filters={{ filterConfig: filters }}
      options={{
        onSelect: (currentSelection) => {
          console.log('Currenlty selected', currentSelection);
        },
      }}
    />
  );
};

export default BasicBulkSelectExample;
```

## Exporting in a StaticTableToolsTable

Enabling export in a StaticTableToolsTable is as simple as passing `enableExport` in the options:

```js
import { StaticTableToolsTable } from 'bastilian-tabletools';

const BasicExportingExample = () => {
  const arrayOfItems = itemsFactory(4096);

  const columns = [
    {
      title: 'Title',
      key: 'title',
      sortable: 'title',
      exportKey: 'title',
    },
    {
      title: 'Artist',
      sortable: 'artist',
    },
  ];

  const filters = [
    { type: 'text', label: 'Title', filterAttribute: 'title' },
    { type: 'text', label: 'Artist', filterAttribute: 'artist' },
    {
      type: 'text',
      label: 'Title or Artist',
      filterSerialiser: (_config, [value]) =>
        `regex(.artist, "${value}", "i") or regex(.title, "${value}", "i")`,
    },
  ];

  return (
    <StaticTableToolsTable
      items={arrayOfItems}
      columns={columns}
      filters={{ filterConfig: filters }}
      options={{
        enableExport: true,
        onSelect: (currentSelection) => {
          console.log('Currenlty selected', currentSelection);
        },
      }}
    />
  );
};

export default BasicExportingExample;
```
