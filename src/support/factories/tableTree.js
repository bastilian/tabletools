import { jsonquery } from '@jsonquerylang/jsonquery';

import itemsFactory from './items';

const defaultItems = itemsFactory(100);

export const buildTree = ({ items = defaultItems } = {}) => {
  const groupedItems = jsonquery(items, 'groupBy(.genre)');

  return Object.entries(groupedItems)
    .map(([genre, genreItems]) => {
      const genreItemsGroupedByReleaseYear = jsonquery(
        genreItems,
        'groupBy(.releaseYear)',
      );

      const twigs = Object.entries(genreItemsGroupedByReleaseYear)
        .map(([releaseYear, releaseYearItems]) => {
          const leaves = releaseYearItems.map(({ id }) => ({ itemId: id }));
          return leaves.length
            ? {
                id: `${genre}-year-${releaseYear}`,
                itemId: `${genre}-year-${releaseYear}`,
                title: releaseYear,
                leaves,
              }
            : undefined;
        })
        .filter((v) => !!v);

      return twigs.length
        ? {
            id: `genre-${genre}`,
            itemId: `genre-${genre}`,
            title: genre,
            twigs,
          }
        : undefined;
    })
    .filter((v) => !!v);
};

export default buildTree;
