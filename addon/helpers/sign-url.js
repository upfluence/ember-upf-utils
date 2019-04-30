/* globals $ */
import { inject as service } from '@ember/service';
import Helper from '@ember/component/helper';
import { observer } from '@ember/object';

export default Helper.extend({
  session: service(),

  compute(params) {
    let [
      url,
      extra = {}
    ] = params;

    extra.access_token = this.get('session.data.authenticated.access_token');

    return `${url}?${$.param(extra)}`;
  },

  _: observer('session.data.authenticated.access_token', function() {
    this.recompute();
  })
});
