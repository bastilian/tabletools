import fecPlugin from '@redhat-cloud-services/eslint-config-redhat-cloud-services';
import tsParser from '@typescript-eslint/parser';
import jestDom from 'eslint-plugin-jest-dom';
import jsdoc from 'eslint-plugin-jsdoc';
import reactHooks from 'eslint-plugin-react-hooks';
import testingLibrary from 'eslint-plugin-testing-library';
import storybookPlugin from 'eslint-plugin-storybook';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';

export default defineConfig([
  tseslint.config(eslint.configs.recommended, tseslint.configs.recommended),
  globalIgnores(['node_modules/*', 'dist/*', 'docs/*', '**/coverage']),
  fecPlugin,
  reactHooks.configs['recommended-latest'],
  jsdoc.configs['flat/recommended'],
  testingLibrary.configs['flat/react'],
  jestDom.configs['flat/recommended'],
  {
    languageOptions: {
      parser: tsParser,
    },

    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'storybook/recommended': storybookPlugin,
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': 'warn',
      'rulesdir/forbid-pf-relative-imports': 'off',
      'rulesdir/disallow-fec-relative-imports': 'off',

      'jsdoc/require-param': [
        'warn',
        {
          enableRootFixer: false,
          enableFixer: false,
        },
      ],

      'jsdoc/tag-lines': 0,
      'jsdoc/require-jsdoc': 1,

      'jsdoc/check-tag-names': [
        1,
        {
          definedTags: ['document', 'group'],
        },
      ],

      'jsdoc/check-line-alignment': [
        'error',
        'always',
        {
          customSpacings: {
            postDelimiter: 2,
          },
        },
      ],

      'react-hooks/exhaustive-deps': [
        'warn',
        {
          additionalHooks:
            '(useDeepCompareEffect|useDeepCompareCallback|useDeepCompareMemo|useDeepCompareImperativeHandle|useDeepCompareLayoutEffect)',
        },
      ],
    },
  },
]);
