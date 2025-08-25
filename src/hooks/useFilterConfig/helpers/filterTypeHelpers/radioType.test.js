import { faker } from '@faker-js/faker';

import { singleGenre } from '~/support/factories/filters';
import { genres } from '~/support/factories/items';

import radioType from './radioType';
import { stringToId } from '../helpers';

describe('radioType', () => {
  describe('filterValues', () => {
    it('should return a filterValues config for the ConditionalFilter component', () => {
      const testValue = [faker.helpers.arrayElement(genres)].map(stringToId);

      expect(radioType.filterValues(singleGenre, () => {}, testValue)).toEqual(
        expect.objectContaining({
          onChange: expect.any(Function),
          value: testValue[0],
        }),
      );
    });
  });

  describe('filterChips', () => {
    it('should return a filter chip configuration for the PrimaryToolbar component', () => {
      const testGenres = faker.helpers.arrayElements(genres, 5);
      const testValue = testGenres.map(stringToId);

      expect(radioType.filterChips(singleGenre, testValue)).toEqual(
        expect.objectContaining({
          category: singleGenre.label,
          chips: testGenres.map((genre) => ({ name: genre })),
        }),
      );
    });
  });

  describe('toSelectValue', () => {
    it('should return arguments for the select fucntion call', () => {
      const testValue = stringToId(faker.helpers.arrayElement(genres));

      expect(radioType.toSelectValue(singleGenre, testValue)).toEqual([
        [testValue],
        stringToId(singleGenre.label),
        true,
      ]);
    });
  });

  describe('toDeselectValue', () => {
    it('should return arguments for the deselect fucntion call', () => {
      const testValue = faker.helpers.arrayElement(genres);

      expect(
        radioType.toDeselectValue(singleGenre, {
          chips: [{ name: testValue, value: stringToId(testValue) }],
        }),
      ).toEqual([undefined, stringToId(singleGenre.label), true]);
    });
  });
});
