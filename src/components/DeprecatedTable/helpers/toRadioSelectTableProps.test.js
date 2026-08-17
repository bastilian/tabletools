import { toRadioSelectTableProps } from './toRadioSelectTableProps';

describe('toRadioSelectTableProps', () => {
  it('returns nothing if onRadioSelect is missing', () => {
    expect(toRadioSelectTableProps({})).toEqual({});
  });

  it('maps radio select props to deprecated table props', () => {
    const onRadioSelect = jest.fn();

    expect(toRadioSelectTableProps({ onRadioSelect })).toEqual({
      onSelect: onRadioSelect,
      selectVariant: 'radio',
    });
  });
});
