import { Config } from "jest";
import NextJest from "next/jest.js";

const createJestConfig = NextJest({
  dir: "./",
});

const config: Config = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.(t|j)sx?$": [
      "@swc/jest",
      {
        jsc: {
          target: "es2022",
          parser: {
            syntax: "typescript",
            tsx: true,
          },
        },
      },
    ],
  },
  // Ensure these packages are transformed
  transformIgnorePatterns: ["/node_modules/(?!next-auth|@auth)"],
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
};

const exportedConfig = createJestConfig(config);
export default exportedConfig;
