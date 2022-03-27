module.exports = {
  roots: ["<rootDir>"],
  testMatch: ["**/__tests__/**/*.test.+(ts|tsx|js)"],
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig-test.json',
    },
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};
