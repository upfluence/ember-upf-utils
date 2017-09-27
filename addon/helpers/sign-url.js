import Ember from 'ember';

export default Ember.Helper.extend({
  session: Ember.inject.service(),

  compute(params) {
    let [url] = params;

    let token = encodeURIComponent(
      this.get('session.data.authenticated.access_token')
    );

    return `${url}?access_token=${token}`;
  }
});
