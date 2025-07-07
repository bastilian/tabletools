import React from 'react';

import defaultStoryMeta from '~/support/defaultStoryMeta';
import itemsFactory from '~/support/factories/items';

import { StaticTableToolsTable } from '~/components';

const meta = {
  title: '"Using StaticTableToolsTable" tutorial examples',
  ...defaultStoryMeta,
};

const BasicStaticExample = () => {
  const arrayOfItems = itemsFactory(4096);

  const columns = [
    {
      title: 'Title',
      key: 'title',
    },
    {
      title: 'Artist',
    },
  ];

  return <StaticTableToolsTable items={arrayOfItems} columns={columns} />;
};

export const Basic = {
  render: () => <BasicStaticExample />,
};

const BasicStaticSortedExample = () => {
  const arrayOfItems = itemsFactory(4096);

  const columns = [
    {
      title: 'Title',
      key: 'title',
      sortable: 'title',
    },
    {
      title: 'Artist',
      sortable: 'artist',
    },
  ];

  return <StaticTableToolsTable items={arrayOfItems} columns={columns} />;
};

export const BasicSorted = {
  render: () => <BasicStaticSortedExample />,
};

const BasicStaticSortedFilteredExample = () => {
  const arrayOfItems = itemsFactory(4096);

  const columns = [
    {
      title: 'Title',
      key: 'title',
      sortable: 'title',
      exportKey: 'title',
    },
    {
      title: 'Artist',
      sortable: 'artist',
    },
  ];

  const filters = [
    { type: 'text', label: 'Title', filterAttribute: 'title' },
    { type: 'text', label: 'Artist', filterAttribute: 'artist' },
    {
      type: 'text',
      label: 'Title or Artist',
      filterSerialiser: (_config, [value]) =>
        `regex(.artist, "${value}", "i") or regex(.title, "${value}", "i")`,
    },
  ];

  return (
    <StaticTableToolsTable
      items={arrayOfItems}
      columns={columns}
      filters={{ filterConfig: filters }}
    />
  );
};

export const BasicSortedFiltered = {
  render: () => <BasicStaticSortedFilteredExample />,
};

const BasicBulkSelectExample = () => {
  const arrayOfItems = itemsFactory(4096);

  const columns = [
    {
      title: 'Title',
      key: 'title',
      sortable: 'title',
      exportKey: 'title',
    },
    {
      title: 'Artist',
      sortable: 'artist',
    },
  ];

  const filters = [
    { type: 'text', label: 'Title', filterAttribute: 'title' },
    { type: 'text', label: 'Artist', filterAttribute: 'artist' },
    {
      type: 'text',
      label: 'Title or Artist',
      filterSerialiser: (_config, [value]) =>
        `regex(.artist, "${value}", "i") or regex(.title, "${value}", "i")`,
    },
  ];

  return (
    <StaticTableToolsTable
      items={arrayOfItems}
      columns={columns}
      filters={{ filterConfig: filters }}
      options={{
        onSelect: (currentSelection) => {
          console.log('Currenlty selected', currentSelection);
        },
      }}
    />
  );
};

export const BasicBulkSelect = {
  render: () => <BasicBulkSelectExample />,
};

const BasicExportingExample = () => {
  const arrayOfItems = itemsFactory(4096);

  const columns = [
    {
      title: 'Title',
      key: 'title',
      sortable: 'title',
      exportKey: 'title',
    },
    {
      title: 'Artist',
      sortable: 'artist',
    },
  ];

  const filters = [
    { type: 'text', label: 'Title', filterAttribute: 'title' },
    { type: 'text', label: 'Artist', filterAttribute: 'artist' },
    {
      type: 'text',
      label: 'Title or Artist',
      filterSerialiser: (_config, [value]) =>
        `regex(.artist, "${value}", "i") or regex(.title, "${value}", "i")`,
    },
  ];

  return (
    <StaticTableToolsTable
      items={arrayOfItems}
      columns={columns}
      filters={{ filterConfig: filters }}
      options={{
        enableExport: true,
        onSelect: (currentSelection) => {
          console.log('Currenlty selected', currentSelection);
        },
      }}
    />
  );
};

export const BasicExport = {
  render: () => <BasicExportingExample />,
};

export default meta;
