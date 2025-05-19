import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'node:path';
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-webpack5-compiler-swc",
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions"
  ],
  "framework": {
    "name": "@storybook/react-webpack5",
    "options": {}
  },
  webpackFinal: async (config) => {
   config.resolve.plugins = config.resolve.plugins || [];
   config.resolve.plugins.push(
     new TsconfigPathsPlugin({
       configFile: path.resolve(__dirname, "../tsconfig.json"),
     })
   );
if (config.resolve) {
     config.resolve.plugins = [
       ...(config.resolve.plugins || []),
       new TsconfigPathsPlugin({
         extensions: config.resolve.extensions,
       }),
     ];
   }
   return config;
  }
};
export default config;
