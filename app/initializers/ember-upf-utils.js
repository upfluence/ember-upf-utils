import ENV from '../config/environment';
import Configuration from 'ember-upf-utils/configuration';

export default {
  name: 'ember-upf-utils',
  initialize: function(registry) {
    const config   = ENV['ember-upf-utils'] || {};
    console.log(config);
    Configuration.load(config);
  }
};
