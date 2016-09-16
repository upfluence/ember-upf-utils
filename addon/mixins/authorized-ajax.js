import Ember from 'ember';

export default Ember.Mixin.create({
  session: Ember.inject.service(),

  headers: Ember.computed('session.data.authenticated.access_token', {
    get() {
      let headers = {};
      const authToken = this.get('session.data.authenticated.access_token');
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
      return headers;
    }
  })
});
