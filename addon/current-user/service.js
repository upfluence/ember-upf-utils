import Ember from 'ember';
import Configuration from 'ember-upf-utils/configuration';

const { computed, Service, inject, isNone, run } = Ember;

export default Service.extend({
  ajax: inject.service(),
  session: inject.service(),
  raven: inject.service(),

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
    return this.get('ajax').request(this.get('meURL'));
  }
});
