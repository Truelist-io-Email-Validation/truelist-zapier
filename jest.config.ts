import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathPattern: 'src/test',
  moduleFileExtensions: ['ts', 'js', 'json'],
};

export default config;
