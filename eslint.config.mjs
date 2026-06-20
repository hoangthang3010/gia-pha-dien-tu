import { defineConfig } from "eslint/config";

export default defineConfig({
  root: true,
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
  },
});
