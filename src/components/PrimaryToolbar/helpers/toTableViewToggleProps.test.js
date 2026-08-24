import { ListIcon, TreeviewIcon } from '@patternfly/react-icons';

import { toTableViewToggleProps } from './toTableViewToggleProps';

describe('toTableViewToggleProps', () => {
  it('returns nothing when the toggle is disabled', () => {
    expect(
      toTableViewToggleProps({
        enableToggle: false,
        choosableViews: { rows: { icon: ListIcon } },
        setTableView: jest.fn(),
        view: 'rows',
      }),
    ).toBeUndefined();
  });

  it('maps table view props to toggle props', () => {
    const setTableView = jest.fn();
    const choosableViews = {
      rows: { icon: ListIcon },
      tree: { icon: TreeviewIcon },
    };

    expect(
      toTableViewToggleProps({
        enableToggle: true,
        choosableViews,
        setTableView,
        view: 'tree',
      }),
    ).toEqual({
      views: choosableViews,
      onToggle: setTableView,
      currentTableView: 'tree',
    });
  });
});
