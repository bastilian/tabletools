import React from 'react';
import {
  Page,
  PageSection,
  Panel,
  PanelMain,
  PanelMainBody,
} from '@patternfly/react-core';

import mswHandlers from './mswHandler';

const meta = {
  parameters: {
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

export default meta;
