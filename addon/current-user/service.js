import Ember from 'ember';
import Configuration from 'ember-upf-utils/configuration';

const { computed, Service, inject, isNone, run } = Ember;

export default Service.extend({
  ajax: inject.service(),
  session: inject.service(),
  _cachedUrl: null,
  _cachedUser: null,

  init() {
    this._super();

    run.next(() => {
      this.fetch().then((payload) => {
        let user = payload.user;

        if (!isNone(window.Raven)){
          window.Raven.setUserContext({
            email: user.email,
            id: user.id
          });
        }

        if (!isNone(window.Intercom)){
          window.Intercom('update', {
            email: user.email,
            name: `${user.first_name} ${user.last_name}`,
            user_id: user.id
          });
        }

        if (!isNone(window.analytics)) {
          window.analytics.identify(user.id, {
            email: user.email,
            name: `${user.first_name} ${user.last_name}`,
            scopes: user.granted_scopes,
            extra: user.extra,
          });
        }
      });
    });
  },

  meURL: computed('session.data.authenticated.access_token', function() {
    const url = Configuration.meURL;
    const token = encodeURIComponent(
      this.get('session.data.authenticated.access_token')
    );

    return `${url}?access_token=${token}`;
  }),

  fetch() {
    if (this._cachedUrl === this.get('meURL')) {
      // return the current promise
      return this._cachedUser;
    }

    this._cachedUrl = this.get('meURL');

    return this._cachedUser = this.get('ajax').request(this.get('meURL'));
  }
});
