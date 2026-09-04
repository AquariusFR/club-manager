import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "scripts/**",
    "scratch/**",
    "temp_agent_skills/**",
    // Node.js utility scripts use CommonJS require
    "seed_calendrier.js",
    "sync_staff_photos.js",
    "*.config.js",
  ]),
  // Relax strict TypeScript and React rules for the entire project
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "react/no-unescaped-entities": "off",
    },
  },
  // Allow require() in .js files anywhere in the project
  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
]);

export default eslintConfig;
