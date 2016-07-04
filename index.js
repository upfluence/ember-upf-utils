/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-upf-utils',

  treeForPublic: function(tree) {
    this._requireBuildPackages();

    if (!tree) {
      return tree;
    }

    return this.pickFiles(tree, {
      srcDir: '/',
      destDir: 'assets/' + this.moduleName()
    });
  }
};
