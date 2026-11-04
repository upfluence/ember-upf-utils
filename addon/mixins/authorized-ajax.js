import Mixin from '@ember/object/mixin';
import { service } from '@ember/service';

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
