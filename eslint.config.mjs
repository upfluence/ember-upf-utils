// @ts-check
import { defineConfig } from 'eslint/config';
import { buildConfiguration } from '@upfluence/w-conf/eslint';

export default defineConfig(
  ...buildConfiguration({
    // Globs to exclude from linting
    // Preserved from .eslintignore
    ignores: [
      'blueprints/*/files/',
      'vendor/',
      'dist/',
      'tmp/',
      'bower_components/',
      'node_modules/',
      'coverage/',

      // ember-try
      '.node_modules.ember-try/',
      'bower.json.ember-try',
      'package.json.ember-try'
    ],

    // Node/CommonJS files that shouldn't be linted with browser rules
    // Note: .mjs files are intentionally excluded — nodeFiles() forces
    // sourceType: 'script', which breaks ESM `import`/`export` syntax.
    nodeFiles: [
      '.template-lintrc.js',
      'ember-cli-build.js',
      'index.js',
      'testem.js',
      'blueprints/*/index.js',
      'config/**/*.js',
      'tests/dummy/config/**/*.js'
    ]
  })
);
