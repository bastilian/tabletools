import { faker } from '@faker-js/faker';

import {
  artistByGenre,
  artistsGroupedByGenre,
} from '~/support/factories/filters';
import { genres } from '~/support/factories/items';

import groupType from './groupType';
import { stringToId } from '../helpers';

describe('groupType', () => {
  describe('filterValues', () => {
    it('should return a filterValues config for the ConditionalFilter component', () => {
      const filterValues = groupType.filterValues(
        artistByGenre,
        () => {},
        // TODO Replace with proper selected value
        undefined,
      );

      expect(filterValues).toEqual(
        expect.objectContaining({
          onChange: expect.any(Function),
          selected: undefined,
          groups: expect.any(Array),
        }),
      );
    });
  });

  describe('filterChips', () => {
    it('should return a filter chip configuration for the PrimaryToolbar component', () => {
      expect(groupType.filterChips(artistByGenre, [])).toEqual(
        expect.objectContaining({
          category: artistByGenre.label,
          chips: expect.any(Array),
        }),
      );
    });
  });

  describe('toSelectValue', () => {
    it('should return arguments for the select fucntion call', () => {
      const randomGenre = faker.helpers.arrayElement(genres);
      const randomArtist = faker.helpers.arrayElement(
        artistsGroupedByGenre[randomGenre],
      ).artist;
      const selectedValue = {
        [randomGenre]: { [randomGenre]: true, [randomArtist]: true },
      };

      expect(groupType.toSelectValue(artistByGenre, selectedValue)).toEqual([
        selectedValue,
        stringToId(artistByGenre.label),
        true,
      ]);
    });
  });

  describe.skip('toDeselectValue', () => {
    it('should return arguments for the deselect fucntion call', () => {
      const randomGenre = faker.helpers.arrayElement(genres);
      const randomArtist = faker.helpers.arrayElement(
        artistsGroupedByGenre[randomGenre],
      ).artist;
      const selectedValue = {
        [stringToId(artistByGenre.label)]: {
          [randomGenre]: { [randomGenre]: true, [randomArtist]: true },
        },
      };

      expect(
        groupType.toDeselectValue(
          artistByGenre,
          {
            chips: [{ name: randomArtist, value: randomArtist }],
          },
          selectedValue,
        ),
      ).toEqual([
        stringToId(selectedValue),
        stringToId(artistByGenre.label.toLowerCase()),
      ]);
    });
  });
});
