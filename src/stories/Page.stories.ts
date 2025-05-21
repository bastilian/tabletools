import type { Meta, StoryObj } from '@storybook/react';

import SimpleTableToolsTable from '~/examples/components/SimpleTableToolsTable';

const meta = {
  title: 'Example/Page',
  component: SimpleTableToolsTable,
  parameters: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Main: Story = {};
