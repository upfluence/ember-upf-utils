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
    },
    babel: {
      /* eslint-disable node/no-unpublished-require */
      plugins: [...require('ember-cli-code-coverage').buildBabelPlugin()]
    }
  },

  cacheKeyForTree(treeType) {
    return cacheKeyForTree(treeType, this, this.pkg);
  }
};
