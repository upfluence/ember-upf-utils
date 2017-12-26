import Ember from 'ember';

const { Helper, inject, observer } = Ember;

export default Helper.extend({
  session: inject.service(),

  compute(params) {
    let [url] = params;

    let token = encodeURIComponent(
      this.get('session.data.authenticated.access_token')
    );

    return `${url}?access_token=${token}`;
  },

  _: observer('session.data.authenticated.access_token', function() {
    this.recompute();
  })
});
