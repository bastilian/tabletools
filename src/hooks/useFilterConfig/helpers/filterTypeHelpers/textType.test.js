import { artist } from '~/support/factories/filters';

import textType from './textType';

describe('textType', () => {
  describe('filterValues', () => {
    it('should return a filterValues config for the ConditionalFilter component', () => {
      const testValue = 'test value';

      expect(textType.filterValues(artist, () => {}, testValue)).toEqual(
        expect.objectContaining({
          onChange: expect.any(Function),
          value: testValue,
        }),
      );
    });

    it('should return an empty string if the value is undefined', () => {
      expect(textType.filterValues(artist, () => {}, undefined)).toEqual(
        expect.objectContaining({
          value: '',
        }),
      );
    });
  });

  describe('filterChips', () => {
    it('should return a filterValues config for the ConditionalFilter component', () => {
      const testValue = 'test value';

      expect(textType.filterChips(artist, [testValue])).toEqual(
        expect.objectContaining({
          category: artist.label,
          chips: [{ name: testValue }],
        }),
      );
    });
  });

  describe('toSelectValue', () => {
    it('should return a filterValues config for the ConditionalFilter component', () => {
      const testValue = 'test value';

      expect(textType.toSelectValue(artist, testValue)).toEqual([
        [testValue],
        artist.label.toLowerCase(),
        true,
      ]);
    });

    it('should return undefined if the value array is empty', () => {
      expect(textType.toSelectValue(artist, [])).toEqual([
        undefined,
        artist.label.toLowerCase(),
        true,
      ]);
    });
  });

  describe('toDeselectValue', () => {
    it('should return a filterValues config for the ConditionalFilter component', () => {
      const testValue = 'test value';

      expect(
        textType.toDeselectValue(artist, { chips: [{ name: testValue }] }),
      ).toEqual([testValue, artist.label.toLowerCase()]);
    });
  });
});
