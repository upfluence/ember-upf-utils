import { inject as service } from '@ember/service';
import Helper from '@ember/component/helper';
import { observer } from '@ember/object';

export default Helper.extend({
  session: service(),

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
