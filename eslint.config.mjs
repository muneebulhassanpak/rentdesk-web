import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"
import boundaries from "eslint-plugin-boundaries"
import checkFile from "eslint-plugin-check-file"
import jsxA11y from "eslint-plugin-jsx-a11y"
import simpleImportSort from "eslint-plugin-simple-import-sort"
import unusedImports from "eslint-plugin-unused-imports"

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // Default ignores
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),

  // ─── File naming: kebab-case ───
  {
    plugins: { "check-file": checkFile },
    rules: {
      "check-file/filename-naming-convention": [
        "error",
        {
          "features/**/components/**/*.{ts,tsx}": "KEBAB_CASE",
          "features/**/hooks/**/*.{ts,tsx}": "KEBAB_CASE",
          "features/**/stores/**/*.{ts,tsx}": "KEBAB_CASE",
          "features/**/schemas/**/*.{ts,tsx}": "KEBAB_CASE",
          "features/**/services/**/*.{ts,tsx}": "KEBAB_CASE",
          "features/**/utils/**/*.{ts,tsx}": "KEBAB_CASE",
          "features/**/pages/**/*.{ts,tsx}": "KEBAB_CASE",
          "shared/**/*.{ts,tsx}": "KEBAB_CASE",
        },
        { ignoreMiddleExtensions: true },
      ],
      "check-file/folder-naming-convention": [
        "error",
        {
          "features/**": "KEBAB_CASE",
          "shared/**": "KEBAB_CASE",
        },
      ],
    },
  },

  // ─── Import sorting, unused imports, path alias enforcement ───
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
    },
    rules: {
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^react", "^next"],
            ["^@?\\w"],
            ["^@/"],
            ["^\\."],
            ["^\\u0000"],
            ["^.+\\.css$"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
      "unused-imports/no-unused-imports": "error",
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../../*"],
              message: "Use @/ path alias instead of deep relative imports.",
            },
          ],
        },
      ],
    },
  },

  // ─── TypeScript: no any, no console.log, type over interface, no enums ───
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "no-console": ["error", { allow: ["warn", "error"] }],
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "no-restricted-syntax": [
        "error",
        {
          selector: "TSEnumDeclaration",
          message: "Use `as const` objects instead of TypeScript enums.",
        },
        {
          selector:
            "CallExpression[callee.name='useEffect'] CallExpression[callee.name='fetch']",
          message:
            "Don't fetch in useEffect. Use TanStack Query or Server Components.",
        },
        {
          selector:
            "MemberExpression[object.name='process'][property.name='env']",
          message:
            "Don't access process.env directly. Import from @/shared/config/env instead.",
        },
      ],
    },
  },

  // ─── Allow process.env only in env config ───
  {
    files: ["shared/config/env.ts"],
    rules: {
      "no-restricted-syntax": "off",
    },
  },

  // ─── Exports: named only, except app router + feature pages ───
  {
    rules: {
      "import/no-default-export": "error",
    },
  },
  {
    files: ["app/**/*.{ts,tsx}"],
    rules: {
      "import/no-default-export": "off",
    },
  },
  {
    files: ["features/**/pages/**/*.{ts,tsx}"],
    rules: {
      "import/no-default-export": "off",
    },
  },
  // Allow default exports in config files
  {
    files: [
      "*.config.{js,mjs,ts}",
      "*.config.*.{js,mjs,ts}",
      "commitlint.config.mjs",
      "lint-staged.config.mjs",
    ],
    rules: {
      "import/no-default-export": "off",
    },
  },

  // ─── Feature boundary enforcement ───
  {
    plugins: { boundaries },
    settings: {
      "boundaries/elements": [
        { type: "app", pattern: "app/**" },
        {
          type: "feature",
          pattern: "features/*/**",
          capture: ["feature"],
        },
        { type: "shared", pattern: "shared/**" },
      ],
    },
    rules: {
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          rules: [
            {
              from: { type: "app" },
              allow: ["feature", "shared"],
            },
            {
              from: { type: "feature" },
              allow: ["shared", ["feature", { feature: "{{from.feature}}" }]],
            },
            {
              from: { type: "shared" },
              allow: ["shared"],
            },
          ],
        },
      ],
    },
  },

  // ─── Accessibility (plugin already registered by eslint-config-next) ───
  {
    rules: {
      ...jsxA11y.flatConfigs.strict.rules,
      "jsx-a11y/click-events-have-key-events": "error",
      "jsx-a11y/no-static-element-interactions": "error",
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/label-has-associated-control": "error",
      "jsx-a11y/interactive-supports-focus": "error",
    },
  },

  // ─── React: no array index key ───
  {
    rules: {
      "react/no-array-index-key": "error",
    },
  },

  // ─── Boolean naming (is/has/should/can) enforced via CLAUDE.md ───

  // ─── Magic numbers (warn only) ───
  {
    rules: {
      "no-magic-numbers": [
        "warn",
        {
          ignore: [0, 1, -1, 2],
          ignoreArrayIndexes: true,
          ignoreDefaultValues: true,
          enforceConst: true,
        },
      ],
    },
  },

  // ─── Disable magic numbers for shadcn primitives ───
  {
    files: ["shared/components/ui/**/*.{ts,tsx}", "shared/hooks/use-mobile.ts"],
    rules: {
      "no-magic-numbers": "off",
    },
  },

  // ─── Ban Loader2: use Button's `loading` prop instead ───
  {
    ignores: ["shared/components/ui/button.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../../*"],
              message: "Use @/ path alias instead of deep relative imports.",
            },
          ],
          paths: [
            {
              name: "lucide-react",
              importNames: ["Loader2"],
              message:
                "Use Button's `loading` prop instead of manual Loader2 spinners.",
            },
          ],
        },
      ],
    },
  },
])

export default eslintConfig
