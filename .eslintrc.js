module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['jsdoc', '@typescript-eslint'],
  ignorePatterns: ['dist', 'docs', 'coverage'],
  extends: ['@redhat-cloud-services/eslint-config-redhat-cloud-services', 'plugin:testing-library/react', 'plugin:jest-dom/recommended', 'plugin:jsdoc/recommended', 'plugin:react-hooks/recommended', 'plugin:@typescript-eslint/recommended', 'plugin:storybook/recommended'],
  rules: {
    '@typescript-eslint/ban-ts-comment': 'warn',
    'rulesdir/forbid-pf-relative-imports': 'off',
    'jsdoc/require-param': [
      'warn',
      { enableRootFixer: false, enableFixer: false },
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
      { customSpacings: { postDelimiter: 2 } },
    ],
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks:
          '(useDeepCompareEffect|useDeepCompareCallback|useDeepCompareMemo|useDeepCompareImperativeHandle|useDeepCompareLayoutEffect)',
      },
    ],
  },
};
