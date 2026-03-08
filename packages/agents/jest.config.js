module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  moduleFileExtensions: ['js', 'json', 'ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: 'packages/agents/tsconfig.json',
    }],
    '^.+\\.js$': 'babel-jest',
  },
  testMatch: ['**/*.spec.ts'],
};
