---
title: Using the table tools
group: Documents
category: Guides
---

# Using the table tools

The {@link TableToolsTable} component can be used with an async function to retrieve items to show in the page.
The function will be called with the current `serialisedTableState`, and the "raw" `tableState`.

A basic example component using the `TableToolsTable` this way would look like this:

<!-- TODO check the columns renderFunc what exactly is passed -->
```js
import { fetchItems } from 'api';
import { TableToolsTable } from '@bastilian/tabletools';

const columns = [
 {
   title: 'Name',
   renderFunc: (_data, _rowId, item) => item.name,
 },
];


const fetchItems = async () =>
  fetch('/api/items')

const Page = () =>
  <TableToolsTable items={fetchItems} columns={columns}/>;

export default Page;
```

In this example, we pass an array of columns, with a title to show in the table header,
and `renderFunc` to render cells in a row for this column.

We also provide the `fetchItems` function, which will call our imaginary API and return an array of items for rows to render.
