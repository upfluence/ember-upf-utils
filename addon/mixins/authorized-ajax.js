import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  session: service(),

  get headers() {
    let headers = {};
    const authToken = this.get('session.data.authenticated.access_token');

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    return headers;
  }
});
