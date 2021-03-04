import ENV from '../config/environment';
import Configuration from '@upfluence/ember-upf-utils/configuration';

export default {
  name: 'ember-upf-utils',
  initialize: function (/*registry*/) {
    if (Configuration.__initialized__) return;

    const config = ENV['ember-upf-utils'] || {};
    Configuration.load(config);
  }
};
