/* jshint node: true */
'use strict';

const cacheKeyForTree = require('calculate-cache-key-for-tree');
const { name, version } = require('./package');

module.exports = {
  name,
  version,

  isDevelopingAddon: function () {
    return true;
  },

  options: {
    'ember-cli-babel': {
      includePolyfill: true
    }
  },

  included(parent) {
    this._super.included.apply(this, arguments);

    if (parent.project.pkg.name === name) {
      // eslint-disable-next-line node/no-unpublished-require
      this.options.babel.plugins.push(...require('ember-cli-code-coverage').buildBabelPlugin());
    }
  },

  cacheKeyForTree(treeType) {
    return cacheKeyForTree(treeType, this, this.pkg);
  }
};
