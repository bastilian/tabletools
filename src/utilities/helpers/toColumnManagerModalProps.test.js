import { toColumnManagerModalProps } from './toColumnManagerModalProps';

describe('toColumnManagerModalProps', () => {
  it('returns nothing when column management is disabled', () => {
    expect(
      toColumnManagerModalProps({
        enableColumnManager: false,
        isOpen: true,
      }),
    ).toBeUndefined();
  });

  it('maps column manager props to modal props', () => {
    const closeColumnManager = jest.fn();
    const applyColumns = jest.fn();
    const appliedColumns = [{ key: 'Title', isShown: true }];

    expect(
      toColumnManagerModalProps({
        enableColumnManager: true,
        appliedColumns,
        isOpen: true,
        closeColumnManager,
        applyColumns,
        enableDragDrop: true,
      }),
    ).toEqual({
      appliedColumns,
      isOpen: true,
      onClose: closeColumnManager,
      applyColumns,
      enableDragDrop: true,
    });
  });
});
