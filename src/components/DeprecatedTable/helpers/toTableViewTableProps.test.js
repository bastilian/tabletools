import columns from '~/support/factories/columns';
import items from '~/support/factories/items';
import views from '~/hooks/useTableView/views';

import { toTableViewTableProps } from './toTableViewTableProps';

const supportedViews = Object.fromEntries(
  Object.entries(views).filter(([, { checkOptions }]) =>
    checkOptions?.({ columns }),
  ),
);

describe('toTableViewTableProps', () => {
  const exampleItems = items(3);

  it('returns nothing when the active view is missing', () => {
    const tableView = {
      view: 'rows',
      loading: false,
      items: [],
      error: undefined,
      total: 0,
      viewOptions: { columns },
      supportedViews: {},
    };

    expect(toTableViewTableProps(tableView)).toEqual({});
  });

  it('returns table rows for the rows view', () => {
    const tableView = {
      view: 'rows',
      loading: false,
      items: exampleItems,
      error: undefined,
      total: exampleItems.length,
      viewOptions: { columns },
      supportedViews,
    };

    const tableProps = toTableViewTableProps(tableView);

    expect(tableProps.rows).toHaveLength(exampleItems.length);
  });
});
