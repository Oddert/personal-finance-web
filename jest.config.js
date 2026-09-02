import { createJsWithTsPreset } from 'ts-jest';

export default {
    ...createJsWithTsPreset(),
    preset: 'ts-jest',
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    roots: [
        '<rootDir>/src'
    ],
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/**/*.d.ts'
    ],
    setupFiles: [
        'react-app-polyfill/jsdom'
    ],
    setupFilesAfterEnv: [
        '<rootDir>/src/setupTests.ts'
    ],
    testMatch: [
        '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
        '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'
    ],
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(ts|tsx)?$': ['ts-jest', { tsconfig: 'tsconfig.test.json', useESM: true }],
        '^.+\\.(js|jsx)?$': 'babel-jest'
    },
    transformIgnorePatterns: [
        '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$',
        '^.+\\.module\\.(css|sass|scss)$',
        'node_modules/(?!(uuid)/)'
    ],
    modulePaths: [],
    moduleNameMapper: {
        '^react-native$': 'react-native-web',
        '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
        '^.+\\.(css|less)$': '<rootDir>/config/CSSStub.js',
    },
    moduleFileExtensions: [
        'web.js',
        'js',
        'web.ts',
        'ts',
        'web.tsx',
        'tsx',
        'json',
        'web.jsx',
        'jsx',
        'node'
    ],
    watchPlugins: [
        'jest-watch-typeahead/filename',
        'jest-watch-typeahead/testname'
    ],
    resetMocks: true
};
