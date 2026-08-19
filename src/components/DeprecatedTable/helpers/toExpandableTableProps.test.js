import { toExpandableTableProps } from './toExpandableTableProps';

describe('toExpandableTableProps', () => {
  it('returns nothing if expandable rows are disabled', () => {
    expect(
      toExpandableTableProps({
        enableExpandingRow: false,
        onCollapse: jest.fn(),
      }),
    ).toEqual({});
  });

  it('maps expandable props to deprecated table props', () => {
    const onCollapse = jest.fn();

    expect(
      toExpandableTableProps({
        enableExpandingRow: true,
        onCollapse,
        canCollapseAll: true,
        enableTreeView: false,
      }),
    ).toEqual({
      canCollapseAll: true,
      onCollapse,
    });
  });

  it('does not pass canCollapseAll when enableTreeView is set', () => {
    const onCollapse = jest.fn();

    expect(
      toExpandableTableProps({
        enableExpandingRow: true,
        onCollapse,
        canCollapseAll: true,
        enableTreeView: true,
      }),
    ).toEqual({
      onCollapse,
    });
  });
});
