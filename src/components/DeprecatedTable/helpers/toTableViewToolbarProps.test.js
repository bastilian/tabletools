import views from '~/hooks/useTableView/views';

import { toTableViewToolbarProps } from './toTableViewToolbarProps';

describe('toTableViewToolbarProps', () => {
  it('returns nothing for views without toolbar props', () => {
    expect(
      toTableViewToolbarProps({
        view: 'rows',
        supportedViews: {
          rows: views.rows,
        },
      }),
    ).toEqual({});
  });

  it('maps tree view toolbar props', () => {
    expect(
      toTableViewToolbarProps({
        view: 'tree',
        supportedViews: {
          tree: views.tree,
        },
      }),
    ).toEqual({
      toolbarProps: {
        variant: 'compact',
        bulkSelect: undefined,
      },
    });
  });
});
