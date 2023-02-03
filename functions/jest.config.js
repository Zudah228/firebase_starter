const { pathsToModuleNameMapper } = require('ts-jest');
const tsconfig = require('./tsconfig.json');

/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ["dotenv/config"],
  // tsconfig のパスエイリアスを設定
  // https://kulshekhar.github.io/ts-jest/docs/getting-started/paths-mapping/#jest-config-with-helper
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths , { prefix: '<rootDir>/' } )
}
