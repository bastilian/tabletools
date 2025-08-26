import { faker } from '@faker-js/faker';

import { genre } from '~/support/factories/filters';
import { genres } from '~/support/factories/items';

import checkboxType from './checkboxType';
import { stringToId } from '../helpers';

describe('checkboxType', () => {
  describe('filterValues', () => {
    it('should return a filterValues config for the ConditionalFilter component', () => {
      const testValue = faker.helpers.arrayElements(genres, 5).map(stringToId);

      expect(checkboxType.filterValues(genre, () => {}, testValue)).toEqual(
        expect.objectContaining({
          onChange: expect.any(Function),
          value: testValue,
        }),
      );
    });
  });

  describe('filterChips', () => {
    it('should return a filter chip configuration for the PrimaryToolbar component', () => {
      const testGenres = faker.helpers.arrayElements(genres, 5);
      const testValue = testGenres.map(stringToId);

      expect(checkboxType.filterChips(genre, testValue)).toEqual(
        expect.objectContaining({
          category: genre.label,
          chips: testGenres.map((genre) => ({ name: genre })),
        }),
      );
    });
  });

  describe('toSelectValue', () => {
    it('should return arguments for the select fucntion call', () => {
      const testGenres = faker.helpers.arrayElements(genres, 5);
      const testValue = testGenres.map(stringToId);

      expect(checkboxType.toSelectValue(genre, testValue)).toEqual([
        testValue,
        genre.label.toLowerCase(),
        true,
      ]);
    });
  });

  describe('toDeselectValue', () => {
    it('should return arguments for the deselect fucntion call', () => {
      const testValue = faker.helpers.arrayElement(genres);

      expect(
        checkboxType.toDeselectValue(genre, {
          chips: [{ name: testValue, value: stringToId(testValue) }],
        }),
      ).toEqual([stringToId(testValue), genre.label.toLowerCase()]);
    });
  });
});
