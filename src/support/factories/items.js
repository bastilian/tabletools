import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';

export const genres = faker.helpers.uniqueArray(faker.music.genre, 20);

const itemsFactory = Factory.define(({ sequence }) => ({
  id: sequence,
  itemId: sequence,
  title: faker.music.songName(),
  artist: faker.music.artist(),
  genre: faker.helpers.arrayElement(genres),
  description: faker.lorem.paragraph({ min: 1, max: 5 }),
  releaseYear: faker.date.past({ years: 60 }).getFullYear(),
  rating: faker.number.int({ min: 1, max: 5 }),
}));

export const items = itemsFactory.buildList(5000);

export default (count) => items.slice(0, count);
