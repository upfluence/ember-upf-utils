import ENV from '../config/environment';
import Configuration from 'ember-upf-utils/configuration';

export default {
  name: 'ember-upf-utils',
  initialize: function(registry) {
    const config   = ENV['ember-upf-utils'] || {};
    Configuration.load(config);
  }
};
