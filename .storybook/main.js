import path from 'node:path';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

export default {
  core: {
    disableTelemetry: true,
  },
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-webpack5-compiler-swc', '@storybook/addon-docs'],
  staticDirs: ['../public'],
  framework: {
    name: '@storybook/react-webpack5',
  },
  webpackFinal: async (config) => {
    config.resolve.plugins = config.resolve.plugins || [];
    config.resolve.plugins.push(
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, '../tsconfig.json'),
        extensions: config.resolve.extensions,
      }),
    );

    return config;
  },
};
