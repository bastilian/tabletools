import { genres, items } from './items';

export const title = {
  type: 'text',
  label: 'Title',
  filterAttribute: 'title',
};

export const artist = {
  type: 'text',
  label: 'Artist',
  filterAttribute: 'artist',
};

export const titleOrArtist = {
  type: 'text',
  label: 'Title or Artist',
  filterSerialiser: (_config, [value]) =>
    `regex(.artist, "${value}", "i") or regex(.title, "${value}", "i")`,
};

export const genre = {
  type: 'checkbox',
  label: 'Genre',
  filterAttribute: 'genre',
  items: genres.sort().map((option) => ({
    label: option,
    value: option,
  })),
};

export const singleGenre = {
  ...genre,
  type: 'radio',
  label: 'Single genre',
};

export const rating = {
  type: 'radio',
  label: 'Rating above',
  items: [...new Array(5)].map((_, idx) => ({
    label: [...new Array(idx + 1)].map(() => '★'),
    value: idx + 1,
  })),
  filterSerialiser: (_config, value) => `.rating >= ${value}`,
};

export const decade = {
  type: 'singleSelect',
  label: 'Released in decade',
  items: [
    { label: '60s', value: [1960, 1970] },
    { label: '70s', value: [1970, 1980] },
    { label: '80s', value: [1980, 1990] },
    { label: '90s', value: [1990, 2000] },
    { label: '00s', value: [2000, 2010] },
    { label: '10s', value: [2010, 2020] },
    { label: '20s', value: [2020, 2030] },
  ],
  filterSerialiser: (_config, [[start, end]]) =>
    `(.releaseYear >= ${start}) and (.releaseYear <= ${end})`,
};

const artistsGroupedByGenre = Object.groupBy(items, ({ genre }) => genre);

export const artistByGenre = {
  type: 'group',
  label: 'Artist by genre',
  items: Object.entries(artistsGroupedByGenre).map(([genre, artists]) => ({
    label: genre,
    value: genre,
    items: artists.slice(0, 10).map(({ id, artist }) => ({
      label: artist,
      value: id,
    })),
  })),
  modal: true,
};

export const invalidFilter = {
  type: 'UNKNOWNTYPE',
  label: 'Invalid Filter',
  items: ['OPTION 1', 'OPTION 2', 'OPTION 3'].map((option) => ({
    label: option,
    value: `${option}-value`,
  })),
  filter: (items) => items,
};

export default [
  title,
  artist,
  artistByGenre,
  genre,
  singleGenre,
  rating,
  decade,
  invalidFilter,
];
