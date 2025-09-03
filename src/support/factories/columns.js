import React from 'react';
import propTypes from 'prop-types';
import { fitContent, nowrap } from '@patternfly/react-table';
import { Label } from '@patternfly/react-core';

const Title = ({ title }) => <strong>{title}</strong>;
Title.propTypes = {
  title: propTypes.string,
};

const Genre = ({ genre }) => <Label color="blue">{genre}</Label>;
Genre.propTypes = {
  genre: propTypes.string,
};

export const title = {
  title: 'Title',
  Component: Title,
  renderExport: ({ title }) => title,
  sortable: 'title',
  manageable: false,
};

export const artist = {
  title: 'Artist',
  Component: ({ artist }) => artist,
  renderExport: ({ artist }) => artist,
  sortable: 'artist',
};

export const genre = {
  title: 'Genre',
  Component: Genre,
  renderExport: ({ genre }) => genre,
  sortable: 'genre',
  transforms: [fitContent],
};

export const releaseYear = {
  title: (
    <>
      Released <span style={{ color: 'grey' }}>(year)</span>
    </>
  ),
  Component: ({ releaseYear }) => releaseYear,
  renderExport: ({ releaseYear }) => releaseYear,
  sortable: 'releaseYear',
  transforms: [nowrap],
};

export const rating = {
  title: 'Rating',
  Component: ({ rating }) =>
    [...new Array(rating)]
      .map(() => {
        return '★';
      })
      .join(''),
  renderExport: ({ rating }) => rating,
  sortable: 'rating',
};

export default [title, artist, releaseYear, genre, rating];
