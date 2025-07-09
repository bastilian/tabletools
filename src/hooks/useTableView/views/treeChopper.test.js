import tableTree, { exampleItems } from '~/support/factories/staticTableTree';

import treeChopper from './treeChopper';

const columns = [
  {
    title: 'Name',
    key:'name',
  },
  {
    title: 'Description',
    key:"description",
  },
];

const ExampleDetailsRow = ({ item }) => {
  return 'Details for :' + item.itemId;
};

describe('treeChopper', function () {
  it('should return rows for a tree table', () => {
    const rows = treeChopper(exampleItems, columns, {
      tableTree,
      expandable: {
        isItemOpen: (id) =>
          ['1st-branch', '1st-twig', exampleItems[0].itemId].includes(id),
      },
      detailsComponent: ExampleDetailsRow,
    });

    expect(rows.slice(0, 4).map(({ item: { itemId } }) => [itemId])).toEqual([
      ['1st-branch'],
      ['1st-twig'],
      ['2nd-twig'],
      ['2nd-branch'],
    ]);
  });
});
