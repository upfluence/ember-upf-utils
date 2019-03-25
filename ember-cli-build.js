/*jshint node:true*/
/* global require, module */
'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {
    sourcemaps: { enabled: isNotDev() },
    minifyCSS: { enabled: isNotDev() },
    minifyJS: {
      enabled: isNotDev(),
      options: {
        mangle: false
      }
    },
    fingerprint: {
      prepend: process.env.CDN_URL,
      enabled: process.env.CDN_URL != null,
      extensions: [
        'js', 'css', 'png', 'jpg', 'gif', 'map', 'ico',
      ]
    },
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  return app.toTree();
};
