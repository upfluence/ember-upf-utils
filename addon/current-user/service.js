import Ember from 'ember';

export default Ember.Service.extend({
  ajax: Ember.inject.service(),
  session: Ember.inject.service(),

  meURL: Ember.computed('session.data.authenticated.access_token', function() {
    const url = Ember.getOwner(this).resolveRegistration(
      'config:environment'
    ).identityMeURL;
    const token = encodeURIComponent(
      this.get('session.data.authenticated.access_token')
    );

    return `${url}?access_token=${token}`;
  }),

  fetch() {
    return this.get('ajax').request(this.get('meURL'));
  }
});
