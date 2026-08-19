import { toBulkSelectConfig } from './toBulkSelectConfig';

describe('toBulkSelectConfig', () => {
  it('returns nothing when bulk select is disabled', () => {
    expect(
      toBulkSelectConfig({
        enableBulkSelect: false,
        bulkSelectItems: [],
      }),
    ).toEqual({});
  });

  it('maps bulk select props to FEC bulkSelect toolbar props', () => {
    const onToolbarSelect = jest.fn();
    const bulkSelectItems = [{ title: 'Select none' }];

    expect(
      toBulkSelectConfig({
        enableBulkSelect: true,
        loading: false,
        selectedIdsTotal: 2,
        isDisabled: false,
        bulkSelectItems,
        checked: null,
        onToolbarSelect,
      }),
    ).toEqual({
      toolbarProps: {
        bulkSelect: {
          count: 2,
          isDisabled: false,
          items: bulkSelectItems,
          checked: null,
          onSelect: onToolbarSelect,
        },
      },
    });
  });

  it('uses toggleProps while loading', () => {
    const title = 'Loading...';

    expect(
      toBulkSelectConfig({
        enableBulkSelect: true,
        loading: true,
        title,
        isDisabled: false,
        bulkSelectItems: [],
        onToolbarSelect: jest.fn(),
      }),
    ).toEqual({
      toolbarProps: {
        bulkSelect: {
          toggleProps: { children: [title] },
          isDisabled: false,
          items: [],
          onSelect: expect.any(Function),
        },
      },
    });
  });

  it('omits onSelect when disabled', () => {
    expect(
      toBulkSelectConfig({
        enableBulkSelect: true,
        isDisabled: true,
        bulkSelectItems: [],
        onToolbarSelect: jest.fn(),
      }),
    ).toEqual({
      toolbarProps: {
        bulkSelect: {
          count: undefined,
          isDisabled: true,
          items: [],
          onSelect: undefined,
        },
      },
    });
  });
});
