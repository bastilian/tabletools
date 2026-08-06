import columns from '~/support/factories/columns';

import { getColumnKey, getColumnsForModal, getColumnsToShow } from './helper';

describe('getColumnKey', () => {
  it('uses string titles as keys', () => {
    expect(getColumnKey({ title: 'Title' }, 0)).toBe('Title');
  });

  it('falls back to an index-based key for ReactNode titles', () => {
    expect(getColumnKey({ title: columns[2].title }, 2)).toBe('column-2');
  });
});

describe('getColumnsForModal', () => {
  it('excludes unmanageable columns by default', () => {
    const modalColumns = getColumnsForModal(columns);

    expect(modalColumns.map(({ key, isShown }) => ({ key, isShown }))).toEqual([
      { key: 'Title', isShown: true },
      { key: 'Artist', isShown: true },
      { key: 'column-2', isShown: true },
      { key: 'Genre', isShown: true },
    ]);
  });

  it('includes unmanageable columns as untoggleable when enableDragDrop is true', () => {
    const modalColumns = getColumnsForModal(columns, undefined, {
      enableDragDrop: true,
    });

    expect(
      modalColumns.map(({ key, isShown, isUntoggleable }) => ({
        key,
        isShown,
        isUntoggleable,
      })),
    ).toEqual([
      { key: 'Title', isShown: true, isUntoggleable: true },
      { key: 'Artist', isShown: true, isUntoggleable: false },
      { key: 'column-2', isShown: true, isUntoggleable: false },
      { key: 'Genre', isShown: true, isUntoggleable: false },
      { key: 'Rating', isShown: true, isUntoggleable: true },
    ]);
  });

  it('preserves applied order and visibility by key', () => {
    const columnState = [
      { key: 'Genre', isShown: true },
      { key: 'Title', isShown: false },
      { key: 'Artist', isShown: true },
      { key: 'column-2', isShown: true },
    ];

    const modalColumns = getColumnsForModal(columns, columnState);

    expect(modalColumns.map(({ key, isShown }) => ({ key, isShown }))).toEqual(
      columnState,
    );
  });
});

describe('getColumnsToShow', () => {
  it('returns shown columns in applied order and appends unmanageable columns', () => {
    const columnState = [
      { key: 'Genre', isShown: true },
      { key: 'Title', isShown: true },
      { key: 'Artist', isShown: false },
    ];

    const columnsToShow = getColumnsToShow(columns, columnState);

    expect(columnsToShow.map(({ title }) => title)).toEqual([
      'Genre',
      'Title',
      'Rating',
    ]);
  });

  it('preserves unmanageable column order when present in columnState', () => {
    const columnState = [
      { key: 'Rating', isShown: true },
      { key: 'Genre', isShown: true },
      { key: 'Title', isShown: true },
    ];

    const columnsToShow = getColumnsToShow(columns, columnState);

    expect(columnsToShow.map(({ title }) => title)).toEqual([
      'Rating',
      'Genre',
      'Title',
    ]);
  });
});
