/**
 * @author Mikiyas Birhanu And AI
 * @description ESLint configuration for the monorepo
 */
module.exports = {
  extends: [
    "next",
    "prettier"
  ],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "react/jsx-key": "warn"
  },
  ignorePatterns: [
    "node_modules",
    ".turbo",
    ".next",
    "public",
    "dist",
  ],
};
