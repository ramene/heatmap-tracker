/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  // Add paths to ignore during testing if needed
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  // Configure code coverage
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts"],
  coverageDirectory: "coverage",
  moduleDirectories: ["./node_modules", "./src"],
  rootDir: ".",
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};
