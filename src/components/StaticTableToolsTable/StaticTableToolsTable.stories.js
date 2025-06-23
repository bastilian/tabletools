import React from 'react';
import {
  Page,
  PageSection,
  Panel,
  PanelMain,
  PanelMainBody,
} from '@patternfly/react-core';

import { StaticTableToolsTable } from '~/components';

import columns from '~/support/factories/columns';
import filters from '~/support/factories/filters';
import itemsFactory from '~/support/factories/items';
import mswHandlers from '~/support/mswHandler';

const arrayOfItems = itemsFactory(505);

const meta = {
  title: 'StaticTableToolsTable',
  args: {
    debug: true,
  },
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: mswHandlers,
    },
  },
  decorators: [
    (Story) => (
      <Page>
        <PageSection>
          <Panel>
            <PanelMain>
              <PanelMainBody>
                <Story />
              </PanelMainBody>
            </PanelMain>
          </Panel>
        </PageSection>
      </Page>
    ),
  ],
};

const MainExample = ({ debug }) => {
  return (
    <StaticTableToolsTable
      items={arrayOfItems}
      columns={columns}
      filters={{ filterConfig: filters }}
      options={{ debug }}
    />
  );
};

export const Main = {
  render: (args) => <MainExample {...args} />,
};

export default meta;
