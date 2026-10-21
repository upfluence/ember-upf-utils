/*jshint node:true*/
'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const { withBrandAssets } = require('@upfluence/ember-brand-bundler/ember-cli');

module.exports = function (defaults) {
  const brand = process.env.BRAND ?? 'default';
  let app = new EmberAddon(defaults, {
    // Add options here
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  const { maybeEmbroider } = require('@embroider/test-setup');
  return maybeEmbroider(withBrandAssets(app, { brand, pageTitle: process.env.BRAND_PAGE_TITLE }), {
    skipBabel: [
      {
        package: 'qunit'
      }
    ]
  });
};
