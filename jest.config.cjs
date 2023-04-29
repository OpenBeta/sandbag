/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js|jsx)',
    '**/?(*.)+(spec|test).+(ts|tsx|js|jsx)'
  ],

  transformIgnorePatterns: [
    '/node_modules/(?!(my-module|other-module)/)',
    '\\.d\\.ts$'

  ]
}
