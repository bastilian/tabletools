import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';

import { ExamplesPage } from './ExamplesPage';

const meta = {
  title: 'Example/Page',
  component: ExamplesPage,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ExamplesPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Main: Story = {};
