---
title: Adding columns
group: Documents
category: Guides
---

# Adding columns to a TableToolsTable

To build a proper table using the `TableToolsTable`, we need to add columns.
The most basic definition for a column, is an object with a `title` property.

```js
const ColumnsExample = () => {
  const serialisedTableState = useSerialisedTableState();
  const {
    loading,
    result: { data, meta: { total } = {} } = {},
    error,
  } = useExampleDataQuery({
    endpoint: '/api',
    params: {
      ...(serialisedTableState?.pagination || {}),
    },
  });

  const columns = [
    {
      title: 'Title',
    },
  ];

  return (
    <TableToolsTable
      loading={loading}
      items={data}
      error={error}
      total={total}
      columns={columns}
      options={{
        serialisers: {
          pagination: convertToOffsetAndLimit,
        },
      }}
    />
  );
};
```

When a column only has a `title` property, it will look for a property matching the `title` value in the item object and try to render it as text.

## Using a `key` property

In cases where the property to show is different from what the `title` value is, a `key` property can be provided.

```js
const ColumnsKeyExample = () => {
  const serialisedTableState = useSerialisedTableState();
  const {
    loading,
    result: { data, meta: { total } = {} } = {},
    error,
  } = useExampleDataQuery({
    endpoint: '/api',
    params: {
      ...(serialisedTableState?.pagination || {}),
    },
  });

  const columns = [
    {
      title: 'Title',
    },
    { title: 'Style', key: 'genre' },
  ];

  return (
    <TableToolsTable
      loading={loading}
      items={data}
      error={error}
      total={total}
      columns={columns}
      options={{
        serialisers: {
          pagination: convertToOffsetAndLimit,
        },
      }}
    />
  );
};
```

## Rendering a component as a column cell

If we want to show information composed of multiple item properties,
or decorate the information with components we can do that by providing a `Component` property with a component to render.

```js

const Genre = ({ genre }) => <Label color="blue">{genre}</Label>;

Genre.propTypes = {
  genre: propTypes.string,
};

const ColumnsComponentExample = () => {
  const serialisedTableState = useSerialisedTableState();
  const {
    loading,
    result: { data, meta: { total } = {} } = {},
    error,
  } = useExampleDataQuery({
    endpoint: '/api',
    params: {
      ...(serialisedTableState?.pagination || {}),
    },
  });

  const columns = [
    {
      title: 'Title',
    },
    { title: 'Style', Component: Genre },
  ];

  return (
    <TableToolsTable
      loading={loading}
      items={data}
      error={error}
      total={total}
      columns={columns}
      options={{
        serialisers: {
          pagination: convertToOffsetAndLimit,
        },
      }}
    />
  );
};
```

The component is passed all the properties of the item(s) provided as `props`.

## Enable sorting for columns

To allow a table column to be sorted we can set a `sortable` property to `true`.

```js
const ColumnsSortedExample = () => {
  const serialisedTableState = useSerialisedTableState();
  const { tableState: { sort } = {} } = useFullTableState() || {};

  console.log('Current sorting:', sort);

  const {
    loading,
    result: { data, meta: { total } = {} } = {},
    error,
  } = useExampleDataQuery({
    endpoint: '/api',
    params: {
      ...(serialisedTableState?.pagination || {}),
    },
  });

  const columns = [
    {
      title: 'Title',
      sortable: true,
    },
    { title: 'Style', Component: Genre, sortable: true },
  ];

  return (
    <TableToolsTable
      loading={loading}
      items={data}
      error={error}
      total={total}
      columns={columns}
      options={{
        serialisers: {
          pagination: convertToOffsetAndLimit,
        },
      }}
    />
  );
};
```

This will show the sort indicator and allow changing the `sort` accessible in the table state.

## Serialising the `sort` state

Similar to how the table already has a "serialiser" for the pagination,
we can provide a serialiser for the `sort` state as well to allow passing it on to an API call easily.

The API used in our examples accepts a `sort` parameter in the format of `PROPERTY:DIRECTION`.
Since the `sortable` property for a column only needs to be "defined" we can also give it more value than just being a boolean and
set a string for it that is the property we want to pass to the API for the column to sort by.

The serialiser is called with the current `sort` state, with the `index` of the column clicked as well as the current `direction`.
We can use the index to look up the correct column information and pass on the `sortable` property as well as the direction.

```js
const sortSerialiser = ({ index, direction } = {}, columns) =>
  columns[index]?.sortable && `${columns[index].sortable}:${direction}`;

const ColumnsSortedSerialisedExample = () => {
  const serialisedTableState = useSerialisedTableState();

  const {
    loading,
    result: { data, meta: { total } = {} } = {},
    error,
  } = useExampleDataQuery({
    endpoint: '/api',
    params: {
      ...(serialisedTableState?.pagination || {}),
      ...(serialisedTableState?.sort
        ? { sort: serialisedTableState?.sort }
        : {}),
    },
  });

  const columns = [
    {
      title: 'Title',
      sortable: 'title',
    },
    { title: 'Style', Component: Genre, sortable: 'genre' },
  ];

  return (
    <TableToolsTable
      loading={loading}
      items={data}
      error={error}
      total={total}
      columns={columns}
      options={{
        serialisers: {
          pagination: convertToOffsetAndLimit,
          sort: sortSerialiser,
        },
      }}
    />
  );
};
```
