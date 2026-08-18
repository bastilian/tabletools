import useRadioSelect from './useRadioSelect';

describe('useRadioSelect', () => {
  it('returns radio select props when enabled', () => {
    const onRadioSelect = jest.fn();

    expect(useRadioSelect({ onRadioSelect, total: 1 })).toEqual({
      onRadioSelect,
    });
  });

  it('returns an empty object when disabled', () => {
    expect(useRadioSelect({ total: 1 })).toEqual({});
    expect(useRadioSelect({ onRadioSelect: jest.fn(), total: 0 })).toEqual({});
  });
});
