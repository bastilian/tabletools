import '@patternfly/patternfly/patternfly.css';
import { initialize, mswLoader } from 'msw-storybook-addon';

initialize();

const preview = {
  loaders: [mswLoader],
  parameters: {
    layout: 'fullscreen',
    docs: {
      codePanel: true,
    },
    controls: {
      disableSaveFromUI: true,
    },
  },
};

export default preview;
