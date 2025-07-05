/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+.(t|j)sx?$': ['ts-jest', {}],
  },
  setupFilesAfterEnv: ['<rootDir>/src/support/setupTests.js'],
  collectCoverage: true,
  coverageDirectory: './coverage/',
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.js',
    '!src/**/index.js',
    '!src/**/*.stories.*',
    '!src/support/**/*.{js,jsx}',
  ],
  roots: ['<rootDir>/src/'],
  moduleNameMapper: {
    '\\.(css|scss|svg)$': 'identity-obj-proxy',
    '^~/(.*)$': '<rootDir>/src/$1',
  },
};
