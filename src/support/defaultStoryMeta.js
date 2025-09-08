import React from 'react';
import {
  Page,
  PageSection,
  Panel,
  PanelMain,
  PanelMainBody,
} from '@patternfly/react-core';
import DarkMode from './components/DarkMode';

import mswRestHandlers from './api/rest';

const meta = {
  parameters: {
    msw: {
      handlers: mswRestHandlers,
    },
  },
  decorators: [
    (Story) => (
      <DarkMode>
        <Page
          sidebar={null}
          style={{
            paddingTop: '30px',
          }}
        >
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
      </DarkMode>
    ),
  ],
};

export default meta;
