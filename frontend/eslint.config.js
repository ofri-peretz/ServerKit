import js from '@eslint/js';
import globals from 'globals';
import reactFeatures from 'eslint-plugin-react-features';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import noStaticInlineStyles from './scripts/eslint-rules/no-static-inline-styles.mjs';

export default [
  { ignores: ['dist/**', 'node_modules/**'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      // 'latest' rather than a pinned year: import attributes
      // (`with { type: 'json' }`) are ES2025 and are required by Node's test
      // runner for the i18n manifest imports.
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      'react-features': reactFeatures,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      serverkit: { rules: { 'no-static-inline-styles': noStaticInlineStyles } },
    },
    rules: {
      ...js.configs.recommended.rules,
      // The rules eslint-plugin-react's "recommended" and "jsx-runtime" configs enabled, under their react-features names.
      ...Object.fromEntries([
        'jsx-key',
        'jsx-no-comment-textnodes',
        'jsx-no-duplicate-props',
        'jsx-no-target-blank',
        'jsx-no-undef',
        'jsx-uses-vars',
        'no-children-prop',
        'no-danger-with-children',
        'no-deprecated',
        'no-direct-mutation-state',
        'no-find-dom-node',
        'no-is-mounted',
        'no-render-return-value',
        'no-string-refs',
        'no-unescaped-entities',
        'no-unknown-property',
        'no-unsafe',
        'require-render-return',
      ].map((rule) => [`react-features/${rule}`, 'error'])),
      ...reactHooks.configs['recommended-latest'].rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'serverkit/no-static-inline-styles': 'warn',

      // Prefer shared controls; static styles are checked separately above.
      'no-restricted-syntax': [
        'warn',
        {
          selector: 'JSXOpeningElement[name.name="button"]',
          message: 'Use the shared Button component (or IconButton for icon-only actions).',
        },
        {
          // Match the legacy card family (.card, .card-header, .card-body, …) as a
          // class token — not unrelated compounds like `settings-card`,
          // `sk-spec-card`, or `wp-site-card-skeleton`, which the old `\bcard\b`
          // pattern flagged as false positives.
          selector: 'JSXOpeningElement[name.name="div"] > JSXAttribute[name.name="className"] > Literal[value=/(^|\\s)card(\\s|$|-)/]',
          message: 'Use the shared Card component instead of the legacy .card class.',
        },
      ],
    },
    settings: {
      react: { version: 'detect' },
    },
  },
];
