import RSVP from 'rsvp';
import EmberObject, { computed } from '@ember/object';
import Service, { inject as service } from '@ember/service';
import { camelize, underscore } from '@ember/string';

import Configuration from '@upfluence/ember-upf-utils/configuration';

export default Service.extend({
  ajax: service(),
  session: service(),
  currentUser: service(),

  _fetchFeatureFlagsPromise: null,

  _featureURL: computed('session.data.authenticated.access_token', function () {
    let token = encodeURIComponent(
      this.get('session.data.authenticated.access_token')
    );
    return `${Configuration.meURL}/features?access_token=${token}`;
  }),

  allow(requestedFeature) {
    let [scope, feature] = requestedFeature.split('.');

    return this.currentUser.fetch().then(({ user }) => {
      if (scope === 'audience') return false;
      let hasScope = user.granted_scopes.includes(underscore(scope));

      if (!feature || !hasScope) {
        return hasScope;
      }

      return this._fetchFeatureFlags().then((featureFlags) => {
        return featureFlags.get(requestedFeature);
      });
    });
  },

  _fetchFeatureFlags() {
    if (this._fetchFeatureFlagsPromise) {
      return this._fetchFeatureFlagsPromise;
    }

    return this._fetchFeatureFlagsPromise = new RSVP.Promise((resolve) => {
      return this.ajax.request(this._featureURL).then((features) => {
        resolve(EmberObject.create(this._formatFeatureFlags(features)));
      });
    })
  },

  _formatFeatureFlags(flags) {
    return Object.keys(flags).reduce((acc, scope) => {
      acc[camelize(scope)] = flags[scope].reduce((camelizedScopes, flagName) => {
        camelizedScopes[camelize(flagName)] = true;
        return camelizedScopes;
      }, {})
      return acc
    }, {});
  }
});
