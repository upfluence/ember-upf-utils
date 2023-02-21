/* jshint node: true */
'use strict';

const cacheKeyForTree = require('calculate-cache-key-for-tree');
const { name, version } = require('./package');

const FOOTER_SCRIPTS = ['<script async src="https://www.google-analytics.com/analytics.js"></script>'];

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

  contentFor(type, config) {
    // Since emberjs dont nest contentFor call on sub addon
    // this add the google script for the ember-cli-google-analytics
    if (type === 'body-footer') {
      let footerContent = FOOTER_SCRIPTS;

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
