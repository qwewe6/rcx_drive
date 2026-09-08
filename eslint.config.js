const expoConfig = require("eslint-config-expo/flat");
const prettierConfig = require("eslint-config-prettier");

module.exports = [
  ...expoConfig,
  prettierConfig,
  {
    ignores: ["dist/*", "node_modules/*", ".expo/*"],
  },
  {
    // jest.setup.js runs in the Jest environment, where `jest` is a global.
    files: ["jest.setup.js"],
    languageOptions: {
      globals: {
        jest: "readonly",
      },
    },
  },
];
