import React from 'react';
import { Page, PageSection } from '@patternfly/react-core';

import mswHandlers from './mswHandler';

const meta = {
  parameters: {
    msw: {
      handlers: mswHandlers,
    },
  },
  decorators: [
    (Story) => (
      <Page defaultManagedSidebarIsOpen={false}>
        <PageSection>
          <Story />
        </PageSection>
      </Page>
    ),
  ],
};

export default meta;
