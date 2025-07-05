---
title: Using the table tools
group: Documents
category: Guides
---

# Using the table tools

A basic example component using the `TableToolsTable` this way would look like this:

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

In this example, we pass an array of columns, with a `title` to show in the table header,
and a `key` property identifying the property of the item to show in the table.

We also provide an async "`fetchItems`" function, which will be called by the `TableToolsTable` component and
should return the items to show in the table for the current page and
the overall total number of items that are available to browse.

Providing an async function as for the `items` prop is one way to use the `TableToolsTable`.
Another way is by passing an array as the `items`, as well as the `total` and `loading` as a prop,
if you are using a `useQuery`(-like) hook like in the following example:

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

Both of the above examples will work and show items as rows in a table, however, neither will properly paginate.
In order to enable paginating through items available via the API, we will need to access the table state and
pass the pagination state as parameters to the API.

# Accessing & serialising the table state

When using the `TableToolsTable` with an async function, the tableState will be passed as the **second** parameter,
when the function is called and the pagination state can be accessed and converted to parameters suitable for the API.

Like we do here:

```js
import { TableToolsTable } from 'bastilian-tabletools';

const BasicStateExample = () => {
  const fetchItems = async (
    _serialisedTableState,
    { pagination: { state: pagination } = {} } = {},
  ) => {
    const params = new URLSearchParams(
      convertToOffsetAndLimit(pagination),
    ).toString();
    const response = await fetch('/api?' + params);
    const json = await response.json();

    return [json.data, json.meta.total];
  };

  const columns = [
    {
      title: 'Title',
      key: 'title',
    },
  ];

  return <TableToolsTable items={fetchItems} columns={columns} />;
};

export default BasicStateExample;
```

The **first** parameter passed to the function is the __serialisedState_. The serialised state is used
when a "serialiser" is provided, which is a function that converts a table state into any wanted format when the state is changed.

We can for example provide the `convertToOffsetAndLimit` function as a serialiser for the pagination state:

```js
import { TableToolsTable } from 'bastilian-tabletools';

const BasicSerialisedStateExample = () => {
  const fetchItems = async ({ pagination } = {}) => {
    const params = new URLSearchParams(pagination).toString();
    const response = await fetch('/api?' + params);
    const json = await response.json();

    return [json.data, json.meta.total];
  };

  const columns = [
    {
      title: 'Title',
      key: 'title',
    },
  ];

  return (
    <TableToolsTable
      items={fetchItems}
      columns={columns}
      options={{
        serialisers: {
          pagination: convertToOffsetAndLimit,
        },
      }}
    />
  );
};

export default BasicSerialisedStateExample;
```

In cases where the `TableToolsTable` is used with a query hook or similar,
the table state can be accessed via a hook to access the table context.

For this we need to wrap the component that will call the query hook in the `TableStateProvider` component,
which will allow the `useSerialisedTableState` to access the context properly.

```js
import { TableToolsTable, TableStateProvider, useSerialisedTableState } from 'bastilian-tabletools';


const BasicQueryWithSerialisedStateExample = () => {
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
      options={{
        serialisers: {
          pagination: convertToOffsetAndLimit,
        },
      }}
    />
  );
};

const BasicQueryWithSerialisedStateExampleWrapper = () => (
  <TableStateProvider>
    <BasicQueryWithSerialisedStateExample />
  </TableStateProvider>
);

export default BasicQueryWithSerialisedStateExampleWrapper;
```

With this you should be able to build a basic paginated table for any API resource.
The `TableToolsTable` also allows adding filters, enable sorting, enhance columns and
many other features covered in other parts of the/future documentation.
