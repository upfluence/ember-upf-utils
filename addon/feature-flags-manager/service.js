import RSVP from 'rsvp';
import EmberObject, { computed } from '@ember/object';
import Service, { inject as service } from '@ember/service';
import { camelize } from '@ember/string';

import Configuration from '@upfluence/ember-upf-utils/configuration';

export default Service.extend({
  ajax: service(),
  session: service(),

  _fetchFeatureFlagsPromise: null,

  _featureURL: computed('session.data.authenticated.access_token', function () {
    let token = encodeURIComponent(
      this.get('session.data.authenticated.access_token')
    );
    return `${Configuration.meURL}/features?access_token=${token}`;
  }),

  allow(requestedFeature) {
    return this._fetchFeatureFlags().then((featureFlags) => {
      return EmberObject.create(featureFlags).get(requestedFeature);
    });
  },

  _fetchFeatureFlags() {
    if (this._fetchFeatureFlagsPromise) {
      return this._fetchFeatureFlagsPromise;
    }

    return this._fetchFeatureFlagsPromise = new RSVP.Promise((resolve) => {
      return this.ajax.request(this._featureURL).then((features) => {
        resolve(this._formatFeatureFlags(features));
      });
    })
  },

  _formatFeatureFlags(flags) {
    return Object.keys(flags).reduce((acc, scope) => {
      acc[camelize(scope)] = flags[scope].reduce((acc, flagName) => {
        acc[camelize(flagName)] = true;
        return acc;
      }, {})
      return acc
    }, {});
  }
});
