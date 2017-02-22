/* jshint node: true */
'use strict';

var Funnel = require('broccoli-funnel');

module.exports = {
  name: 'ember-upf-utils',

  isDevelopingAddon: function() {
      return true;
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
  }
};
