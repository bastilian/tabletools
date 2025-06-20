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

const arrayOfItems = itemsFactory(505);

const meta = {
  title: 'StaticTableToolsTable',
  parameters: {
    layout: 'fullscreen',
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

export const Main = {
  render: () => {
    return (
      <StaticTableToolsTable
        items={arrayOfItems}
        columns={columns}
        filters={{ filterConfig: filters }}
      />
    );
  },
};

export default meta;
