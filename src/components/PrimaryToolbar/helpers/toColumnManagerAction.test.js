import { toColumnManagerAction } from './toColumnManagerAction';

describe('toColumnManagerAction', () => {
  it('returns nothing when column management is disabled', () => {
    expect(
      toColumnManagerAction({
        enableColumnManager: false,
        label: 'Manage columns',
        openColumnManager: jest.fn(),
      }),
    ).toBeUndefined();
  });

  it('maps column manager props to a toolbar action item', () => {
    const openColumnManager = jest.fn();

    expect(
      toColumnManagerAction({
        enableColumnManager: true,
        label: 'Manage columns',
        openColumnManager,
      }),
    ).toEqual({
      label: 'Manage columns',
      onClick: openColumnManager,
    });
  });
});
