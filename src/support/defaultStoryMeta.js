import React from 'react';
import {
  Page,
  PageSection,
  Panel,
  PanelMain,
  PanelMainBody,
} from '@patternfly/react-core';

import mswRestHandlers from './api/rest';

const meta = {
  parameters: {
    msw: {
      handlers: mswRestHandlers,
    },
  },
  decorators: [
    (Story) => (
      <Page sidebar={null}>
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
