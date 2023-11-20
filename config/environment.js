/*jshint node:true*/
'use strict';

module.exports = function (environment, appConfig) {
  appConfig.build_env = process.env.BUILD_ENV || 'staging';
  appConfig.google_map_api_key = process.env.GOOGLE_MAP_API_KEY || '';

  return {
    modulePrefix: 'ember-upf-utils'
  };
};
