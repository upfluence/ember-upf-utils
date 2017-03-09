import Ember from 'ember';
import Configuration from 'ember-upf-utils/configuration';

export default Ember.Service.extend({
  ajax: Ember.inject.service(),
  session: Ember.inject.service(),

  meURL: Ember.computed('session.data.authenticated.access_token', function() {
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
