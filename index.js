/* jshint node: true */
'use strict';

var path = require('path');
var Funnel = require('broccoli-funnel');
var MergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: require('./package').name,

  isDevelopingAddon: function() {
    return true;
  },

  options: {
    babel: {
      plugins: ['transform-object-rest-spread']
    },

    'ember-cli-babel': {
      includePolyfill: true
    }
  },

  treeForPublic: function(tree) {
    this._requireBuildPackages();

    if (!tree) {
      return tree;
    }

    return new Funnel(tree, {
      srcDir: '/',
      destDir: 'assets/' + this.moduleName()
    });
  },

  included: function() {
    this._super.included.apply(this, arguments);
    this.import('vendor/tinycolor/tinycolor.js');
    this.import('vendor/shims/tinycolor.js');
  },

  treeForVendor(vendorTree) {
    var tinyTree = new Funnel(path.dirname(require.resolve('tinycolor2')), {
      files: ['tinycolor.js'],
      destDir: '/tinycolor',
    });

    return new MergeTrees([vendorTree, tinyTree]);
  }
};
