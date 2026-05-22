import Configuration from '@upfluence/ember-upf-utils/configuration';

import ENV from '../config/environment';

export default {
  name: 'ember-upf-utils',
  initialize: function (/*registry*/) {
    if (Configuration.__initialized__) return;

    const config = ENV['ember-upf-utils'] || {};
    Configuration.load(config);
  }
};
