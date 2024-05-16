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
      plugins: [...require('ember-cli-code-coverage').buildBabelPlugin()]
    }
  },

  contentFor(type, config) {
    if (type === 'body-footer') {
      let footerContent = [];

      let emberBasicDropdown = this.addons.find((addon) => {
        return addon.name === 'ember-power-select';
      });

      if (emberBasicDropdown) {
        footerContent.push(emberBasicDropdown.contentFor(type, config));
      }

      return footerContent.join('');
    }
  },

  cacheKeyForTree(treeType) {
    return cacheKeyForTree(treeType, this, this.pkg);
  }
};
