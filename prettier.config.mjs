/** Prettier config with package.json, import, and Tailwind class sort plugins. */
const config = {
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  printWidth: 80,
  tabWidth: 2,
  arrowParens: "always",
  bracketSpacing: true,
  endOfLine: "lf",
  plugins: [
    "prettier-plugin-packagejson",
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  importOrder: [
    "<TYPES>",
    "^(react/(.*)$)|^(react)$",
    "^(next/(.*)$)|^(next)$",
    "<THIRD_PARTY_MODULES>",
    "",
    "^@/(.*)$",
    "",
    "^[./]",
  ],
  importOrderTypeScriptVersion: "5.9.3",
  tailwindStylesheet: "./app/globals.css",
};

export default config;
