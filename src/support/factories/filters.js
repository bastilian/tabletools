import NumberFilter from '~/support/components/NumberFilter';

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
  filterSerialiser: (_filterConfigItem, value) =>
    `.artist in [${Object.entries(value)
      .reduce((_genre, [, artists]) => [...Object.keys(artists)], [])
      .map((artist) => `"${artist}"`)
      .join(', ')}]`,
  groups: Object.entries(artistsGroupedByGenre).map(([genre, artists]) => ({
    label: genre,
    value: genre,
    items: artists.slice(0, 10).map(({ artist }) => ({
      label: artist,
      value: artist,
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

export const yearsByDecade = {
  type: 'group',
  label: 'Years by decade',
  filterSerialiser: (_filterConfigItem, value) => {
    const allYears = Object.entries(value).reduce(
      (years, [, groupYears]) => [...years, ...Object.keys(groupYears)],
      [],
    );

    return `.releaseYear in [${allYears.join(', ')}]`;
  },
  groups: [
    {
      label: '80s',
      value: '80s',
      items: [...new Array(10)].map((_, idx) => ({
        label: `198${idx}`,
        value: `198${idx}`,
      })),
    },
    {
      label: '90s',
      value: '90s',
      items: [...new Array(10)].map((_, idx) => ({
        label: `199${idx}`,
        value: `199${idx}`,
      })),
    },
    {
      label: '00s',
      value: '00s',
      items: [...new Array(10)].map((_, idx) => ({
        label: `200${idx}`,
        value: `200${idx}`,
      })),
    },
    {
      label: '10s',
      value: '10s',
      items: [...new Array(10)].map((_, idx) => ({
        label: `201${idx}`,
        value: `201${idx}`,
      })),
    },
    {
      label: '20s',
      value: '20s',
      items: [...new Array(5)].map((_, idx) => ({
        label: `201${idx}`,
        value: `201${idx}`,
      })),
    },
  ],
  modal: {
    title: 'Select years to filter by',
  },
};

const genreFilterOptions = genres.map((genre) => ({
  label: genre,
  value: genre,
}));

export const genreWithModal = {
  type: 'checkbox',
  label: 'Genre With Modal',
  filterAttribute: 'genre',
  items: genreFilterOptions,
  modal: true,
};

export const genreWithFetchedItems = {
  type: 'checkbox',
  label: 'Genre With fetched items',
  filterAttribute: 'genre',
  items: async () => {
    try {
      const genresResponse = await fetch('/api/genres?offset=0&limit=20');
      const genresJson = await genresResponse.json();

      return genresJson.data.map((genre) => ({
        label: genre,
        value: genre,
      }));
    } catch {
      return [];
    }
  },
  modal: true,
};

export const genreWithFetchedItemsAndModalItems = {
  type: 'checkbox',
  label: 'Genre With fetched items and modal items',
  filterAttribute: 'genre',
  items: genreFilterOptions,
  modal: {
    items: async (
      _serialisedState,
      { pagination: { state } = { page: 1, perPage: 10 } } = {},
    ) => {
      const offset = (state?.page - 1) * state?.perPage;
      const limit = state?.perPage;
      const genresResponse = await fetch(
        `/api/genres?offset=${offset}&limit=${limit}`,
      );
      const genresJson = await genresResponse.json();

      return [
        genresJson.data.map((genre) => ({
          label: genre,
          value: genre,
        })),
        genresJson.meta.total,
      ];
    },
  },
};

export const customNumberFilterType = {
  Component: NumberFilter,
  chips: (value) => [value],
  selectValue: (value) => [value, true],
  deselectValue: () => [undefined, true],
};

export const customNumberFilter = {
  type: 'number',
  label: 'Custom Number Filter',
  filterAttribute: 'rating',
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
  yearsByDecade,
  genreWithModal,
  genreWithFetchedItems,
  genreWithFetchedItemsAndModalItems,
];
