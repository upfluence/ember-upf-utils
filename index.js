/* jshint node: true */
'use strict';

var path = require('path');
var Funnel = require('broccoli-funnel');
var MergeTrees = require('broccoli-merge-trees');
var writeFile = require('broccoli-file-creator');
const calculateCacheKeyForTree = require('calculate-cache-key-for-tree');

const FOOTER_SCRIPTS = ['<script async src="https://www.google-analytics.com/analytics.js"></script>'];
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

  treeForPublic: function (tree) {
    if (!tree) {
      return tree;
    }

    return new Funnel(tree, {
      srcDir: '/',
      destDir: 'assets/' + this.moduleName()
    });
  },

  cacheKeyForTree(tree) {
    return calculateCacheKeyForTree(tree, this);
  },

  included: function () {
    this._super.included.apply(this, arguments);

    this.import('vendor/tinycolor/tinycolor.js');
    this.import('vendor/shims/tinycolor.js');
  },

  treeForVendor(vendorTree) {
    let content = `Ember.libraries.register('${name}', '${version}');`;
    let registerVersionTree = writeFile('ember-upf-utils/register-version.js', content);
    let tinyTree = new Funnel(path.dirname(require.resolve('tinycolor2')), {
      files: ['tinycolor.js'],
      destDir: '/tinycolor'
    });

    return new MergeTrees([registerVersionTree, vendorTree, tinyTree]);
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
  }
};
