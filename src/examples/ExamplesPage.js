import React, { useState } from 'react';
import {
  Alert,
  Tabs,
  Tab,
  TabTitleText,
  Text,
  TextContent,
  TextVariants,
  Stack,
  StackItem,
} from '@patternfly/react-core';

import examples from './constants/examples';

export const ExamplesPage = () => {
  const [activeTabKey, setActiveTabKey] = useState(10);
  const handleTabClick = (_event, tabIndex) => {
    setActiveTabKey(tabIndex);
  };

  return (
    <Stack>
      <StackItem className="pf-v5-u-mb-xl">
        <Alert
          isInline
          variant="info"
          title="Example components are unmounted when the tab is not visible and the state is reset. This is expected."
          ouiaId="InfoAlert"
        />
      </StackItem>
      <StackItem>
        <Tabs activeKey={activeTabKey} onSelect={handleTabClick} role="region">
          {examples.map(({ title, description, Component }, idx) => (
            <Tab
              key={idx}
              eventKey={idx}
              title={<TabTitleText>{title}</TabTitleText>}
            >
              {activeTabKey === idx && (
                <>
                  <TextContent
                    style={{ background: 'white' }}
                    className="pf-v5-u-p-xl"
                  >
                    <Text component={TextVariants.p}>{description}</Text>
                  </TextContent>
                  <Component />
                </>
              )}
            </Tab>
          ))}
        </Tabs>
      </StackItem>
    </Stack>
  );
};

export default ExamplesPage;
