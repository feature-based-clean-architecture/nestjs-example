/**
 * FBCA boundary enforcement.
 *
 * This is the "linter" level of defense described in Part 4 of the series:
 * the dependency direction is no longer just a team convention, it is checked
 * automatically. A violation (e.g. presentation reaching into a repository, or
 * a use-case importing another module's domain instead of its external port)
 * fails the lint step.
 *
 * Allowed dependency direction inside a module:
 *
 *   presentation -> use-case -> infrastructure -> domain
 *                \-> external (own or neighbour) ----^
 *
 * Cross-module rule: a module may ONLY touch a neighbour through that
 * neighbour's `external/` port. It can never import the neighbour's
 * domain / infrastructure / use-case / presentation directly.
 */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'boundaries'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:boundaries/recommended',
  ],
  settings: {
    'import/resolver': {
      typescript: { project: './tsconfig.json' },
    },
    // Every file is classified into exactly one architectural element by path.
    // The `module` capture lets the rules below express "own module" vs
    // "neighbour module".
    'boundaries/elements': [
      { type: 'shared', pattern: 'src/shared/**', mode: 'full' },
      { type: 'domain', pattern: 'src/modules/*/domain/**', mode: 'full', capture: ['module'] },
      { type: 'infrastructure', pattern: 'src/modules/*/infrastructure/**', mode: 'full', capture: ['module'] },
      { type: 'use-case', pattern: 'src/modules/*/use-case/**', mode: 'full', capture: ['module'] },
      { type: 'external', pattern: 'src/modules/*/external/**', mode: 'full', capture: ['module'] },
      { type: 'presentation', pattern: 'src/modules/*/presentation/**', mode: 'full', capture: ['module'] },
    ],
    'boundaries/ignore': ['src/main.ts', 'src/app.module.ts', '**/*.spec.ts'],
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    // We express the whole FBCA policy through `element-types` below; the
    // preset's "private element" notion does not map onto this layout.
    'boundaries/no-private': 'off',
    'boundaries/entry-point': 'off',
    'boundaries/no-unknown': 'off',
    'boundaries/no-unknown-files': 'off',
    'boundaries/element-types': [
      'error',
      {
        default: 'disallow',
        message:
          'FBCA: ${file.type} is not allowed to depend on ${dependency.type}',
        rules: [
          { from: ['shared'], allow: ['shared'] },

          // Domain is the core: it knows nothing but its own kind + shared kernel.
          {
            from: ['domain'],
            allow: ['shared', ['domain', { module: '${from.module}' }]],
          },

          // Infrastructure persists/reconstitutes its OWN domain. (entity <-> repo
          // <-> repo.module are all 'infrastructure', hence the self-allow.)
          {
            from: ['infrastructure'],
            allow: [
              'shared',
              ['domain', { module: '${from.module}' }],
              ['infrastructure', { module: '${from.module}' }],
            ],
          },

          // A use-case orchestrates: its own domain + own infrastructure +
          // its own sibling use-case files (handler <-> module), and reaches
          // neighbours ONLY through their external port.
          {
            from: ['use-case'],
            allow: [
              'shared',
              ['domain', { module: '${from.module}' }],
              ['infrastructure', { module: '${from.module}' }],
              ['use-case', { module: '${from.module}' }],
              'external',
            ],
          },

          // The external port is the module's public contract: it composes the
          // module's own use-cases, may re-export its own domain types, and its
          // service/module files reference each other.
          {
            from: ['external'],
            allow: [
              'shared',
              ['domain', { module: '${from.module}' }],
              ['use-case', { module: '${from.module}' }],
              ['external', { module: '${from.module}' }],
            ],
          },

          // Presentation is the top sink. It drives its own use-cases, may read
          // any external port (own or neighbour) for display/aggregation, and
          // may reuse another module's presentation cross-cutting pieces
          // (e.g. the auth guard) as well as its own controller/service/dto.
          {
            from: ['presentation'],
            allow: [
              'shared',
              ['domain', { module: '${from.module}' }],
              ['use-case', { module: '${from.module}' }],
              'external',
              'presentation',
            ],
          },
        ],
      },
    ],
  },
};
